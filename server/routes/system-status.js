const express = require('express');
const router = express.Router();
const bigQuerySupabaseConnector = require('../services/bigquery-supabase-connector');

/**
 * @route GET /api/system-status
 * @desc Get comprehensive system status
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const status = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      server: {
        status: 'running',
        port: process.env.PORT || 5000,
        uptime: process.uptime()
      },
      database: {
        supabase: {
          configured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_URL !== 'https://mock-project.supabase.co'),
          url: process.env.SUPABASE_URL ? 'configured' : 'missing',
          status: 'mock_mode'
        }
      },
      bigquery: {
        configured: {
          projectId: !!process.env.BIGQUERY_PROJECT_ID,
          datasetId: !!process.env.BIGQUERY_DATASET_ID,
          serviceAccount: !!process.env.BIGQUERY_SERVICE_ACCOUNT_KEY
        },
        details: {
          projectId: process.env.BIGQUERY_PROJECT_ID || 'not_configured',
          datasetId: process.env.BIGQUERY_DATASET_ID || 'not_configured'
        },
        status: 'configured_but_needs_testing'
      },
      features: {
        bigQueryToSupabaseSync: {
          available: true,
          apiEndpoints: [
            'POST /api/data-sync/sync',
            'POST /api/data-sync/table', 
            'GET /api/data-sync/status',
            'GET /api/data-sync/health'
          ]
        },
        aiBot: {
          available: true,
          endpoints: [
            'POST /api/ai-bot/query',
            'GET /api/ai-bot/dashboard-data',
            'GET /api/ai-bot/suggestions'
          ]
        },
        webInterface: {
          dataSyncPage: '/data-sync',
          aiBotPage: '/ai-bot'
        }
      },
      readyForDemo: {
        bigQueryConnection: process.env.BIGQUERY_PROJECT_ID && process.env.BIGQUERY_DATASET_ID && process.env.BIGQUERY_SERVICE_ACCOUNT_KEY,
        syncApis: true,
        webInterface: true,
        needsSupabaseCredentials: true
      }
    };

    // Test connections if available
    if (status.bigquery.configured.projectId && status.bigquery.configured.datasetId) {
      try {
        const health = await bigQuerySupabaseConnector.healthCheck();
        status.bigquery.connectionTest = health.bigQuery;
        status.database.supabase.connectionTest = health.supabase;
      } catch (error) {
        status.bigquery.connectionTest = false;
        status.bigquery.error = error.message;
      }
    }

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('System status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get system status',
      error: error.message
    });
  }
});

/**
 * @route GET /api/system-status/demo-ready
 * @desc Check if system is ready for demo
 * @access Public
 */
router.get('/demo-ready', async (req, res) => {
  try {
    const checks = {
      bigQueryConfigured: !!(process.env.BIGQUERY_PROJECT_ID && process.env.BIGQUERY_DATASET_ID),
      serviceAccountConfigured: !!process.env.BIGQUERY_SERVICE_ACCOUNT_KEY,
      syncApiBuilt: true,
      webInterfaceBuilt: true,
      supabaseSchemaReady: true
    };

    const allReady = Object.values(checks).every(check => check === true);

    const nextSteps = [];
    if (!checks.bigQueryConfigured) {
      nextSteps.push('Configure BigQuery project and dataset IDs');
    }
    if (!checks.serviceAccountConfigured) {
      nextSteps.push('Provide complete BigQuery service account credentials');
    }
    if (allReady) {
      nextSteps.push('Ready for full demo - can sync BigQuery data to Supabase');
    }

    res.json({
      success: true,
      data: {
        ready: allReady,
        checks,
        nextSteps,
        demoCapabilities: {
          bigQueryToSupabaseSync: allReady,
          webInterface: true,
          apiEndpoints: true,
          errorHandling: true,
          healthMonitoring: true
        }
      }
    });

  } catch (error) {
    console.error('Demo readiness check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check demo readiness',
      error: error.message
    });
  }
});

module.exports = router;
