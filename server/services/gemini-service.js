require("dotenv").config();
const bigQueryService = require("./bigquery-service");

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = process.env.GEMINI_MODEL || "gemini-pro";
    this.baseUrl = "https://generativelanguage.googleapis.com/v1beta";
  }

  /**
   * Process user query and provide AI-powered insights
   * @param {string} userQuery - User's question or request
   * @param {string} organizationId - Organization context
   * @param {object} context - Additional context (user role, current data, etc.)
   * @returns {Promise<object>} AI response with insights and actions
   */
  async processQuery(userQuery, organizationId, context = {}) {
    try {
      // Determine what data is needed based on the query
      const dataNeeds = this.analyzeDataNeeds(userQuery);

      // Fetch relevant data from BigQuery
      const relevantData = await this.fetchRelevantData(
        dataNeeds,
        organizationId,
      );

      // Create context-aware prompt
      const prompt = this.buildPrompt(userQuery, relevantData, context);

      // Get AI response
      const response = await this.callGeminiAPI(prompt);

      // Process and format the response
      const processedResponse = this.processResponse(response, dataNeeds);

      return {
        query: userQuery,
        response: processedResponse.text,
        insights: processedResponse.insights,
        actions: processedResponse.actions,
        data_used: dataNeeds,
        confidence: processedResponse.confidence,
      };
    } catch (error) {
      console.error("Error processing Gemini query:", error);
      throw error;
    }
  }

  /**
   * Analyze user query to determine what data is needed
   * @param {string} query - User query
   * @returns {Array} List of data types needed
   */
  analyzeDataNeeds(query) {
    const queryLower = query.toLowerCase();
    const dataNeeds = [];

    // Inventory-related queries
    if (
      queryLower.includes("inventory") ||
      queryLower.includes("stock") ||
      queryLower.includes("supply") ||
      queryLower.includes("reorder")
    ) {
      dataNeeds.push("inventory");
    }

    // Sales-related queries
    if (
      queryLower.includes("sales") ||
      queryLower.includes("revenue") ||
      queryLower.includes("customer") ||
      queryLower.includes("purchase")
    ) {
      dataNeeds.push("sales_patterns");
    }

    // Market-related queries
    if (
      queryLower.includes("market") ||
      queryLower.includes("price") ||
      queryLower.includes("trend") ||
      queryLower.includes("commodity")
    ) {
      dataNeeds.push("market_conditions");
    }

    // Customer-related queries
    if (
      queryLower.includes("customer") ||
      queryLower.includes("buyer") ||
      queryLower.includes("segment") ||
      queryLower.includes("behavior")
    ) {
      dataNeeds.push("customer_behavior");
    }

    // If no specific data needs identified, default to inventory and sales
    if (dataNeeds.length === 0) {
      dataNeeds.push("inventory", "sales_patterns");
    }

    return [...new Set(dataNeeds)]; // Remove duplicates
  }

  /**
   * Fetch relevant data from BigQuery based on needs
   * @param {Array} dataNeeds - Types of data needed
   * @param {string} organizationId - Organization ID
   * @returns {Promise<object>} Relevant data
   */
  async fetchRelevantData(dataNeeds, organizationId) {
    const data = {};

    try {
      const dataPromises = dataNeeds.map(async (dataType) => {
        try {
          const result = await bigQueryService.getDataForAI(dataType, {
            organizationId,
          });
          return [dataType, result];
        } catch (error) {
          console.error(`Error fetching ${dataType}:`, error);
          return [dataType, []];
        }
      });

      const results = await Promise.all(dataPromises);
      results.forEach(([dataType, result]) => {
        data[dataType] = result;
      });

      return data;
    } catch (error) {
      console.error("Error fetching data for AI:", error);
      return {};
    }
  }

  /**
   * Build context-aware prompt for Gemini
   * @param {string} userQuery - User's question
   * @param {object} data - Relevant data
   * @param {object} context - Additional context
   * @returns {string} Formatted prompt
   */
  buildPrompt(userQuery, data, context) {
    const systemPrompt = `You are an AI assistant for agricultural supply chain management. You help agricultural cooperatives optimize their inventory, understand market trends, and make data-driven decisions.

Your role is to:
1. Analyze the provided data to answer user questions
2. Provide actionable insights and recommendations
3. Identify opportunities for cost savings and revenue growth
4. Alert users to potential issues or risks
5. Suggest specific actions they can take

Always base your responses on the actual data provided. Be specific with numbers and trends when possible.`;

    const dataContext = Object.entries(data)
      .map(([dataType, dataArray]) => {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
          return `${dataType}: No data available`;
        }

        const summary = this.summarizeData(dataType, dataArray);
        return `${dataType}: ${summary}`;
      })
      .join("\n\n");

    const userContext = context.userRole
      ? `User Role: ${context.userRole}\n`
      : "";
    const currentDate = `Current Date: ${new Date().toISOString().split("T")[0]}\n`;

    return `${systemPrompt}

${currentDate}${userContext}
Available Data:
${dataContext}

User Question: ${userQuery}

Please provide a comprehensive response that includes:
1. Direct answer to the user's question
2. Key insights from the data
3. Specific recommendations or actions
4. Any risks or opportunities identified
5. Confidence level in your analysis (High/Medium/Low)

Format your response as JSON with the following structure:
{
  "text": "Your main response to the user",
  "insights": ["Key insight 1", "Key insight 2", ...],
  "actions": ["Recommended action 1", "Recommended action 2", ...],
  "confidence": "High/Medium/Low"
}`;
  }

  /**
   * Summarize data for context in prompts
   * @param {string} dataType - Type of data
   * @param {Array} dataArray - Data array
   * @returns {string} Summary text
   */
  summarizeData(dataType, dataArray) {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return "No data available";
    }

    const count = dataArray.length;

    switch (dataType) {
      case "inventory":
        const lowStock = dataArray.filter(
          (item) => item.stock_status === "low",
        ).length;
        return `${count} inventory items tracked. ${lowStock} items are running low on stock.`;

      case "sales_patterns":
        const totalRevenue = dataArray.reduce(
          (sum, item) => sum + (item.revenue || 0),
          0,
        );
        return `${count} sales transactions. Total revenue: $${totalRevenue.toLocaleString()}.`;

      case "market_conditions":
        const commodities = [
          ...new Set(dataArray.map((item) => item.commodity)),
        ];
        return `Market data for ${commodities.length} commodities: ${commodities.join(", ")}.`;

      case "customer_behavior":
        const segments = [
          ...new Set(dataArray.map((item) => item.customer_segment)),
        ];
        return `${count} customers across ${segments.length} segments: ${segments.join(", ")}.`;

      default:
        return `${count} data points available.`;
    }
  }

  /**
   * Call Gemini API
   * @param {string} prompt - Formatted prompt
   * @returns {Promise<string>} AI response
   */
  async callGeminiAPI(prompt) {
    try {
      const response = await fetch(
        `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Gemini API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response generated by Gemini");
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini API call failed:", error);
      throw error;
    }
  }

  /**
   * Process and format Gemini response
   * @param {string} response - Raw Gemini response
   * @param {Array} dataNeeds - Data types used
   * @returns {object} Processed response
   */
  processResponse(response, dataNeeds) {
    try {
      // Try to parse as JSON first
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          text: parsed.text || response,
          insights: parsed.insights || [],
          actions: parsed.actions || [],
          confidence: parsed.confidence || "Medium",
        };
      }
    } catch (error) {
      console.log("Response is not JSON, processing as text");
    }

    // Fallback: process as plain text
    return {
      text: response,
      insights: this.extractInsights(response),
      actions: this.extractActions(response),
      confidence: "Medium",
    };
  }

  /**
   * Extract insights from text response
   * @param {string} text - Response text
   * @returns {Array} Extracted insights
   */
  extractInsights(text) {
    const insights = [];
    const lines = text.split("\n");

    lines.forEach((line) => {
      if (
        line.includes("insight") ||
        line.includes("trend") ||
        line.includes("pattern")
      ) {
        insights.push(line.trim());
      }
    });

    return insights.slice(0, 5); // Limit to 5 insights
  }

  /**
   * Extract actions from text response
   * @param {string} text - Response text
   * @returns {Array} Extracted actions
   */
  extractActions(text) {
    const actions = [];
    const lines = text.split("\n");

    lines.forEach((line) => {
      if (
        line.includes("recommend") ||
        line.includes("should") ||
        line.includes("action")
      ) {
        actions.push(line.trim());
      }
    });

    return actions.slice(0, 5); // Limit to 5 actions
  }

  /**
   * Get predefined quick responses for common queries
   * @param {string} query - User query
   * @returns {object|null} Quick response or null
   */
  getQuickResponse(query) {
    const queryLower = query.toLowerCase();

    const quickResponses = {
      hello: {
        text: "Hello! I'm your agricultural supply chain AI assistant. I can help you with inventory management, market analysis, sales insights, and more. What would you like to know?",
        insights: [],
        actions: [
          "Ask me about your current inventory status",
          "Inquire about market trends",
          "Request sales analysis",
        ],
        confidence: "High",
      },
      help: {
        text: "I can assist you with various aspects of your agricultural supply chain management including inventory tracking, market analysis, sales patterns, customer insights, and predictive recommendations.",
        insights: [],
        actions: [
          'Try asking "What items are running low?"',
          'Ask "What are the current market trends?"',
          'Request "Show me top selling products"',
        ],
        confidence: "High",
      },
    };

    return quickResponses[queryLower] || null;
  }

  /**
   * Test Gemini service connection
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      const testResponse = await this.callGeminiAPI(
        'Test connection. Respond with "Connection successful".',
      );
      console.log("✅ Gemini API connection successful");
      return true;
    } catch (error) {
      console.error("❌ Gemini API connection failed:", error);
      return false;
    }
  }
}

module.exports = new GeminiService();
