require("dotenv").config();
const { LlamaIndex } = require("llamaindex");
const { Pool } = require("pg");

class LlamaIndexService {
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
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
  async initializeLlamaIndex() {
    try {
      // Initialize LlamaIndex with database connection
      this.llamaindex = new LlamaIndex({
        database: {
          type: 'postgresql',
          connection: this.pool
        },
        schema: 'llm_access'
      });

      console.log('✅ LlamaIndex initialized with PostgreSQL connection');
    } catch (error) {
      console.error('❌ Failed to initialize LlamaIndex:', error.message);
    }
  }

  /**
   * Get agricultural insights using LlamaIndex
   * @param {string} query - Natural language query about agricultural data
   * @param {object} options - Query options
   * @returns {Promise<object>} Query results and insights
   */
  async getAgriculturalInsights(query, options = {}) {
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
        error: error.message,
        query: query,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get market trends analysis
   * @param {string} commodity - Commodity to analyze (corn, soybeans, etc.)
   * @param {number} days - Number of days to look back
   * @returns {Promise<object>} Market trends analysis
   */
  async getMarketTrends(commodity = 'corn', days = 30) {
    const query = `Analyze market trends for ${commodity} over the last ${days} days. Include price movements, volume changes, and any significant patterns.`;
    
    return await this.getAgriculturalInsights(query, {
      focus: 'market_analysis',
      commodity: commodity,
      timeframe: days
    });
  }

  /**
   * Get planting intentions analysis
   * @param {string} grainType - Type of grain to analyze
   * @param {string} location - Location to focus on
   * @returns {Promise<object>} Planting intentions analysis
   */
  async getPlantingIntentions(grainType = 'corn', location = 'Canada') {
    const query = `Analyze planting intentions for ${grainType} in ${location}. Include trends, changes from previous years, and implications for supply and demand.`;
    
    return await this.getAgriculturalInsights(query, {
      focus: 'planting_analysis',
      grainType: grainType,
      location: location
    });
  }

  /**
   * Get fertilizer price analysis
   * @param {string} fertilizerType - Type of fertilizer to analyze
   * @returns {Promise<object>} Fertilizer price analysis
   */
  async getFertilizerAnalysis(fertilizerType = 'phosphate_potash') {
    const query = `Analyze fertilizer prices for ${fertilizerType}. Include price trends, seasonal patterns, and factors affecting costs.`;
    
    return await this.getAgriculturalInsights(query, {
      focus: 'fertilizer_analysis',
      fertilizerType: fertilizerType
    });
  }

  /**
   * Get weather impact analysis
   * @param {string} region - Region to analyze
   * @param {number} days - Number of days to look back
   * @returns {Promise<object>} Weather impact analysis
   */
  async getWeatherImpact(region = 'North America', days = 90) {
    const query = `Analyze weather impact on agriculture in ${region} over the last ${days} days. Include temperature patterns, precipitation, and implications for crop development.`;
    
    return await this.getAgriculturalInsights(query, {
      focus: 'weather_analysis',
      region: region,
      timeframe: days
    });
  }

  /**
   * Get comprehensive agricultural report
   * @param {object} options - Report options
   * @returns {Promise<object>} Comprehensive agricultural report
   */
  async getComprehensiveReport(options = {}) {
    const {
      commodities = ['corn', 'soybeans'],
      timeframe = 30,
      includeWeather = true,
      includeFertilizer = true
    } = options;

    const report = {
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
        error: error.message,
        partialReport: report
      };
    }
  }

  /**
   * Generate recommendations based on analysis
   * @param {object} analysis - Analysis results
   * @returns {Promise<Array>} Array of recommendations
   */
  async generateRecommendations(analysis) {
    const recommendations = [];

    try {
      // Analyze market trends for recommendations
      if (analysis.marketAnalysis) {
        for (const [commodity, data] of Object.entries(analysis.marketAnalysis)) {
          if (data.success && data.results) {
            // Add commodity-specific recommendations
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
        error: error.message
      }];
    }
  }

  /**
   * Test database connection
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT NOW() as current_time');
      client.release();
      
      console.log('✅ Database connection successful:', result.rows[0]);
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
  }

  /**
   * Close database connection
   */
  async close() {
    if (this.pool) {
      await this.pool.end();
      console.log('✅ Database connection closed');
    }
  }
}

module.exports = new LlamaIndexService();
