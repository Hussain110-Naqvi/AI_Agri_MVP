import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import {
  Send,
  Bot,
  User,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  insights?: string[];
  actions?: string[];
  confidence?: string;
  responseTime?: number;
  isQuickResponse?: boolean;
}

interface Suggestion {
  type: string;
  priority: "high" | "medium" | "low";
  title: string;
  message: string;
  action: string;
  items?: string[];
}

const AIBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "healthy" | "degraded" | "unknown"
  >("unknown");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm your AI agricultural supply chain assistant. I can help you analyze inventory, understand market trends, and provide actionable insights. What would you like to know?",
      timestamp: new Date(),
      insights: [],
      actions: [
        "Ask about inventory status",
        "Inquire about market trends",
        "Request sales analysis",
      ],
      confidence: "High",
    };
    setMessages([welcomeMessage]);

    // Load initial suggestions and check health
    loadSuggestions();
    checkHealth();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadSuggestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/ai-bot/suggestions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.data.suggestions || []);
      }
    } catch (error) {
      console.error("Failed to load suggestions:", error);
    }
  };

  const checkHealth = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/ai-bot/health", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConnectionStatus(data.data.status);
      }
    } catch (error) {
      console.error("Health check failed:", error);
      setConnectionStatus("degraded");
    }
  };

  const sendMessage = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/ai-bot/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const result = data.data;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: result.response,
        timestamp: new Date(),
        insights: result.insights || [],
        actions: result.actions || [],
        confidence: result.confidence,
        responseTime: result.responseTime,
        isQuickResponse: result.isQuickResponse,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    sendMessage(`Tell me more about: ${suggestion.title}`);
  };

  const handleQuickQuery = (query: string) => {
    sendMessage(query);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConfidenceBadgeColor = (confidence?: string) => {
    switch (confidence?.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  AI Assistant
                </h1>
                <p className="text-sm text-gray-500">
                  Agricultural Supply Chain Intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  connectionStatus === "healthy" ? "default" : "destructive"
                }
                className={
                  connectionStatus === "healthy"
                    ? "bg-green-100 text-green-800"
                    : ""
                }
              >
                {connectionStatus === "healthy" ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertTriangle className="h-3 w-3 mr-1" />
                )}
                {connectionStatus === "healthy" ? "Online" : "Limited"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-2xl ${
                    message.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200"
                  } rounded-lg p-4 shadow-sm`}
                >
                  {/* Message Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {message.type === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4 text-blue-600" />
                      )}
                      <span className="text-sm font-medium">
                        {message.type === "user" ? "You" : "AI Assistant"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {message.confidence && (
                        <Badge
                          className={getConfidenceBadgeColor(
                            message.confidence,
                          )}
                        >
                          {message.confidence}
                        </Badge>
                      )}
                      <span className="text-xs opacity-70">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>

                  {/* Response Metadata */}
                  {message.type === "bot" &&
                    (message.responseTime || message.isQuickResponse) && (
                      <div className="flex items-center space-x-2 mt-2 text-xs opacity-70">
                        <Clock className="h-3 w-3" />
                        <span>
                          {message.isQuickResponse
                            ? "Instant response"
                            : `${message.responseTime}ms`}
                        </span>
                      </div>
                    )}

                  {/* Insights */}
                  {message.insights && message.insights.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Key Insights
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {message.insights.map((insight, index) => (
                          <li key={index} className="text-sm text-blue-800">
                            • {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">
                          Recommended Actions
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {message.actions.map((action, index) => (
                          <li key={index} className="text-sm text-green-800">
                            • {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Feedback (for bot messages) */}
                  {message.type === "bot" && (
                    <div className="flex items-center justify-end space-x-1 mt-3">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">AI Assistant is thinking...</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about inventory, sales, market trends, or anything else..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {/* Quick Query Buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleQuickQuery("What items are running low on stock?")
              }
            >
              Low Stock Items
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuery("Show me current market trends")}
            >
              Market Trends
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleQuickQuery("What are my top selling products?")
              }
            >
              Top Products
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleQuickQuery("Give me sales insights for this month")
              }
            >
              Sales Insights
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="space-y-4">
          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span>AI Suggestions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {suggestions.length > 0 ? (
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getPriorityColor(suggestion.priority)}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">
                          {suggestion.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {suggestion.message}
                      </p>
                      <p className="text-xs font-medium text-blue-600">
                        {suggestion.action}
                      </p>
                      {suggestion.items && suggestion.items.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Items:</p>
                          <ul className="text-xs text-gray-600">
                            {suggestion.items.slice(0, 3).map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                            {suggestion.items.length > 3 && (
                              <li>• +{suggestion.items.length - 3} more</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No suggestions available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickQuery("Generate inventory report")}
                >
                  Generate Report
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickQuery("What should I reorder?")}
                >
                  Reorder Recommendations
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickQuery("Show customer insights")}
                >
                  Customer Insights
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={checkHealth}
                >
                  Check System Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIBot;
