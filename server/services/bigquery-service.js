require("dotenv").config();
const { BigQuery } = require('@google-cloud/bigquery');

// BigQuery service for integrating with client's data
class BigQueryService {
  constructor() {
    this.projectId = process.env.BIGQUERY_PROJECT_ID;
    this.datasetId = process.env.BIGQUERY_DATASET_ID;
    this.serviceAccountKey = process.env.BIGQUERY_SERVICE_ACCOUNT_KEY;

    // Initialize BigQuery client
    this.bigquery = null;
    this.initializeBigQuery();
  }

  /**
   * Initialize BigQuery client with proper authentication
   */
  initializeBigQuery() {
    try {
      if (this.serviceAccountKey && this.projectId) {
        // Parse service account key from environment variable
        const credentials = JSON.parse(this.serviceAccountKey);

        this.bigquery = new BigQuery({
          projectId: this.projectId,
          credentials: credentials
        });

        console.log('✅ BigQuery client initialized with service account');
      } else {
        console.log('⚠️ BigQuery credentials missing');
      }
    } catch (error) {
      console.error('❌ Failed to initialize BigQuery:', error.message);
    }
  }

  /**
   * Execute a BigQuery SQL query
   * @param {string} query - SQL query to execute
   * @param {object} parameters - Query parameters
   * @returns {Promise<Array>} Query results
   */
  async executeQuery(query, parameters = {}) {
    try {
      const requestBody = {
        query: query,
        useLegacySql: false,
        parameterMode: Object.keys(parameters).length > 0 ? "NAMED" : undefined,
        queryParameters: this.formatParameters(parameters),
      };

      const response = await fetch(
        `${this.baseUrl}/projects/${this.projectId}/queries`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${await this.getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        throw new Error(
          `BigQuery API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      return this.formatResults(data);
    } catch (error) {
      console.error("BigQuery query execution failed:", error);
      throw error;
    }
  }

  /**
   * Get dashboard data for charts and visualizations
   * @param {string} organizationId - Organization identifier
   * @returns {Promise<object>} Dashboard data
   */
  async getDashboardData(organizationId) {
    try {
      const queries = {
        // Inventory trends
        inventoryTrends: `
          SELECT 
            DATE(timestamp) as date,
            product_category,
            SUM(quantity) as total_quantity,
            AVG(unit_cost) as avg_cost
          FROM \`${this.projectId}.${this.datasetId}.inventory_data\`
          WHERE organization_id = @orgId
            AND timestamp >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
          GROUP BY date, product_category
          ORDER BY date DESC
        `,

        // Sales performance
        salesData: `
          SELECT 
            DATE(transaction_date) as date,
            SUM(total_amount) as daily_sales,
            COUNT(*) as transaction_count,
            AVG(total_amount) as avg_transaction
          FROM \`${this.projectId}.${this.datasetId}.sales_transactions\`
          WHERE organization_id = @orgId
            AND transaction_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
          GROUP BY date
          ORDER BY date DESC
        `,

        // Market trends
        marketTrends: `
          SELECT 
            commodity,
            price_date,
            current_price,
            price_change_percent,
            volume
          FROM \`${this.projectId}.${this.datasetId}.market_prices\`
          WHERE price_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
          ORDER BY commodity, price_date DESC
        `,

        // Customer insights
        customerInsights: `
          SELECT 
            customer_segment,
            COUNT(*) as customer_count,
            AVG(total_purchases) as avg_purchases,
            SUM(total_purchases) as total_revenue
          FROM \`${this.projectId}.${this.datasetId}.customer_profiles\`
          WHERE organization_id = @orgId
          GROUP BY customer_segment
        `,

        // Supply chain alerts
        alerts: `
          SELECT 
            alert_type,
            severity,
            message,
            created_at,
            status
          FROM \`${this.projectId}.${this.datasetId}.supply_chain_alerts\`
          WHERE organization_id = @orgId
            AND status = 'active'
          ORDER BY created_at DESC
          LIMIT 10
        `,
      };

      const results = {};
      const parameters = { orgId: organizationId };

      // Execute all queries in parallel
      const queryPromises = Object.entries(queries).map(
        async ([key, query]) => {
          try {
            const data = await this.executeQuery(query, parameters);
            return [key, data];
          } catch (error) {
            console.error(`Error executing ${key} query:`, error);
            return [key, []];
          }
        },
      );

      const queryResults = await Promise.all(queryPromises);
      queryResults.forEach(([key, data]) => {
        results[key] = data;
      });

      return results;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }

  /**
   * Get data for AI/Gemini processing
   * @param {string} dataType - Type of data needed (inventory, sales, market, etc.)
   * @param {object} filters - Additional filters
   * @returns {Promise<Array>} Formatted data for AI processing
   */
  async getDataForAI(dataType, filters = {}) {
    try {
      const baseQueries = {
        inventory: `
          SELECT 
            product_name,
            category,
            current_stock,
            reorder_level,
            avg_monthly_consumption,
            supplier_info,
            last_order_date,
            lead_time_days
          FROM \`${this.projectId}.${this.datasetId}.inventory_summary\`
          WHERE organization_id = @orgId
        `,

        sales_patterns: `
          SELECT 
            product_id,
            product_name,
            customer_segment,
            DATE(transaction_date) as date,
            quantity_sold,
            revenue,
            seasonality_factor
          FROM \`${this.projectId}.${this.datasetId}.sales_history\`
          WHERE organization_id = @orgId
            AND transaction_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
        `,

        market_conditions: `
          SELECT 
            commodity,
            price_date,
            current_price,
            price_trend,
            volatility_index,
            weather_impact,
            demand_forecast
          FROM \`${this.projectId}.${this.datasetId}.market_analysis\`
          WHERE price_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
        `,

        customer_behavior: `
          SELECT 
            customer_id,
            customer_segment,
            purchase_frequency,
            seasonal_preferences,
            price_sensitivity,
            loyalty_score,
            growth_potential
          FROM \`${this.projectId}.${this.datasetId}.customer_analytics\`
          WHERE organization_id = @orgId
        `,
      };

      if (!baseQueries[dataType]) {
        throw new Error(`Unknown data type: ${dataType}`);
      }

      let query = baseQueries[dataType];
      const parameters = { orgId: filters.organizationId };

      // Add additional filters
      if (filters.startDate) {
        query += ` AND date >= @startDate`;
        parameters.startDate = filters.startDate;
      }

      if (filters.endDate) {
        query += ` AND date <= @endDate`;
        parameters.endDate = filters.endDate;
      }

      if (filters.category) {
        query += ` AND category = @category`;
        parameters.category = filters.category;
      }

      const results = await this.executeQuery(query, parameters);
      return this.formatForAI(results, dataType);
    } catch (error) {
      console.error(`Error fetching ${dataType} data for AI:`, error);
      throw error;
    }
  }

  /**
   * Format query parameters for BigQuery
   * @param {object} parameters - Raw parameters
   * @returns {Array} Formatted parameters
   */
  formatParameters(parameters) {
    return Object.entries(parameters).map(([name, value]) => ({
      name,
      parameterType: {
        type: typeof value === "number" ? "INT64" : "STRING",
      },
      parameterValue: {
        value: value.toString(),
      },
    }));
  }

  /**
   * Format BigQuery results into a more usable format
   * @param {object} rawResults - Raw BigQuery response
   * @returns {Array} Formatted results
   */
  formatResults(rawResults) {
    if (!rawResults.rows) return [];

    const schema = rawResults.schema?.fields || [];
    return rawResults.rows.map((row) => {
      const formattedRow = {};
      row.f.forEach((field, index) => {
        const fieldName = schema[index]?.name || `field_${index}`;
        formattedRow[fieldName] = field.v;
      });
      return formattedRow;
    });
  }

  /**
   * Format data specifically for AI/ML processing
   * @param {Array} data - Raw query results
   * @param {string} dataType - Type of data
   * @returns {Array} AI-formatted data
   */
  formatForAI(data, dataType) {
    // Add specific formatting logic based on data type
    switch (dataType) {
      case "inventory":
        return data.map((item) => ({
          ...item,
          stock_status:
            item.current_stock <= item.reorder_level ? "low" : "normal",
          days_of_supply: Math.floor(
            item.current_stock / (item.avg_monthly_consumption / 30),
          ),
        }));

      case "sales_patterns":
        return data.map((item) => ({
          ...item,
          revenue_per_unit: item.revenue / item.quantity_sold,
          trend: this.calculateTrend(item),
        }));

      default:
        return data;
    }
  }

  /**
   * Calculate trend for sales data
   * @param {object} item - Sales data item
   * @returns {string} Trend indicator
   */
  calculateTrend(item) {
    // Simple trend calculation - in a real implementation,
    // this would be more sophisticated
    return item.seasonality_factor > 1.1
      ? "increasing"
      : item.seasonality_factor < 0.9
        ? "decreasing"
        : "stable";
  }

  /**
   * Get access token for BigQuery API
   * @returns {Promise<string>} Access token
   */
  async getAccessToken() {
    // For service account authentication
    if (this.serviceAccountKey) {
      // Implement service account token generation
      // This would typically use Google Auth Library
      return await this.getServiceAccountToken();
    }

    // For API key authentication (simpler but less secure)
    return this.apiKey;
  }

  /**
   * Get service account token (placeholder for proper implementation)
   * @returns {Promise<string>} Service account token
   */
  async getServiceAccountToken() {
    // This would implement proper service account authentication
    // For now, return API key as fallback
    return this.apiKey;
  }

  /**
   * Test BigQuery connection
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      const testQuery = `SELECT 1 as test_value`;
      await this.executeQuery(testQuery);
      console.log("✅ BigQuery connection successful");
      return true;
    } catch (error) {
      console.error("❌ BigQuery connection failed:", error);
      return false;
    }
  }
}

module.exports = new BigQueryService();
