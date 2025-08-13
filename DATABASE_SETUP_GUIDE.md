# Database & AI Integration Setup Guide

## Overview

The AgriSupply Insights platform has been enhanced with:
1. **Supabase Database Integration** - Complete schema with all required tables
2. **BigQuery Data Integration** - Service to fetch data from your existing BigQuery tables
3. **AI Bot with Gemini** - Intelligent assistant for supply chain insights
4. **Real-time Dashboard** - Connected to both Supabase and BigQuery data sources

## 🚀 Setup Instructions

### 1. Supabase Configuration

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Update Environment Variables**:
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Update the following in your `.env` file:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   ```

3. **Run Database Migration**:
   ```bash
   cd server
   npm run migrate:supabase
   ```

### 2. BigQuery Integration

**Option A: Copy Data to Supabase (Recommended)**
- This provides faster queries and better integration
- We can help you migrate your BigQuery data to Supabase

**Option B: Keep Data in BigQuery**
- Configure BigQuery API access in your `.env`:
   ```env
   BIGQUERY_PROJECT_ID=your_bigquery_project_id
   BIGQUERY_DATASET_ID=your_bigquery_dataset_id
   BIGQUERY_API_KEY=your_bigquery_api_key
   BIGQUERY_SERVICE_ACCOUNT_KEY=your_service_account_json_key
   ```

### 3. AI Assistant (Gemini) Setup

1. **Get Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key

2. **Configure Environment**:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-pro
   ```

### 4. Start the Application

```bash
# Install dependencies (if not done already)
npm run setup

# Start development servers
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- AI Bot: http://localhost:5173/ai-bot

## 📊 Database Schema

The following tables have been created:

### Core Tables
- **organizations** - Multi-tenant organization data
- **users** - User accounts with role-based access
- **suppliers** - Supplier information and contacts
- **inventory** - Product inventory with stock levels
- **orders** - Purchase orders and tracking
- **customers** - Customer profiles and segments
- **purchase_transactions** - Sales transaction history

### Analytics Tables
- **market_data** - Market prices and trends
- **reports** - Generated reports storage
- **predictions** - ML predictions and insights
- **alerts** - System alerts and notifications

### Features Included
- ✅ UUID primary keys for all tables
- ✅ Row Level Security (RLS) policies
- ✅ Multi-tenant architecture
- ✅ Optimized indexes for performance
- ✅ Sample data for development

## 🤖 AI Bot Features

The AI assistant can help with:

### Inventory Management
- Stock level monitoring
- Reorder recommendations
- Low stock alerts
- Supplier analysis

### Sales Insights
- Customer behavior analysis
- Purchase pattern recognition
- Revenue trends
- Product performance

### Market Intelligence
- Price trend analysis
- Market opportunity identification
- Competitive insights
- Demand forecasting

### Quick Actions
- Generate reports
- Process natural language queries
- Provide actionable recommendations
- Real-time data analysis

## 🔗 API Endpoints

### AI Bot Endpoints
```
POST /api/ai-bot/query           - Process user queries
GET  /api/ai-bot/dashboard-data  - Get BigQuery dashboard data
GET  /api/ai-bot/data/:dataType  - Get specific data for AI
GET  /api/ai-bot/suggestions     - Get AI-powered suggestions
GET  /api/ai-bot/health          - Check service health
POST /api/ai-bot/feedback        - Submit feedback
```

### Authentication Required
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🛠 BigQuery Table Structure Expected

For optimal AI integration, your BigQuery tables should include:

### inventory_data
```sql
- organization_id (STRING)
- product_name (STRING)
- category (STRING)
- current_stock (INTEGER)
- reorder_level (INTEGER)
- avg_monthly_consumption (FLOAT)
- supplier_info (JSON)
- last_order_date (DATE)
- lead_time_days (INTEGER)
```

### sales_transactions
```sql
- organization_id (STRING)
- transaction_date (TIMESTAMP)
- product_id (STRING)
- product_name (STRING)
- customer_segment (STRING)
- quantity_sold (INTEGER)
- total_amount (FLOAT)
- revenue (FLOAT)
```

### market_prices
```sql
- commodity (STRING)
- price_date (DATE)
- current_price (FLOAT)
- price_change_percent (FLOAT)
- volume (INTEGER)
- weather_impact (STRING)
```

## 📞 Next Steps & Support

### Immediate Actions Needed:
1. **Provide Supabase credentials** or create a Supabase project
2. **Share BigQuery access details** or decide on data migration approach
3. **Get Gemini API key** for AI functionality
4. **Test the AI bot** with sample queries

### For the Client Meeting:
- Demo the AI bot functionality
- Show dashboard integration
- Discuss data migration preferences
- Plan BigQuery schema alignment
- Set up production deployment strategy

### Questions for Client:
1. **Data Preference**: Keep in BigQuery or migrate to Supabase?
2. **BigQuery Schema**: Can you share the exact table structures?
3. **Access Permissions**: What level of access can you provide?
4. **Deployment**: Where would you like to host the production app?
5. **Custom Requirements**: Any specific AI queries or reports needed?

## 🔧 Troubleshooting

### Common Issues:
- **Supabase Connection**: Check URL and API keys
- **BigQuery Access**: Verify service account permissions
- **Gemini API**: Ensure API key is valid and has quota
- **CORS Issues**: Update CLIENT_URL in environment variables

### Health Check:
Visit `/api/ai-bot/health` to check all service connections.

---

**Ready for the next phase!** The foundation is set for a powerful AI-driven agricultural supply chain platform. Let's discuss the BigQuery integration approach and any specific customizations needed.
