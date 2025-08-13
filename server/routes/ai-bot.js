const express = require('express');
const router = express.Router();
const geminiService = require('../services/gemini-service');
const bigQueryService = require('../services/bigquery-service');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

/**
 * @route POST /api/ai-bot/query
 * @desc Process user query with AI bot
 * @access Private
 */
router.post('/query', 
  authenticateToken,
  [
    body('query').notEmpty().withMessage('Query is required'),
    body('query').isLength({ min: 1, max: 1000 }).withMessage('Query must be between 1 and 1000 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { query, context = {} } = req.body;
      const organizationId = req.user.organization_id;
      const userContext = {
        ...context,
        userRole: req.user.role,
        userId: req.user.id
      };

      // Check for quick responses first
      const quickResponse = geminiService.getQuickResponse(query);
      if (quickResponse) {
        return res.json({
          success: true,
          data: {
            query,
            response: quickResponse.text,
            insights: quickResponse.insights,
            actions: quickResponse.actions,
            confidence: quickResponse.confidence,
            responseTime: 0,
            isQuickResponse: true
          }
        });
      }

      const startTime = Date.now();
      
      // Process query with AI
      const result = await geminiService.processQuery(query, organizationId, userContext);
      
      const responseTime = Date.now() - startTime;

      res.json({
        success: true,
        data: {
          ...result,
          responseTime,
          isQuickResponse: false
        }
      });

    } catch (error) {
      console.error('AI bot query error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process query',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route GET /api/ai-bot/dashboard-data
 * @desc Get dashboard data from BigQuery
 * @access Private
 */
router.get('/dashboard-data', authenticateToken, async (req, res) => {
  try {
    const organizationId = req.user.organization_id;
    
    const dashboardData = await bigQueryService.getDashboardData(organizationId);
    
    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route GET /api/ai-bot/data/:dataType
 * @desc Get specific data type for AI processing
 * @access Private
 */
router.get('/data/:dataType', authenticateToken, async (req, res) => {
  try {
    const { dataType } = req.params;
    const organizationId = req.user.organization_id;
    const filters = {
      organizationId,
      ...req.query
    };

    const validDataTypes = ['inventory', 'sales_patterns', 'market_conditions', 'customer_behavior'];
    
    if (!validDataTypes.includes(dataType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid data type. Must be one of: ${validDataTypes.join(', ')}`
      });
    }

    const data = await bigQueryService.getDataForAI(dataType, filters);
    
    res.json({
      success: true,
      data: {
        dataType,
        results: data,
        count: data.length,
        filters: filters
      }
    });

  } catch (error) {
    console.error(`Data fetch error for ${req.params.dataType}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route GET /api/ai-bot/suggestions
 * @desc Get AI-powered suggestions based on current data
 * @access Private
 */
router.get('/suggestions', authenticateToken, async (req, res) => {
  try {
    const organizationId = req.user.organization_id;
    
    // Get current inventory and sales data
    const inventoryData = await bigQueryService.getDataForAI('inventory', { organizationId });
    const salesData = await bigQueryService.getDataForAI('sales_patterns', { organizationId });
    
    // Generate suggestions based on data patterns
    const suggestions = [];

    // Low stock suggestions
    const lowStockItems = inventoryData.filter(item => item.stock_status === 'low');
    if (lowStockItems.length > 0) {
      suggestions.push({
        type: 'inventory_alert',
        priority: 'high',
        title: 'Low Stock Alert',
        message: `${lowStockItems.length} items are running low on stock`,
        action: 'Review inventory and place orders',
        items: lowStockItems.slice(0, 5).map(item => item.product_name)
      });
    }

    // Sales trend suggestions
    const recentSales = salesData.slice(0, 10);
    if (recentSales.length > 0) {
      const trendingProducts = recentSales
        .filter(item => item.trend === 'increasing')
        .slice(0, 3);
      
      if (trendingProducts.length > 0) {
        suggestions.push({
          type: 'sales_opportunity',
          priority: 'medium',
          title: 'Trending Products',
          message: `${trendingProducts.length} products showing increased demand`,
          action: 'Consider increasing stock levels',
          items: trendingProducts.map(item => item.product_name)
        });
      }
    }

    res.json({
      success: true,
      data: {
        suggestions,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Suggestions generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate suggestions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route POST /api/ai-bot/feedback
 * @desc Store user feedback on AI responses
 * @access Private
 */
router.post('/feedback',
  authenticateToken,
  [
    body('queryId').optional().isUUID().withMessage('Invalid query ID'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('feedback').optional().isLength({ max: 500 }).withMessage('Feedback must be less than 500 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { queryId, rating, feedback } = req.body;
      const userId = req.user.id;

      // Store feedback (in a real implementation, this would go to a database)
      console.log('AI Bot Feedback:', {
        queryId,
        rating,
        feedback,
        userId,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: 'Feedback recorded successfully'
      });

    } catch (error) {
      console.error('Feedback storage error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to store feedback',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route GET /api/ai-bot/health
 * @desc Check AI bot service health
 * @access Private
 */
router.get('/health', authenticateToken, async (req, res) => {
  try {
    const services = {
      gemini: false,
      bigquery: false
    };

    // Test Gemini connection
    try {
      services.gemini = await geminiService.testConnection();
    } catch (error) {
      console.error('Gemini health check failed:', error);
    }

    // Test BigQuery connection
    try {
      services.bigquery = await bigQueryService.testConnection();
    } catch (error) {
      console.error('BigQuery health check failed:', error);
    }

    const allHealthy = Object.values(services).every(status => status === true);

    res.json({
      success: true,
      data: {
        status: allHealthy ? 'healthy' : 'degraded',
        services,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
