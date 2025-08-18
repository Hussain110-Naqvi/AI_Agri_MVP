const { Client } = require('pg');
require('dotenv').config();

// Direct PostgreSQL connection for migration
const client = new Client({
  host: 'db.tikavcrrcteebxsrwfzi.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '9UG%Lhj2B96Lb%k',
  ssl: {
    rejectUnauthorized: false
  }
});

// SQL for creating the database schema
const createTablesSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) DEFAULT 'cooperative',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB DEFAULT '{}'
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  contact_info JSONB DEFAULT '{}',
  products_supplied TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  quantity INTEGER DEFAULT 0,
  unit_cost DECIMAL(10,2),
  unit_price DECIMAL(10,2),
  unit_type VARCHAR(50),
  category VARCHAR(100),
  supplier_id UUID REFERENCES suppliers(id),
  reorder_level INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES inventory(id),
  supplier_id UUID REFERENCES suppliers(id),
  quantity_ordered INTEGER NOT NULL,
  unit_cost DECIMAL(10,2),
  total_cost DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expected_delivery TIMESTAMP WITH TIME ZONE,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market data table
CREATE TABLE IF NOT EXISTS market_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weather_json JSONB DEFAULT '{}',
  pricing_index JSONB DEFAULT '{}',
  commodity VARCHAR(100),
  price DECIMAL(10,2),
  price_change DECIMAL(5,2),
  volume INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  report_type VARCHAR(100) NOT NULL,
  report_data_json JSONB DEFAULT '{}',
  generated_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  parameters JSONB DEFAULT '{}'
);

-- Predictions table (for ML integration)
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  prediction_type VARCHAR(100) NOT NULL,
  data_json JSONB DEFAULT '{}',
  confidence_score DECIMAL(3,2),
  model_version VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  alert_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  severity VARCHAR(20) DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Customer data table (for purchase patterns)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address JSONB DEFAULT '{}',
  customer_type VARCHAR(50) DEFAULT 'farmer',
  purchase_patterns JSONB DEFAULT '{}',
  total_purchases DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Purchase transactions table
CREATE TABLE IF NOT EXISTS purchase_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  product_id UUID REFERENCES inventory(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_method VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_inventory_organization_id ON inventory(organization_id);
CREATE INDEX IF NOT EXISTS idx_inventory_sku ON inventory(sku);
CREATE INDEX IF NOT EXISTS idx_orders_organization_id ON orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_market_data_date ON market_data(date);
CREATE INDEX IF NOT EXISTS idx_market_data_commodity ON market_data(commodity);
CREATE INDEX IF NOT EXISTS idx_alerts_organization_id ON alerts(organization_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_customers_organization_id ON customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_purchase_transactions_customer_id ON purchase_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_purchase_transactions_date ON purchase_transactions(transaction_date);
`;

// Sample data for development
const insertSampleDataSQL = `
-- Insert sample organization
INSERT INTO organizations (id, name, type) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Demo Agricultural Cooperative', 'cooperative')
ON CONFLICT (id) DO NOTHING;

-- Insert sample users (password is 'password123' hashed)
INSERT INTO users (id, name, email, password_hash, role, organization_id) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'John Doe', 'admin@demo.com', '$2a$10$rOqwXxL.6LwE6.YqJr9JfO8MZxq9Z8Xq9Qa8w5Z2pN5x3B7C8d9E', 'admin', '550e8400-e29b-41d4-a716-446655440000'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Jane Smith', 'manager@demo.com', '$2a$10$rOqwXxL.6LwE6.YqJr9JfO8MZxq9Z8Xq9Qa8w5Z2pN5x3B7C8d9E', 'manager', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (email) DO NOTHING;

-- Insert sample suppliers
INSERT INTO suppliers (id, organization_id, name, contact_info, products_supplied) VALUES 
  ('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'AgriCorp Supplies', '{"phone": "555-0123", "email": "contact@agricorp.com"}', ARRAY['fertilizer', 'seeds', 'pesticides']),
  ('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', 'Farm Equipment Co', '{"phone": "555-0124", "email": "sales@farmequip.com"}', ARRAY['equipment', 'tools'])
ON CONFLICT (id) DO NOTHING;

-- Insert sample inventory
INSERT INTO inventory (id, organization_id, product_name, sku, quantity, unit_cost, unit_price, unit_type, category, supplier_id, reorder_level) VALUES 
  ('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440000', 'Nitrogen Fertilizer 50lb', 'FERT-N-50', 150, 25.50, 35.00, 'bag', 'fertilizer', '550e8400-e29b-41d4-a716-446655440010', 50),
  ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440000', 'Corn Seeds - Hybrid', 'SEED-CORN-H1', 200, 45.00, 65.00, 'bag', 'seeds', '550e8400-e29b-41d4-a716-446655440010', 75),
  ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440000', 'Glyphosate Herbicide', 'HERB-GLYPH-32', 80, 18.75, 28.50, 'gallon', 'pesticides', '550e8400-e29b-41d4-a716-446655440010', 25)
ON CONFLICT (sku) DO NOTHING;

-- Insert sample market data
INSERT INTO market_data (organization_id, date, commodity, price, price_change, volume, pricing_index) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE, 'corn', 6.25, 0.15, 1000, '{"futures": 6.30, "spot": 6.20}'),
  ('550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE, 'soybeans', 14.50, -0.25, 800, '{"futures": 14.75, "spot": 14.40}'),
  ('550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE, 'wheat', 8.75, 0.05, 1200, '{"futures": 8.80, "spot": 8.70}')
ON CONFLICT DO NOTHING;

-- Insert sample customers
INSERT INTO customers (id, organization_id, name, email, phone, customer_type, total_purchases) VALUES 
  ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440000', 'Miller Farm', 'contact@millerfarm.com', '555-0201', 'large_farm', 15750.00),
  ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440000', 'Johnson Agriculture', 'info@johnsonag.com', '555-0202', 'medium_farm', 8920.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample alerts
INSERT INTO alerts (organization_id, alert_type, title, message, severity, created_by) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'inventory', 'Low Stock Alert', 'Glyphosate Herbicide is running low (25 gallons remaining)', 'warning', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440000', 'market', 'Price Alert', 'Corn futures showing upward trend (+2.4% this week)', 'info', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT DO NOTHING;
`;

async function runMigration() {
  try {
    console.log('🚀 Starting PostgreSQL database migration...');
    console.log(`🔗 Connecting to: db.tikavcrrcteebxsrwfzi.supabase.co`);

    // Connect to database
    await client.connect();
    console.log('✅ Connected to PostgreSQL database');

    // Execute the main schema creation
    console.log('📋 Creating database tables and schema...');
    await client.query(createTablesSQL);
    console.log('✅ Database schema created successfully');

    // Insert sample data
    console.log('📊 Inserting sample data...');
    await client.query(insertSampleDataSQL);
    console.log('✅ Sample data inserted successfully');

    // Test the connection by querying a table
    console.log('🔍 Testing database queries...');
    const testResult = await client.query('SELECT COUNT(*) as org_count FROM organizations');
    const orgCount = testResult.rows[0].org_count;
    
    const inventoryResult = await client.query('SELECT COUNT(*) as inv_count FROM inventory');
    const invCount = inventoryResult.rows[0].inv_count;

    console.log(`✅ Database migration completed successfully!`);
    console.log(`📈 Found ${orgCount} organizations and ${invCount} inventory items`);
    
    // List all tables
    console.log('📋 Created tables:');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('🎉 Migration process completed successfully!');
      console.log('🌐 Your Supabase database is now ready with AgriSupply schema');
      console.log('🔗 Database URL: https://tikavcrrcteebxsrwfzi.supabase.co');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration process failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigration };
