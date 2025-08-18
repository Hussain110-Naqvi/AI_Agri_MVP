const bigQueryService = require('./bigquery-service');
const { supabaseAdmin } = require('../database/supabase');
require('dotenv').config();

class BigQuerySupabaseConnector {
  constructor() {
    this.isRunning = false;
    this.lastSyncTime = null;
    this.syncErrors = [];
    this.syncStats = {
      totalRecords: 0,
      successfulUpserts: 0,
      errors: 0,
      duplicatesSkipped: 0
    };
  }

  /**
   * Main method to sync all data from BigQuery to Supabase
   * @param {string} organizationId - Organization to sync data for
   * @param {object} options - Sync options
   * @returns {Promise<object>} Sync results
   */
  async syncAllData(organizationId, options = {}) {
    if (this.isRunning) {
      throw new Error('Sync operation already in progress');
    }

    this.isRunning = true;
    this.syncErrors = [];
    this.syncStats = {
      totalRecords: 0,
      successfulUpserts: 0,
      errors: 0,
      duplicatesSkipped: 0
    };

    console.log(`🔄 Starting BigQuery to Supabase sync for organization: ${organizationId}`);
    const startTime = Date.now();

    try {
      // Define sync operations
      const syncOperations = [
        {
          name: 'inventory_data',
          bigQueryTable: 'inventory_data',
          supabaseTable: 'inventory',
          transformer: this.transformInventoryData.bind(this)
        },
        {
          name: 'sales_transactions',
          bigQueryTable: 'sales_transactions', 
          supabaseTable: 'purchase_transactions',
          transformer: this.transformSalesData.bind(this)
        },
        {
          name: 'market_prices',
          bigQueryTable: 'market_prices',
          supabaseTable: 'market_data',
          transformer: this.transformMarketData.bind(this)
        },
        {
          name: 'customer_profiles',
          bigQueryTable: 'customer_profiles',
          supabaseTable: 'customers',
          transformer: this.transformCustomerData.bind(this)
        },
        {
          name: 'supplier_data',
          bigQueryTable: 'supplier_data',
          supabaseTable: 'suppliers',
          transformer: this.transformSupplierData.bind(this)
        }
      ];

      // Execute sync operations
      for (const operation of syncOperations) {
        try {
          console.log(`📊 Syncing ${operation.name}...`);
          const result = await this.syncTable(organizationId, operation, options);
          console.log(`✅ ${operation.name}: ${result.upserted} records synced`);
        } catch (error) {
          console.error(`❌ Error syncing ${operation.name}:`, error.message);
          this.syncErrors.push({
            table: operation.name,
            error: error.message,
            timestamp: new Date().toISOString()
          });
        }
      }

      const duration = Date.now() - startTime;
      this.lastSyncTime = new Date().toISOString();

      const results = {
        success: this.syncErrors.length === 0,
        duration: `${(duration / 1000).toFixed(2)}s`,
        stats: this.syncStats,
        errors: this.syncErrors,
        lastSyncTime: this.lastSyncTime
      };

      console.log(`🎉 Sync completed in ${results.duration}`);
      console.log(`📈 Total: ${this.syncStats.totalRecords}, Success: ${this.syncStats.successfulUpserts}, Errors: ${this.syncStats.errors}`);

      return results;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Sync a single table from BigQuery to Supabase
   * @param {string} organizationId - Organization ID
   * @param {object} operation - Sync operation config
   * @param {object} options - Sync options
   * @returns {Promise<object>} Sync result
   */
  async syncTable(organizationId, operation, options = {}) {
    const { bigQueryTable, supabaseTable, transformer } = operation;
    
    // Build BigQuery query
    const query = this.buildBigQueryQuery(bigQueryTable, organizationId, options);
    
    // Fetch data from BigQuery
    console.log(`🔍 Fetching data from BigQuery table: ${bigQueryTable}`);
    const bigQueryData = await bigQueryService.executeQuery(query, { orgId: organizationId });
    
    if (!bigQueryData || bigQueryData.length === 0) {
      console.log(`⚠️ No data found in BigQuery table: ${bigQueryTable}`);
      return { fetched: 0, upserted: 0, skipped: 0 };
    }

    console.log(`📥 Retrieved ${bigQueryData.length} records from BigQuery`);
    this.syncStats.totalRecords += bigQueryData.length;

    // Transform data for Supabase
    const transformedData = await transformer(bigQueryData, organizationId);
    
    // Batch upsert to Supabase
    const result = await this.batchUpsertToSupabase(supabaseTable, transformedData);
    
    this.syncStats.successfulUpserts += result.upserted;
    this.syncStats.duplicatesSkipped += result.skipped;
    
    return result;
  }

  /**
   * Build BigQuery query with filters
   * @param {string} tableName - BigQuery table name
   * @param {string} organizationId - Organization ID
   * @param {object} options - Query options
   * @returns {string} SQL query
   */
  buildBigQueryQuery(tableName, organizationId, options = {}) {
    const baseQuery = `
      SELECT *
      FROM \`${process.env.BIGQUERY_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.${tableName}\`
      WHERE organization_id = @orgId
    `;

    let query = baseQuery;

    // Add date filters if specified
    if (options.startDate) {
      query += ` AND created_at >= @startDate`;
    }
    
    if (options.endDate) {
      query += ` AND created_at <= @endDate`;
    }

    // Add incremental sync support
    if (options.incrementalSync && this.lastSyncTime) {
      query += ` AND updated_at > @lastSyncTime`;
    }

    query += ` ORDER BY created_at DESC`;

    // Add limit if specified
    if (options.limit) {
      query += ` LIMIT @limit`;
    }

    return query;
  }

  /**
   * Batch upsert data to Supabase with conflict resolution
   * @param {string} tableName - Supabase table name
   * @param {Array} data - Data to upsert
   * @returns {Promise<object>} Upsert result
   */
  async batchUpsertToSupabase(tableName, data) {
    if (!data || data.length === 0) {
      return { upserted: 0, skipped: 0 };
    }

    const batchSize = 100; // Supabase batch limit
    let totalUpserted = 0;
    let totalSkipped = 0;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      try {
        const { data: result, error } = await supabaseAdmin
          .from(tableName)
          .upsert(batch, { 
            onConflict: this.getConflictColumn(tableName),
            ignoreDuplicates: false 
          })
          .select('id');

        if (error) {
          console.error(`❌ Batch upsert error for ${tableName}:`, error);
          this.syncStats.errors += batch.length;
          throw error;
        }

        const upsertedCount = result ? result.length : batch.length;
        totalUpserted += upsertedCount;
        
        console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}: ${upsertedCount}/${batch.length} records upserted to ${tableName}`);
        
      } catch (error) {
        console.error(`❌ Failed to upsert batch to ${tableName}:`, error);
        this.syncStats.errors += batch.length;
        throw error;
      }
    }

    return { upserted: totalUpserted, skipped: totalSkipped };
  }

  /**
   * Get conflict resolution column for each table
   * @param {string} tableName - Table name
   * @returns {string} Conflict column
   */
  getConflictColumn(tableName) {
    const conflictColumns = {
      'inventory': 'sku',
      'purchase_transactions': 'id',
      'market_data': 'id',
      'customers': 'email',
      'suppliers': 'name,organization_id'
    };
    
    return conflictColumns[tableName] || 'id';
  }

  /**
   * Transform BigQuery inventory data for Supabase
   * @param {Array} data - BigQuery data
   * @param {string} organizationId - Organization ID
   * @returns {Promise<Array>} Transformed data
   */
  async transformInventoryData(data, organizationId) {
    return data.map(item => ({
      id: item.id || this.generateUUID(),
      organization_id: organizationId,
      product_name: item.product_name,
      sku: item.sku || `SKU-${item.product_name?.replace(/\s+/g, '-').toUpperCase()}`,
      quantity: parseInt(item.current_stock) || 0,
      unit_cost: parseFloat(item.unit_cost) || 0,
      unit_price: parseFloat(item.unit_price) || 0,
      unit_type: item.unit_type || 'unit',
      category: item.category || 'general',
      reorder_level: parseInt(item.reorder_level) || 0,
      supplier_id: null, // Will be linked later if supplier data exists
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
      is_active: true
    }));
  }

  /**
   * Transform BigQuery sales data for Supabase
   * @param {Array} data - BigQuery data
   * @param {string} organizationId - Organization ID
   * @returns {Promise<Array>} Transformed data
   */
  async transformSalesData(data, organizationId) {
    return data.map(item => ({
      id: item.transaction_id || this.generateUUID(),
      organization_id: organizationId,
      customer_id: null, // Will be linked if customer exists
      product_id: null, // Will be linked if product exists  
      quantity: parseInt(item.quantity_sold) || 0,
      unit_price: parseFloat(item.unit_price) || 0,
      total_amount: parseFloat(item.total_amount) || 0,
      transaction_date: item.transaction_date || new Date().toISOString(),
      payment_method: item.payment_method || 'cash',
      created_at: item.created_at || new Date().toISOString()
    }));
  }

  /**
   * Transform BigQuery market data for Supabase
   * @param {Array} data - BigQuery data
   * @param {string} organizationId - Organization ID
   * @returns {Promise<Array>} Transformed data
   */
  async transformMarketData(data, organizationId) {
    return data.map(item => ({
      id: this.generateUUID(),
      organization_id: organizationId,
      date: item.price_date || new Date().toISOString().split('T')[0],
      commodity: item.commodity,
      price: parseFloat(item.current_price) || 0,
      price_change: parseFloat(item.price_change_percent) || 0,
      volume: parseInt(item.volume) || 0,
      weather_json: item.weather_data ? JSON.parse(item.weather_data) : {},
      pricing_index: {
        current: item.current_price,
        change: item.price_change_percent,
        trend: item.price_trend || 'stable'
      },
      created_at: new Date().toISOString()
    }));
  }

  /**
   * Transform BigQuery customer data for Supabase
   * @param {Array} data - BigQuery data
   * @param {string} organizationId - Organization ID
   * @returns {Promise<Array>} Transformed data
   */
  async transformCustomerData(data, organizationId) {
    return data.map(item => ({
      id: item.customer_id || this.generateUUID(),
      organization_id: organizationId,
      name: item.customer_name || item.name,
      email: item.email,
      phone: item.phone,
      address: item.address ? (typeof item.address === 'string' ? JSON.parse(item.address) : item.address) : {},
      customer_type: item.customer_segment || item.customer_type || 'farmer',
      purchase_patterns: item.purchase_patterns ? JSON.parse(item.purchase_patterns) : {},
      total_purchases: parseFloat(item.total_purchases) || 0,
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
      is_active: item.is_active !== false
    }));
  }

  /**
   * Transform BigQuery supplier data for Supabase
   * @param {Array} data - BigQuery data
   * @param {string} organizationId - Organization ID
   * @returns {Promise<Array>} Transformed data
   */
  async transformSupplierData(data, organizationId) {
    return data.map(item => ({
      id: item.supplier_id || this.generateUUID(),
      organization_id: organizationId,
      name: item.supplier_name || item.name,
      contact_info: item.contact_info ? (typeof item.contact_info === 'string' ? JSON.parse(item.contact_info) : item.contact_info) : {},
      products_supplied: item.products_supplied || [],
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
      is_active: item.is_active !== false
    }));
  }

  /**
   * Generate UUID for new records
   * @returns {string} UUID
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Get sync status and statistics
   * @returns {object} Current sync status
   */
  getSyncStatus() {
    return {
      isRunning: this.isRunning,
      lastSyncTime: this.lastSyncTime,
      stats: this.syncStats,
      recentErrors: this.syncErrors.slice(-10) // Last 10 errors
    };
  }

  /**
   * Test BigQuery connection
   * @returns {Promise<boolean>} Connection status
   */
  async testBigQueryConnection() {
    try {
      return await bigQueryService.testConnection();
    } catch (error) {
      console.error('BigQuery connection test failed:', error);
      return false;
    }
  }

  /**
   * Test Supabase connection
   * @returns {Promise<boolean>} Connection status
   */
  async testSupabaseConnection() {
    try {
      const { data, error } = await supabaseAdmin
        .from('organizations')
        .select('count', { count: 'exact', head: true });
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  }

  /**
   * Perform health check on both services
   * @returns {Promise<object>} Health status
   */
  async healthCheck() {
    const [bigQueryHealthy, supabaseHealthy] = await Promise.all([
      this.testBigQueryConnection(),
      this.testSupabaseConnection()
    ]);

    return {
      bigQuery: bigQueryHealthy,
      supabase: supabaseHealthy,
      overall: bigQueryHealthy && supabaseHealthy,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new BigQuerySupabaseConnector();
