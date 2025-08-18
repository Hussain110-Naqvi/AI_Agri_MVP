import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function TestRoute() {
  return (
    <Layout>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#F7FCFA] overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1C17] font-['Lexend']">
                Test Route Working!
              </h1>
            </div>
            <p className="text-[#45A180] text-sm sm:text-base font-['Lexend']">
              If you can see this, routing is working correctly in the AgriSupply Insights platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white border border-[#E5E8EB] shadow-sm">
              <CardHeader className="p-6">
                <CardTitle className="text-lg font-bold text-[#0D1C17] font-['Lexend'] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#45A180]" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#45A180] font-['Lexend']">React Router</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#45A180] font-['Lexend']">Layout Component</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#45A180] font-['Lexend']">Header Navigation</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#45A180] font-['Lexend']">Responsive Design</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-[#E5E8EB] shadow-sm">
              <CardHeader className="p-6">
                <CardTitle className="text-lg font-bold text-[#0D1C17] font-['Lexend']">
                  Quick Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-3">
                  <Link
                    to="/"
                    className="flex items-center justify-between p-3 bg-[#F7FCFA] rounded-lg border border-[#E5E8EB] hover:bg-[#E5F5F0] transition-colors"
                  >
                    <span className="text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Dashboard
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#45A180]" />
                  </Link>
                  
                  <Link
                    to="/ai-bot"
                    className="flex items-center justify-between p-3 bg-[#F7FCFA] rounded-lg border border-[#E5E8EB] hover:bg-[#E5F5F0] transition-colors"
                  >
                    <span className="text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      🤖 AI Assistant
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#45A180]" />
                  </Link>
                  
                  <Link
                    to="/supplies"
                    className="flex items-center justify-between p-3 bg-[#F7FCFA] rounded-lg border border-[#E5E8EB] hover:bg-[#E5F5F0] transition-colors"
                  >
                    <span className="text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Inventory Management
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#45A180]" />
                  </Link>
                  
                  <Link
                    to="/alerts"
                    className="flex items-center justify-between p-3 bg-[#F7FCFA] rounded-lg border border-[#E5E8EB] hover:bg-[#E5F5F0] transition-colors"
                  >
                    <span className="text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Alerts & Notifications
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#45A180]" />
                  </Link>

                  <Link
                    to="/data-sync"
                    className="flex items-center justify-between p-3 bg-[#F7FCFA] rounded-lg border border-[#E5E8EB] hover:bg-[#E5F5F0] transition-colors"
                  >
                    <span className="text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Data Synchronization
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#45A180]" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-[#0D1C17] font-['Lexend'] mb-2">
                  🎉 All Systems Operational
                </h3>
                <p className="text-[#45A180] text-sm font-['Lexend']">
                  The AgriSupply Insights platform is running smoothly with all navigation and routing working correctly.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
