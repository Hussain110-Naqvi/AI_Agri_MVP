#!/usr/bin/env node

const bigQuerySupabaseConnector = require('../services/bigquery-supabase-connector');
require('dotenv').config();

// Command line argument parsing
const args = process.argv.slice(2);
const command = args[0];

const printUsage = () => {
  console.log(`
🔄 BigQuery to Supabase Data Sync Tool

Usage: node sync-data.js <command> [options]

Commands:
  sync <orgId>              - Sync all data for organization
  sync-table <table> <orgId> - Sync specific table
  status                    - Show sync status
  health                    - Check service health
  test                      - Test connections
  help                      - Show this help

Examples:
  node sync-data.js sync 550e8400-e29b-41d4-a716-446655440000
  node sync-data.js sync-table inventory_data 550e8400-e29b-41d4-a716-446655440000
  node sync-data.js status
  node sync-data.js health

Table names:
  - inventory_data
  - sales_transactions  
  - market_prices
  - customer_profiles
  - supplier_data
`);
};

const printHeader = () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                BigQuery to Supabase Sync Tool               ║
║                    Agricultural Data Platform                ║
╚══════════════════════════════════════════════════════════════╝
`);
};

const validateOrgId = (orgId) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(orgId);
};

const formatDuration = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}m`;
};

const printStats = (stats) => {
  console.log(`
📊 Sync Statistics:
   Total Records: ${stats.totalRecords.toLocaleString()}
   Successful: ${stats.successfulUpserts.toLocaleString()}
   Errors: ${stats.errors.toLocaleString()}
   Duplicates Skipped: ${stats.duplicatesSkipped.toLocaleString()}
   Success Rate: ${stats.totalRecords > 0 ? ((stats.successfulUpserts / stats.totalRecords) * 100).toFixed(2) : 0}%
`);
};

const syncAllData = async (orgId) => {
  if (!validateOrgId(orgId)) {
    console.error('❌ Invalid organization ID format');
    process.exit(1);
  }

  console.log(`🚀 Starting full data sync for organization: ${orgId}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  
  const startTime = Date.now();
  
  try {
    const result = await bigQuerySupabaseConnector.syncAllData(orgId);
    const duration = Date.now() - startTime;
    
    console.log(`\n✅ Sync completed successfully!`);
    console.log(`⏱️  Duration: ${formatDuration(duration)}`);
    
    printStats(result.stats);
    
    if (result.errors && result.errors.length > 0) {
      console.log(`⚠️  Errors encountered:`);
      result.errors.forEach(error => {
        console.log(`   - ${error.table}: ${error.error}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ Sync failed: ${error.message}`);
    process.exit(1);
  }
};

const syncTable = async (tableName, orgId) => {
  if (!validateOrgId(orgId)) {
    console.error('❌ Invalid organization ID format');
    process.exit(1);
  }

  const validTables = ['inventory_data', 'sales_transactions', 'market_prices', 'customer_profiles', 'supplier_data'];
  if (!validTables.includes(tableName)) {
    console.error(`❌ Invalid table name. Must be one of: ${validTables.join(', ')}`);
    process.exit(1);
  }

  console.log(`🔄 Syncing table: ${tableName} for organization: ${orgId}`);
  
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

  const startTime = Date.now();
  
  try {
    const operation = tableOperations[tableName];
    const result = await bigQuerySupabaseConnector.syncTable(orgId, operation);
    const duration = Date.now() - startTime;
    
    console.log(`\n✅ Table sync completed!`);
    console.log(`⏱️  Duration: ${formatDuration(duration)}`);
    console.log(`📥 Fetched: ${result.fetched || 0} records`);
    console.log(`📤 Upserted: ${result.upserted || 0} records`);
    console.log(`⏭️  Skipped: ${result.skipped || 0} records`);
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ Table sync failed: ${error.message}`);
    process.exit(1);
  }
};

const showStatus = async () => {
  try {
    const status = bigQuerySupabaseConnector.getSyncStatus();
    
    console.log(`📊 Sync Status:`);
    console.log(`   Running: ${status.isRunning ? '🟢 Yes' : '🔴 No'}`);
    console.log(`   Last Sync: ${status.lastSyncTime || 'Never'}`);
    
    if (status.stats) {
      printStats(status.stats);
    }
    
    if (status.recentErrors && status.recentErrors.length > 0) {
      console.log(`⚠️  Recent Errors:`);
      status.recentErrors.slice(0, 5).forEach(error => {
        console.log(`   - ${error.table}: ${error.error} (${error.timestamp})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ Failed to get status: ${error.message}`);
    process.exit(1);
  }
};

const checkHealth = async () => {
  console.log(`🔍 Checking service health...`);
  
  try {
    const health = await bigQuerySupabaseConnector.healthCheck();
    
    console.log(`\n🏥 Health Status:`);
    console.log(`   BigQuery: ${health.bigQuery ? '✅ Healthy' : '❌ Unhealthy'}`);
    console.log(`   Supabase: ${health.supabase ? '✅ Healthy' : '❌ Unhealthy'}`);
    console.log(`   Overall: ${health.overall ? '✅ All Systems Operational' : '⚠️ Issues Detected'}`);
    console.log(`   Checked: ${new Date(health.timestamp).toLocaleString()}`);
    
    process.exit(health.overall ? 0 : 1);
  } catch (error) {
    console.error(`❌ Health check failed: ${error.message}`);
    process.exit(1);
  }
};

const testConnections = async () => {
  console.log(`🧪 Testing connections...`);
  
  try {
    console.log(`🔍 Testing BigQuery...`);
    const bigQueryHealthy = await bigQuerySupabaseConnector.testBigQueryConnection();
    
    console.log(`🔍 Testing Supabase...`);
    const supabaseHealthy = await bigQuerySupabaseConnector.testSupabaseConnection();
    
    console.log(`\n🧪 Connection Test Results:`);
    console.log(`   BigQuery: ${bigQueryHealthy ? '✅ Connected' : '❌ Failed'}`);
    console.log(`   Supabase: ${supabaseHealthy ? '✅ Connected' : '❌ Failed'}`);
    
    if (bigQueryHealthy && supabaseHealthy) {
      console.log(`\n🎉 All connections successful! Ready to sync data.`);
      process.exit(0);
    } else {
      console.log(`\n⚠️  Some connections failed. Check your environment variables.`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Connection test failed: ${error.message}`);
    process.exit(1);
  }
};

// Main command handler
const main = async () => {
  printHeader();
  
  switch (command) {
    case 'sync':
      const orgId = args[1];
      if (!orgId) {
        console.error('❌ Organization ID required');
        printUsage();
        process.exit(1);
      }
      await syncAllData(orgId);
      break;
      
    case 'sync-table':
      const tableName = args[1];
      const tableOrgId = args[2];
      if (!tableName || !tableOrgId) {
        console.error('❌ Table name and Organization ID required');
        printUsage();
        process.exit(1);
      }
      await syncTable(tableName, tableOrgId);
      break;
      
    case 'status':
      await showStatus();
      break;
      
    case 'health':
      await checkHealth();
      break;
      
    case 'test':
      await testConnections();
      break;
      
    case 'help':
    case '-h':
    case '--help':
      printUsage();
      process.exit(0);
      break;
      
    default:
      if (!command) {
        console.error('❌ No command provided');
      } else {
        console.error(`❌ Unknown command: ${command}`);
      }
      printUsage();
      process.exit(1);
  }
};

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error.message);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error.message);
  process.exit(1);
});

// Run the CLI
main().catch(error => {
  console.error('❌ CLI error:', error.message);
  process.exit(1);
});
