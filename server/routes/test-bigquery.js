const express = require('express');
const router = express.Router();
const bigQuerySupabaseConnector = require('../services/bigquery-supabase-connector');

/**
 * @route GET /api/test-bigquery/health
 * @desc Test BigQuery connection
 * @access Public (for testing)
 */
router.get('/health', async (req, res) => {
  try {
    console.log('🔍 Testing BigQuery connection...');
    
    // Test health check
    const health = await bigQuerySupabaseConnector.healthCheck();
    
    res.json({
      success: true,
      message: 'BigQuery connection test completed',
      data: health
    });
    
  } catch (error) {
    console.error('❌ BigQuery test failed:', error);
    res.status(500).json({
      success: false,
      message: 'BigQuery connection test failed',
      error: error.message
    });
  }
});

/**
 * @route GET /api/test-bigquery/list-tables
 * @desc List available BigQuery tables
 * @access Public (for testing)
 */
router.get('/list-tables', async (req, res) => {
  try {
    console.log('📊 Listing BigQuery tables...');
    
    const projectId = process.env.BIGQUERY_PROJECT_ID;
    const datasetId = process.env.BIGQUERY_DATASET_ID;
    
    if (!projectId || !datasetId) {
      return res.status(400).json({
        success: false,
        message: 'BigQuery configuration missing',
        details: {
          projectId: !!projectId,
          datasetId: !!datasetId
        }
      });
    }
    
    // Simple query to test connection
    const testQuery = `
      SELECT table_name, table_type, creation_time
      FROM \`${projectId}.${datasetId}.INFORMATION_SCHEMA.TABLES\`
      ORDER BY creation_time DESC
    `;
    
    const bigQueryService = require('../services/bigquery-service');
    const tables = await bigQueryService.executeQuery(testQuery);
    
    res.json({
      success: true,
      message: 'BigQuery tables retrieved successfully',
      data: {
        projectId,
        datasetId,
        tables: tables || []
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to list BigQuery tables:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list BigQuery tables',
      error: error.message
    });
  }
});

module.exports = router;
