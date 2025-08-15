# BigQuery to Supabase Data Connector

A comprehensive data synchronization tool for the AgriSupply Insights platform that seamlessly transfers data from Google BigQuery to Supabase.

## 🚀 Overview

The BigQuery to Supabase connector enables:

- **Full Data Sync**: Complete data migration from BigQuery to Supabase
- **Table-Specific Sync**: Selective synchronization of individual tables
- **Real-time Health Monitoring**: Connection status for both BigQuery and Supabase
- **Error Handling & Logging**: Comprehensive error tracking and reporting
- **Data Transformation**: Automatic schema mapping and data formatting
- **Batch Processing**: Efficient handling of large datasets

## 📊 Supported Data Tables

| BigQuery Table | Supabase Table | Description |
|---|---|---|
| `inventory_data` | `inventory` | Product inventory and stock levels |
| `sales_transactions` | `purchase_transactions` | Customer purchase transactions |
| `market_prices` | `market_data` | Commodity prices and market data |
| `customer_profiles` | `customers` | Customer information and segments |
| `supplier_data` | `suppliers` | Supplier contacts and information |

## 🔧 Setup Instructions

### 1. Environment Variables

Configure your `.env` file with the following variables:

```env
# BigQuery Configuration
BIGQUERY_PROJECT_ID=your_bigquery_project_id
BIGQUERY_DATASET_ID=your_bigquery_dataset_id
BIGQUERY_API_KEY=your_bigquery_api_key
BIGQUERY_SERVICE_ACCOUNT_KEY=your_service_account_json_key

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

### 2. BigQuery Table Structure

Your BigQuery tables should include the following required columns:

#### inventory_data
```sql
CREATE TABLE `project.dataset.inventory_data` (
  id STRING,
  organization_id STRING NOT NULL,
  product_name STRING NOT NULL,
  sku STRING,
  current_stock INTEGER,
  unit_cost FLOAT64,
  unit_price FLOAT64,
  unit_type STRING,
  category STRING,
  reorder_level INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### sales_transactions
```sql
CREATE TABLE `project.dataset.sales_transactions` (
  transaction_id STRING,
  organization_id STRING NOT NULL,
  product_id STRING,
  product_name STRING,
  customer_id STRING,
  quantity_sold INTEGER,
  unit_price FLOAT64,
  total_amount FLOAT64,
  transaction_date TIMESTAMP,
  payment_method STRING,
  created_at TIMESTAMP
);
```

#### market_prices
```sql
CREATE TABLE `project.dataset.market_prices` (
  id STRING,
  organization_id STRING,
  commodity STRING NOT NULL,
  price_date DATE,
  current_price FLOAT64,
  price_change_percent FLOAT64,
  volume INTEGER,
  weather_data STRING, -- JSON string
  price_trend STRING,
  created_at TIMESTAMP
);
```

#### customer_profiles
```sql
CREATE TABLE `project.dataset.customer_profiles` (
  customer_id STRING,
  organization_id STRING NOT NULL,
  customer_name STRING,
  name STRING,
  email STRING,
  phone STRING,
  address STRING, -- JSON string
  customer_segment STRING,
  customer_type STRING,
  purchase_patterns STRING, -- JSON string
  total_purchases FLOAT64,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_active BOOLEAN
);
```

#### supplier_data
```sql
CREATE TABLE `project.dataset.supplier_data` (
  supplier_id STRING,
  organization_id STRING NOT NULL,
  supplier_name STRING,
  name STRING,
  contact_info STRING, -- JSON string
  products_supplied STRING, -- Array as string
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_active BOOLEAN
);
```

## 🖥️ Usage

### Web Interface

1. **Navigate to Data Sync Page**: Visit `/data-sync` in your application
2. **Check Health Status**: Verify BigQuery and Supabase connections
3. **Full Sync**: Click "Start Full Sync" to sync all tables
4. **Table Sync**: Use individual table cards to sync specific data
5. **Monitor Progress**: View real-time sync statistics and error logs

### API Endpoints

#### Start Full Sync
```bash
POST /api/data-sync/sync
Content-Type: application/json
Authorization: Bearer <token>

{
  "organizationId": "550e8400-e29b-41d4-a716-446655440000",
  "options": {
    "incrementalSync": false,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "limit": 10000
  }
}
```

#### Sync Specific Table
```bash
POST /api/data-sync/table
Content-Type: application/json
Authorization: Bearer <token>

{
  "tableName": "inventory_data",
  "organizationId": "550e8400-e29b-41d4-a716-446655440000",
  "options": {
    "limit": 1000
  }
}
```

#### Get Sync Status
```bash
GET /api/data-sync/status
Authorization: Bearer <token>
```

#### Health Check
```bash
GET /api/data-sync/health
Authorization: Bearer <token>
```

### Command Line Interface

The CLI tool provides powerful data sync capabilities:

#### Basic Commands
```bash
# Full data sync
node server/scripts/sync-data.js sync 550e8400-e29b-41d4-a716-446655440000

# Sync specific table
node server/scripts/sync-data.js sync-table inventory_data 550e8400-e29b-41d4-a716-446655440000

# Check sync status
node server/scripts/sync-data.js status

# Health check
node server/scripts/sync-data.js health

# Test connections
node server/scripts/sync-data.js test
```

#### Advanced Usage
```bash
# Incremental sync (only new/updated records)
node server/scripts/sync-data.js sync 550e8400-e29b-41d4-a716-446655440000 --incremental

# Sync with date range
node server/scripts/sync-data.js sync 550e8400-e29b-41d4-a716-446655440000 --start-date 2024-01-01 --end-date 2024-12-31

# Limit number of records
node server/scripts/sync-data.js sync 550e8400-e29b-41d4-a716-446655440000 --limit 5000
```

## 🔄 Data Transformation

The connector automatically handles data transformation between BigQuery and Supabase:

### Field Mapping

- **UUIDs**: Auto-generates UUIDs for records without IDs
- **Timestamps**: Converts between BigQuery and PostgreSQL timestamp formats
- **JSON Fields**: Parses JSON strings into proper JSONB objects
- **Arrays**: Converts string arrays to PostgreSQL array format
- **Data Types**: Maps BigQuery types to PostgreSQL equivalents

### Conflict Resolution

- **Primary Keys**: Uses appropriate conflict resolution columns for each table
- **Upsert Strategy**: Updates existing records, inserts new ones
- **Data Validation**: Validates required fields and data types
- **Error Handling**: Logs errors without stopping the sync process

## 📈 Monitoring & Analytics

### Sync Statistics

The connector provides comprehensive statistics:

- **Total Records**: Number of records processed
- **Successful Upserts**: Successfully synchronized records
- **Errors**: Number of failed operations
- **Duplicates Skipped**: Records skipped due to conflicts
- **Success Rate**: Percentage of successful operations
- **Duration**: Time taken for sync operations

### Error Logging

- **Table-Level Errors**: Specific errors for each table
- **Timestamp Tracking**: When errors occurred
- **Error Categories**: Classification of error types
- **Recent Errors**: Quick access to latest issues

### Health Monitoring

- **Connection Status**: Real-time status of BigQuery and Supabase
- **Service Health**: Overall system health assessment
- **Performance Metrics**: Response times and throughput
- **Availability Tracking**: Uptime monitoring

## 🚨 Troubleshooting

### Common Issues

#### BigQuery Connection Fails
```bash
❌ BigQuery connection failed: Invalid credentials
```
**Solution**: Check your `BIGQUERY_API_KEY` and `BIGQUERY_PROJECT_ID` in the `.env` file.

#### Supabase Connection Fails
```bash
❌ Supabase connection failed: Invalid project URL
```
**Solution**: Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are correct.

#### Table Not Found
```bash
❌ Table not found: project.dataset.inventory_data
```
**Solution**: Ensure the BigQuery table exists and your service account has access.

#### Permission Denied
```bash
❌ Permission denied: Access to table denied
```
**Solution**: Grant appropriate BigQuery permissions to your service account.

### Performance Optimization

#### Large Datasets
- Use `limit` parameter to process data in chunks
- Enable incremental sync for regular updates
- Schedule sync during off-peak hours
- Monitor memory usage during large operations

#### Network Issues
- Implement retry logic for failed requests
- Use batch processing for bulk operations
- Set appropriate timeouts
- Monitor connection stability

## 🔒 Security Considerations

### Data Protection
- **Encryption**: All data transfers use TLS encryption
- **Authentication**: Service account authentication for BigQuery
- **Authorization**: JWT-based API access control
- **Audit Logging**: Track all sync operations

### Access Control
- **Role-Based**: Admin/Manager roles required for sync operations
- **Organization Isolation**: Data scoped to specific organizations
- **API Security**: Rate limiting and input validation
- **Environment Separation**: Separate credentials for dev/prod

## 📅 Scheduling & Automation

### Future Enhancements

The connector is designed to support:

- **Cron Jobs**: Scheduled automatic syncs
- **Webhooks**: Real-time data updates
- **Event-Driven**: Trigger syncs based on data changes
- **Monitoring Alerts**: Notifications for sync failures

### Implementation Example
```javascript
// Future scheduling implementation
const cron = require('node-cron');

// Daily sync at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Starting scheduled sync...');
  await bigQuerySupabaseConnector.syncAllData(organizationId);
});
```

## 📚 API Reference

### Response Formats

#### Successful Sync Response
```json
{
  "success": true,
  "message": "Data sync completed",
  "data": {
    "success": true,
    "duration": "45.23s",
    "stats": {
      "totalRecords": 15420,
      "successfulUpserts": 15380,
      "errors": 40,
      "duplicatesSkipped": 0
    },
    "errors": [],
    "lastSyncTime": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Data sync failed",
  "error": "BigQuery connection timeout"
}
```

### Status Codes

- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (insufficient permissions)
- `500` - Internal Server Error

## 🤝 Support

For issues or questions:

1. **Check Logs**: Review sync errors and system logs
2. **Health Check**: Run health diagnostic commands
3. **Documentation**: Refer to this guide and API docs
4. **Test Connection**: Use CLI test commands
5. **Contact Support**: Reach out with specific error messages

---

**Ready for Data Sync!** The BigQuery to Supabase connector provides a robust, scalable solution for agricultural data management. Monitor your sync operations and ensure data consistency across your platform.
