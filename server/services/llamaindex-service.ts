import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

interface LlamaIndexConfig {
  database: {
    type: string;
    connection: Pool;
  };
  schema: string;
}

interface AgriculturalInsightsOptions {
  focus?: string;
  commodity?: string;
  timeframe?: number;
  grainType?: string;
  location?: string;
  fertilizerType?: string;
  region?: string;
}

interface AgriculturalInsightsResult {
  success: boolean;
  query: string;
  results?: any;
  error?: string;
  timestamp: string;
}

interface MarketTrendsResult extends AgriculturalInsightsResult {
  focus: string;
  commodity: string;
  timeframe: number;
}

interface PlantingIntentionsResult extends AgriculturalInsightsResult {
  focus: string;
  grainType: string;
  location: string;
}

interface FertilizerAnalysisResult extends AgriculturalInsightsResult {
  focus: string;
  fertilizerType: string;
}

interface WeatherImpactResult extends AgriculturalInsightsResult {
  focus: string;
  region: string;
  timeframe: number;
}

interface ComprehensiveReportOptions {
  commodities?: string[];
  timeframe?: number;
  includeWeather?: boolean;
  includeFertilizer?: boolean;
}

interface ComprehensiveReport {
  timestamp: string;
  summary: any;
  marketAnalysis: Record<string, any>;
  plantingIntentions: any;
  weatherImpact: any;
  fertilizerAnalysis: any;
  recommendations: any[];
}

interface ComprehensiveReportResult {
  success: boolean;
  report?: ComprehensiveReport;
  partialReport?: ComprehensiveReport;
  error?: string;
}

class LlamaIndexService {
  private pool: Pool;
  private llamaindex: any; // Will be properly typed when LlamaIndex types are available

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'agri_supply',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    });

    this.llamaindex = null;
    this.initializeLlamaIndex();
  }

  /**
   * Initialize LlamaIndex with database connection
   */
  private async initializeLlamaIndex(): Promise<void> {
    try {
      // Initialize LlamaIndex with database connection
      // Note: This is a placeholder - you'll need to implement based on actual LlamaIndex API
      this.llamaindex = {
        query: async (options: any) => {
          // Placeholder implementation
          console.log('LlamaIndex query:', options);
          return { placeholder: 'LlamaIndex integration pending' };
        }
      };

      console.log('✅ LlamaIndex initialized with PostgreSQL connection');
    } catch (error) {
      console.error('❌ Failed to initialize LlamaIndex:', error);
    }
  }

  /**
   * Get agricultural insights using LlamaIndex
   */
  async getAgriculturalInsights(query: string, options: AgriculturalInsightsOptions = {}): Promise<AgriculturalInsightsResult> {
    try {
      if (!this.llamaindex) {
        throw new Error('LlamaIndex not initialized');
      }

      const results = await this.llamaindex.query({
        query: query,
        schema: 'llm_access',
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
        ],
        ...options
      });

      return {
        success: true,
        query: query,
        results: results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting agricultural insights:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        query: query,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get market trends analysis
   */
  async getMarketTrends(commodity: string = 'corn', days: number = 30): Promise<MarketTrendsResult> {
    const query = `Analyze market trends for ${commodity} over the last ${days} days. Include price movements, volume changes, and any significant patterns.`;
    
    const result = await this.getAgriculturalInsights(query, {
      focus: 'market_analysis',
      commodity: commodity,
      timeframe: days
    });

    return {
      ...result,
      focus: 'market_analysis',
      commodity: commodity,
      timeframe: days
    };
  }

  /**
   * Get planting intentions analysis
   */
  async getPlantingIntentions(grainType: string = 'corn', location: string = 'Canada'): Promise<PlantingIntentionsResult> {
    const query = `Analyze planting intentions for ${grainType} in ${location}. Include trends, changes from previous years, and implications for supply and demand.`;
    
    const result = await this.getAgriculturalInsights(query, {
      focus: 'planting_analysis',
      grainType: grainType,
      location: location
    });

    return {
      ...result,
      focus: 'planting_analysis',
      grainType: grainType,
      location: location
    };
  }

  /**
   * Get fertilizer price analysis
   */
  async getFertilizerAnalysis(fertilizerType: string = 'phosphate_potash'): Promise<FertilizerAnalysisResult> {
    const query = `Analyze fertilizer prices for ${fertilizerType}. Include price trends, seasonal patterns, and factors affecting costs.`;
    
    const result = await this.getAgriculturalInsights(query, {
      focus: 'fertilizer_analysis',
      fertilizerType: fertilizerType
    });

    return {
      ...result,
      focus: 'fertilizer_analysis',
      fertilizerType: fertilizerType
    };
  }

  /**
   * Get weather impact analysis
   */
  async getWeatherImpact(region: string = 'North America', days: number = 90): Promise<WeatherImpactResult> {
    const query = `Analyze weather impact on agriculture in ${region} over the last ${days} days. Include temperature patterns, precipitation, and implications for crop development.`;
    
    const result = await this.getAgriculturalInsights(query, {
      focus: 'weather_analysis',
      region: region,
      timeframe: days
    });

    return {
      ...result,
      focus: 'weather_analysis',
      region: region,
      timeframe: days
    };
  }

  /**
   * Get comprehensive agricultural report
   */
  async getComprehensiveReport(options: ComprehensiveReportOptions = {}): Promise<ComprehensiveReportResult> {
    const {
      commodities = ['corn', 'soybeans'],
      timeframe = 30,
      includeWeather = true,
      includeFertilizer = true
    } = options;

    const report: ComprehensiveReport = {
      timestamp: new Date().toISOString(),
      summary: {},
      marketAnalysis: {},
      plantingIntentions: {},
      weatherImpact: {},
      fertilizerAnalysis: {},
      recommendations: []
    };

    try {
      // Get market trends for each commodity
      for (const commodity of commodities) {
        report.marketAnalysis[commodity] = await this.getMarketTrends(commodity, timeframe);
      }

      // Get planting intentions
      report.plantingIntentions = await this.getPlantingIntentions('corn', 'Canada');

      // Get weather impact if requested
      if (includeWeather) {
        report.weatherImpact = await this.getWeatherImpact('North America', timeframe);
      }

      // Get fertilizer analysis if requested
      if (includeFertilizer) {
        report.fertilizerAnalysis = await this.getFertilizerAnalysis('phosphate_potash');
      }

      // Generate recommendations based on analysis
      report.recommendations = await this.generateRecommendations(report);

      return {
        success: true,
        report: report
      };
    } catch (error) {
      console.error('Error generating comprehensive report:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        partialReport: report
      };
    }
  }

  /**
   * Generate recommendations based on analysis
   */
  private async generateRecommendations(analysis: ComprehensiveReport): Promise<any[]> {
    const recommendations: any[] = [];

    try {
      // Analyze market trends for recommendations
      if (analysis.marketAnalysis) {
        for (const [commodity, data] of Object.entries(analysis.marketAnalysis)) {
          if (data.success && data.results) {
            recommendations.push({
              type: 'market_trend',
              commodity: commodity,
              priority: 'high',
              message: `Monitor ${commodity} market trends closely based on recent analysis`,
              data: data.results
            });
          }
        }
      }

      // Add planting intentions recommendations
      if (analysis.plantingIntentions && analysis.plantingIntentions.success) {
        recommendations.push({
          type: 'planting_intentions',
          priority: 'medium',
          message: 'Review planting intentions data for supply planning',
          data: analysis.plantingIntentions.results
        });
      }

      // Add weather recommendations
      if (analysis.weatherImpact && analysis.weatherImpact.success) {
        recommendations.push({
          type: 'weather_impact',
          priority: 'medium',
          message: 'Consider weather patterns in agricultural planning',
          data: analysis.weatherImpact.results
        });
      }

      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [{
        type: 'error',
        priority: 'low',
        message: 'Unable to generate recommendations due to analysis error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }];
    }
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT NOW() as current_time');
      client.release();
      
      console.log('✅ Database connection successful:', result.rows[0]);
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      console.log('✅ Database connection closed');
    }
  }
}

export default new LlamaIndexService();
