#!/bin/bash

echo "🚀 Setting up LlamaIndex integration for AI Agri MVP..."

# Check if we're in the server directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the server directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Setting up environment variables..."
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agri_supply
DB_USER=hussainalinaqvi
DB_PASSWORD=
DB_SSL=false

# LlamaIndex Configuration
LLAMAINDEX_API_KEY=your_api_key_here
LLAMAINDEX_MODEL=gpt-4
EOF
    echo "⚠️  Please update .env with your actual database credentials and LlamaIndex API key"
else
    echo "✅ .env file already exists"
fi

echo "🗄️  Setting up database schema..."
echo "📋 Please run the following commands in your PostgreSQL database:"

echo ""
echo "1. Create the database (if not exists):"
echo "   createdb agri_supply"

echo ""
echo "2. Run the main schema:"
echo "   psql -d agri_supply -f database/schema.sql"

echo ""
echo "3. Run the LLM access schema:"
echo "   psql -d agri_supply -f database/llm_access_schema.sql"

echo ""
echo "🔍 Testing the setup..."
echo "4. Test the connection:"
echo "   curl http://localhost:3000/api/llamaindex/test"

echo ""
echo "📚 Available API endpoints:"
echo "   GET  /api/llamaindex/test                    - Test connection"
echo "   POST /api/llamaindex/insights                - Custom query"
echo "   GET  /api/llamaindex/market-trends/:commodity - Market trends"
echo "   GET  /api/llamaindex/planting-intentions     - Planting analysis"
echo "   GET  /api/llamaindex/fertilizer-analysis     - Fertilizer analysis"
echo "   GET  /api/llamaindex/weather-impact          - Weather impact"
echo "   POST /api/llamaindex/comprehensive-report    - Full report"
echo "   GET  /api/llamaindex/schemas                 - Available schemas"

echo ""
echo "🎯 Next steps:"
echo "1. Update .env with your database credentials"
echo "2. Start your server: npm run dev"
echo "3. Test the LlamaIndex endpoints"
echo "4. Integrate the LlamaIndexInsights component in your frontend"

echo ""
echo "✅ Setup complete! Happy farming with AI! 🌾"
