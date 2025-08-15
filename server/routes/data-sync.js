const express = require('express');
const router = express.Router();
const bigQuerySupabaseConnector = require('../services/bigquery-supabase-connector');
const { authenticateToken } = require('../middleware/auth');
const { body, query, validationResult } = require('express-validator');

/**
 * @route POST /api/data-sync/sync
 * @desc Start full data sync from BigQuery to Supabase
 * @access Private (Admin only)
 */
router.post('/sync', 
  authenticateToken,
  [
    body('organizationId').optional().isUUID().withMessage('Invalid organization ID'),
    body('options.startDate').optional().isISO8601().withMessage('Invalid start date'),
    body('options.endDate').optional().isISO8601().withMessage('Invalid end date'),
    body('options.incrementalSync').optional().isBoolean().withMessage('Incremental sync must be boolean'),
    body('options.limit').optional().isInt({ min: 1, max: 10000 }).withMessage('Limit must be between 1 and 10000')
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

      // Check if user has admin privileges
      if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions. Admin or manager role required.'
        });
      }

      const organizationId = req.body.organizationId || req.user.organization_id;
      const options = req.body.options || {};

      console.log(`🚀 Starting data sync for organization: ${organizationId}`);
      console.log(`📋 Sync options:`, options);

      // Start sync process
      const result = await bigQuerySupabaseConnector.syncAllData(organizationId, options);

      res.json({
        success: true,
        message: 'Data sync completed',
        data: result
      });

    } catch (error) {
      console.error('Data sync error:', error);
      res.status(500).json({
        success: false,
        message: 'Data sync failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route GET /api/data-sync/status
 * @desc Get current sync status and statistics
 * @access Private
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const status = bigQuerySupabaseConnector.getSyncStatus();
    
    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Error getting sync status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sync status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route GET /api/data-sync/health
 * @desc Check health of BigQuery and Supabase connections
 * @access Private
 */
router.get('/health', authenticateToken, async (req, res) => {
  try {
    const health = await bigQuerySupabaseConnector.healthCheck();
    
    res.json({
      success: true,
      data: health
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

/**
 * @route POST /api/data-sync/table
 * @desc Sync a specific table from BigQuery to Supabase
 * @access Private (Admin only)
 */
router.post('/table',
  authenticateToken,
  [
    body('tableName').notEmpty().isIn(['inventory_data', 'sales_transactions', 'market_prices', 'customer_profiles', 'supplier_data'])
      .withMessage('Invalid table name'),
    body('organizationId').optional().isUUID().withMessage('Invalid organization ID'),
    body('options.startDate').optional().isISO8601().withMessage('Invalid start date'),
    body('options.endDate').optional().isISO8601().withMessage('Invalid end date'),
    body('options.limit').optional().isInt({ min: 1, max: 10000 }).withMessage('Limit must be between 1 and 10000')
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

      // Check permissions
      if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions. Admin or manager role required.'
        });
      }

      const { tableName } = req.body;
      const organizationId = req.body.organizationId || req.user.organization_id;
      const options = req.body.options || {};

      // Define table mapping
      const tableOperations = {
        'inventory_data': {
          name: 'inventory_data',
          bigQueryTable: 'inventory_data',
          supabaseTable: 'inventory',
          transformer: bigQuerySupabaseConnector.transformInventoryData.bind(bigQuerySupabaseConnector)
        },
        'sales_transactions': {
          name: 'sales_transactions',
          bigQueryTable: 'sales_transactions', 
          supabaseTable: 'purchase_transactions',
          transformer: bigQuerySupabaseConnector.transformSalesData.bind(bigQuerySupabaseConnector)
        },
        'market_prices': {
          name: 'market_prices',
          bigQueryTable: 'market_prices',
          supabaseTable: 'market_data',
          transformer: bigQuerySupabaseConnector.transformMarketData.bind(bigQuerySupabaseConnector)
        },
        'customer_profiles': {
          name: 'customer_profiles',
          bigQueryTable: 'customer_profiles',
          supabaseTable: 'customers',
          transformer: bigQuerySupabaseConnector.transformCustomerData.bind(bigQuerySupabaseConnector)
        },
        'supplier_data': {
          name: 'supplier_data',
          bigQueryTable: 'supplier_data',
          supabaseTable: 'suppliers',
          transformer: bigQuerySupabaseConnector.transformSupplierData.bind(bigQuerySupabaseConnector)
        }
      };

      const operation = tableOperations[tableName];
      
      console.log(`📊 Starting sync for table: ${tableName}`);
      const result = await bigQuerySupabaseConnector.syncTable(organizationId, operation, options);

      res.json({
        success: true,
        message: `Table ${tableName} sync completed`,
        data: {
          table: tableName,
          result: result,
          organizationId: organizationId
        }
      });

    } catch (error) {
      console.error(`Table sync error for ${req.body.tableName}:`, error);
      res.status(500).json({
        success: false,
        message: `Table ${req.body.tableName} sync failed`,
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route POST /api/data-sync/schedule
 * @desc Schedule automatic sync (placeholder for future cron job implementation)
 * @access Private (Admin only)
 */
router.post('/schedule',
  authenticateToken,
  [
    body('frequency').isIn(['hourly', 'daily', 'weekly']).withMessage('Invalid frequency'),
    body('organizationId').optional().isUUID().withMessage('Invalid organization ID'),
    body('enabled').isBoolean().withMessage('Enabled must be boolean')
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

      // Check permissions
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions. Admin role required.'
        });
      }

      const { frequency, enabled } = req.body;
      const organizationId = req.body.organizationId || req.user.organization_id;

      // For now, just store the schedule preference
      // In a production system, this would integrate with a job scheduler like node-cron
      console.log(`📅 Schedule sync request:`, { frequency, enabled, organizationId });

      res.json({
        success: true,
        message: 'Sync schedule updated',
        data: {
          frequency,
          enabled,
          organizationId,
          note: 'Scheduled sync will be implemented in production version'
        }
      });

    } catch (error) {
      console.error('Schedule sync error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to schedule sync',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route GET /api/data-sync/history
 * @desc Get sync history and logs
 * @access Private
 */
router.get('/history',
  authenticateToken,
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative')
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

      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;

      // For now, return current status as history
      // In production, this would query a sync_logs table
      const status = bigQuerySupabaseConnector.getSyncStatus();
      
      const mockHistory = {
        total: 1,
        limit,
        offset,
        records: [{
          id: 1,
          organizationId: req.user.organization_id,
          startTime: status.lastSyncTime,
          endTime: status.lastSyncTime,
          status: status.isRunning ? 'running' : 'completed',
          stats: status.stats,
          errors: status.recentErrors
        }]
      };

      res.json({
        success: true,
        data: mockHistory
      });

    } catch (error) {
      console.error('Error getting sync history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get sync history',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route DELETE /api/data-sync/cancel
 * @desc Cancel ongoing sync operation
 * @access Private (Admin only)
 */
router.delete('/cancel', 
  authenticateToken,
  async (req, res) => {
    try {
      // Check permissions
      if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions. Admin or manager role required.'
        });
      }

      const status = bigQuerySupabaseConnector.getSyncStatus();
      
      if (!status.isRunning) {
        return res.json({
          success: true,
          message: 'No sync operation is currently running'
        });
      }

      // Note: Actual cancellation would require more sophisticated implementation
      // For now, just return a message
      res.json({
        success: true,
        message: 'Sync cancellation requested',
        note: 'Graceful cancellation will be implemented in production version'
      });

    } catch (error) {
      console.error('Cancel sync error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel sync',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

module.exports = router;
