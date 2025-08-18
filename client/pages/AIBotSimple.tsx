import React from "react";
import Layout from "../components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Bot, ArrowRight, Lightbulb, TrendingUp, Database } from "lucide-react";

export default function AIBotSimple() {
  return (
    <Layout>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#F7FCFA] overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1C17] font-['Lexend'] mb-2">
              AI Assistant (Simple)
            </h1>
            <p className="text-[#45A180] text-sm sm:text-base font-['Lexend']">
              Simplified version of the AI Bot for testing and demonstration
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Main Info Card */}
            <Card className="bg-white border border-[#E5E8EB] shadow-sm">
              <CardHeader className="p-6">
                <CardTitle className="text-lg font-bold text-[#0D1C17] font-['Lexend'] flex items-center gap-2">
                  <Bot className="w-6 h-6 text-[#45A180]" />
                  AI Bot Features
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-[#0D1C17] font-['Lexend'] text-sm">
                        Natural Language Processing
                      </h4>
                      <p className="text-[#45A180] text-xs font-['Lexend']">
                        Ask questions in plain English and get intelligent
                        responses
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-[#0D1C17] font-['Lexend'] text-sm">
                        Real-time Data Analysis
                      </h4>
                      <p className="text-[#45A180] text-xs font-['Lexend']">
                        Analyze your agricultural data in real-time
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-[#0D1C17] font-['Lexend'] text-sm">
                        BigQuery Integration
                      </h4>
                      <p className="text-[#45A180] text-xs font-['Lexend']">
                        Connected to your BigQuery data and Gemini AI
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white border border-[#E5E8EB] shadow-sm">
              <CardHeader className="p-6">
                <CardTitle className="text-lg font-bold text-[#0D1C17] font-['Lexend']">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-3">
                  <Link to="/ai-bot">
                    <Button className="w-full justify-start bg-[#45A180] hover:bg-[#3A8B6B] text-white">
                      <Bot className="w-4 h-4 mr-2" />
                      Launch Full AI Assistant
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>
                  </Link>

                  <Link to="/data-sync">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-[#E5E8EB] hover:bg-[#F7FCFA]"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Data Sync Dashboard
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>
                  </Link>

                  <Link to="/dashboard">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-[#E5E8EB] hover:bg-[#F7FCFA]"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Back to Dashboard
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sample Queries */}
          <Card className="bg-white border border-[#E5E8EB] shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold text-[#0D1C17] font-['Lexend']">
                Sample AI Queries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F7FCFA] rounded-lg border border-[#E5E8EB]">
                  <h4 className="font-medium text-[#0D1C17] font-['Lexend'] text-sm mb-2">
                    "What items are running low on stock?"
                  </h4>
                  <p className="text-[#45A180] text-xs font-['Lexend']">
                    Get inventory alerts and recommendations
                  </p>
                </div>

                <div className="p-4 bg-[#F7FCFA] rounded-lg border border-[#E5E8EB]">
                  <h4 className="font-medium text-[#0D1C17] font-['Lexend'] text-sm mb-2">
                    "Show me current market trends"
                  </h4>
                  <p className="text-[#45A180] text-xs font-['Lexend']">
                    Analyze commodity prices and market data
                  </p>
                </div>

                <div className="p-4 bg-[#F7FCFA] rounded-lg border border-[#E5E8EB]">
                  <h4 className="font-medium text-[#0D1C17] font-['Lexend'] text-sm mb-2">
                    "What are my top selling products?"
                  </h4>
                  <p className="text-[#45A180] text-xs font-['Lexend']">
                    Get sales insights and customer analytics
                  </p>
                </div>

                <div className="p-4 bg-[#F7FCFA] rounded-lg border border-[#E5E8EB]">
                  <h4 className="font-medium text-[#0D1C17] font-['Lexend'] text-sm mb-2">
                    "Generate inventory report"
                  </h4>
                  <p className="text-[#45A180] text-xs font-['Lexend']">
                    Create comprehensive reports and analysis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
