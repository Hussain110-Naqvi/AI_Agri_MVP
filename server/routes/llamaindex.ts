import express, { Request, Response } from 'express';
import llamaindexService from '../services/llamaindex-service';

const router = express.Router();

interface InsightsRequest {
  query: string;
  options?: any;
}

interface ComprehensiveReportRequest {
  commodities?: string[];
  timeframe?: number;
  includeWeather?: boolean;
  includeFertilizer?: boolean;
}

/**
 * @route GET /api/llamaindex/test
 * @desc Test LlamaIndex connection
 * @access Public
 */
router.get('/test', async (_req: Request, res: Response) => {
  try {
    const connectionStatus = await llamaindexService.testConnection();
    
    res.json({
      success: true,
      message: 'LlamaIndex connection test completed',
      connectionStatus: connectionStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('LlamaIndex test error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route POST /api/llamaindex/insights
 * @desc Get agricultural insights using natural language query
 * @access Public
 */
router.post('/insights', async (req: Request<{}, {}, InsightsRequest>, res: Response) => {
  try {
    const { query, options = {} } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required',
        timestamp: new Date().toISOString()
      });
    }

    const insights = await llamaindexService.getAgriculturalInsights(query, options);
    
    res.json(insights);
  } catch (error) {
    console.error('LlamaIndex insights error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route GET /api/llamaindex/market-trends/:commodity
 * @desc Get market trends for specific commodity
 * @access Public
 */
router.get('/market-trends/:commodity', async (req: Request<{ commodity: string }, {}, {}, { days?: string }>, res: Response) => {
  try {
    const { commodity } = req.params;
    const { days = '30' } = req.query;
    
    const trends = await llamaindexService.getMarketTrends(commodity, parseInt(days));
    
    res.json(trends);
  } catch (error) {
    console.error('Market trends error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route GET /api/llamaindex/planting-intentions
 * @desc Get planting intentions analysis
 * @access Public
 */
router.get('/planting-intentions', async (req: Request<{}, {}, {}, { grainType?: string; location?: string }>, res: Response) => {
  try {
    const { grainType = 'corn', location = 'Canada' } = req.query;
    
    const intentions = await llamaindexService.getPlantingIntentions(grainType, location);
    
    res.json(intentions);
  } catch (error) {
    console.error('Planting intentions error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route GET /api/llamaindex/fertilizer-analysis
 * @desc Get fertilizer price analysis
 * @access Public
 */
router.get('/fertilizer-analysis', async (req: Request<{}, {}, {}, { fertilizerType?: string }>, res: Response) => {
  try {
    const { fertilizerType = 'phosphate_potash' } = req.query;
    
    const analysis = await llamaindexService.getFertilizerAnalysis(fertilizerType);
    
    res.json(analysis);
  } catch (error) {
    console.error('Fertilizer analysis error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route GET /api/llamaindex/weather-impact
 * @desc Get weather impact analysis
 * @access Public
 */
router.get('/weather-impact', async (req: Request<{}, {}, {}, { region?: string; days?: string }>, res: Response) => {
  try {
    const { region = 'North America', days = '90' } = req.query;
    
    const impact = await llamaindexService.getWeatherImpact(region, parseInt(days));
    
    res.json(impact);
  } catch (error) {
    console.error('Weather impact error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route POST /api/llamaindex/comprehensive-report
 * @desc Get comprehensive agricultural report
 * @access Public
 */
router.post('/comprehensive-report', async (req: Request<{}, {}, ComprehensiveReportRequest>, res: Response) => {
  try {
    const options = req.body;
    
    const report = await llamaindexService.getComprehensiveReport(options);
    
    res.json(report);
  } catch (error) {
    console.error('Comprehensive report error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route GET /api/llamaindex/schemas
 * @desc Get available schemas and tables
 * @access Public
 */
router.get('/schemas', async (_req: Request, res: Response) => {
  try {
    const schemas = {
      llm_access: {
        description: 'Agricultural data schema with market, weather, and USDA data',
        tables: [
          'baltic_dry_index',
          'boc_agri_commodity_index',
          'corn_futures',
          'planting_intentions',
          'soybeans_futures',
          'usda_corn',
          'usda_fertilizer',
          'usda_phosphate_potash',
          'usda_weather'
        ]
      }
    };
    
    res.json({
      success: true,
      schemas: schemas,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Schemas error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
