import React from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  BarChart3,
} from "lucide-react";
import Layout from "../components/Layout";
import MetricCard from "../components/MetricCard";
import ChartCard from "../components/ChartCard";

export default function Dashboard() {
  return (
    <Layout>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1C17] font-['Lexend'] mb-2">
              Dashboard
            </h1>
            <p className="text-[#45A180] text-sm sm:text-base font-['Lexend']">
              Welcome back! Here's your agricultural supply chain overview.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <MetricCard
              title="Total Spend"
              value="$247,891"
              change="+12.5%"
              changeType="positive"
              icon={<DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />}
            />
            <MetricCard
              title="Avg Order Value"
              value="$4,850"
              change="+5.2%"
              changeType="positive"
              icon={<BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />}
            />
            <MetricCard
              title="Delivery Rate"
              value="96.8%"
              change="+2.1%"
              changeType="positive"
              icon={<Package className="w-5 h-5 sm:w-6 sm:h-6" />}
            />
            <MetricCard
              title="Active Suppliers"
              value="42"
              change="+3"
              changeType="positive"
              icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Charts and Data */}
            <div className="xl:col-span-2 space-y-6">
              {/* Purchase Recommendations */}
              <div className="bg-white rounded-xl border border-[#E5E8EB] p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  <h2 className="text-[#0D1C17] text-lg sm:text-xl font-bold font-['Lexend']">
                    Purchase Recommendations
                  </h2>
                  <Link
                    to="/supplies"
                    className="text-[#45A180] text-sm font-medium font-['Lexend'] hover:underline"
                  >
                    View All →
                  </Link>
                </div>

                {/* Responsive Table */}
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-[#E5E8EB]">
                            <th className="text-left py-3 px-4 text-[#45A180] text-sm font-medium font-['Lexend']">
                              Item
                            </th>
                            <th className="text-left py-3 px-4 text-[#45A180] text-sm font-medium font-['Lexend'] hidden sm:table-cell">
                              Current Stock
                            </th>
                            <th className="text-left py-3 px-4 text-[#45A180] text-sm font-medium font-['Lexend']">
                              Recommended
                            </th>
                            <th className="text-left py-3 px-4 text-[#45A180] text-sm font-medium font-['Lexend'] hidden md:table-cell">
                              Cost
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[#F0F0F0]">
                            <td className="py-3 px-4">
                              <div className="font-medium text-[#0D1C17] text-sm font-['Lexend']">
                                Nitrogen Fertilizer
                              </div>
                              <div className="text-[#45A180] text-xs font-['Lexend'] sm:hidden">
                                Current: 45 bags
                              </div>
                            </td>
                            <td className="py-3 px-4 text-[#0D1C17] text-sm font-['Lexend'] hidden sm:table-cell">
                              45 bags
                            </td>
                            <td className="py-3 px-4 text-[#0D1C17] text-sm font-bold font-['Lexend']">
                              100 bags
                            </td>
                            <td className="py-3 px-4 text-[#0D1C17] text-sm font-['Lexend'] hidden md:table-cell">
                              $2,750
                            </td>
                          </tr>
                          <tr className="border-b border-[#F0F0F0]">
                            <td className="py-3 px-4">
                              <div className="font-medium text-[#0D1C17] text-sm font-['Lexend']">
                                Corn Seeds
                              </div>
                              <div className="text-[#45A180] text-xs font-['Lexend'] sm:hidden">
                                Current: 12 bags
                              </div>
                            </td>
                            <td className="py-3 px-4 text-[#0D1C17] text-sm font-['Lexend'] hidden sm:table-cell">
                              12 bags
                            </td>
                            <td className="py-3 px-4 text-[#0D1C17] text-sm font-bold font-['Lexend']">
                              50 bags
                            </td>
                            <td className="py-3 px-4 text-[#0D1C17] text-sm font-['Lexend'] hidden md:table-cell">
                              $3,200
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4">
                              <div className="font-medium text-[#0D1C17] text-sm font-['Lexend']">
                                Pesticide
                              </div>
                              <div className="text-[#45A180] text-xs font-['Lexend'] sm:hidden">
                                Current: 8 gallons
                              </div>
                            </td>
                            <td className="py-3 px-4 text-[#0D1C17] text-sm font-['Lexend'] hidden sm:table-cell">
                              8 gallons
                            </td>
                            <td className="py-3 px-4 text-[#0D1C17] text-sm font-bold font-['Lexend']">
                              25 gallons
                            </td>
                            <td className="py-3 px-4 text-[#0D1C17] text-sm font-['Lexend'] hidden md:table-cell">
                              $850
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <ChartCard
                  title="Monthly Spend Trend"
                  subtitle="Last 6 months"
                  data={[
                    { month: "Jan", amount: 65000 },
                    { month: "Feb", amount: 72000 },
                    { month: "Mar", amount: 68000 },
                    { month: "Apr", amount: 78000 },
                    { month: "May", amount: 85000 },
                    { month: "Jun", amount: 92000 },
                  ]}
                />
                <ChartCard
                  title="Category Distribution"
                  subtitle="Current inventory"
                  data={[
                    { name: "Seeds", value: 35 },
                    { name: "Fertilizer", value: 40 },
                    { name: "Equipment", value: 25 },
                  ]}
                />
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-[#E5E8EB] p-4 sm:p-6 shadow-sm">
                <h2 className="text-[#0D1C17] text-lg font-bold font-['Lexend'] mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Link
                    to="/supplies"
                    className="w-full h-10 px-4 bg-[#45A180] text-white rounded-[20px] flex items-center justify-center transition-colors hover:bg-[#3A8B6B] font-bold text-sm font-['Lexend']"
                  >
                    Create New Order
                  </Link>
                  <Link
                    to="/supplies"
                    className="w-full h-10 px-4 bg-[#E5F5F0] text-[#0D1C17] rounded-[20px] flex items-center justify-center transition-colors hover:bg-[#CCE8DE] font-bold text-sm font-['Lexend']"
                  >
                    View Inventory
                  </Link>
                  <Link
                    to="/market-trends"
                    className="w-full h-10 px-4 bg-[#E5F5F0] text-[#0D1C17] rounded-[20px] flex items-center justify-center transition-colors hover:bg-[#CCE8DE] font-bold text-sm font-['Lexend']"
                  >
                    Market Analysis
                  </Link>
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="bg-white rounded-xl border border-[#E5E8EB] p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[#0D1C17] text-lg font-bold font-['Lexend']">
                    Recent Alerts
                  </h2>
                  <Link
                    to="/alerts"
                    className="text-[#45A180] text-sm font-medium font-['Lexend'] hover:underline"
                  >
                    View All →
                  </Link>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-[#FEF7F0] rounded-lg border border-orange-200">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#0D1C17] text-sm font-medium font-['Lexend'] mb-1">
                        Low Stock Alert
                      </h3>
                      <p className="text-[#45A180] text-xs font-['Lexend'] break-words">
                        Fertilizer inventory below threshold
                      </p>
                      <span className="text-[#45A180] text-xs font-['Lexend']">
                        2h ago
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#F0F8FF] rounded-lg border border-blue-200">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#0D1C17] text-sm font-medium font-['Lexend'] mb-1">
                        Price Increase
                      </h3>
                      <p className="text-[#45A180] text-xs font-['Lexend'] break-words">
                        Corn seed prices up 8% this week
                      </p>
                      <span className="text-[#45A180] text-xs font-['Lexend']">
                        1d ago
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#F0FDF4] rounded-lg border border-green-200">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#0D1C17] text-sm font-medium font-['Lexend'] mb-1">
                        Delivery Complete
                      </h3>
                      <p className="text-[#45A180] text-xs font-['Lexend'] break-words">
                        Order #1234 delivered successfully
                      </p>
                      <span className="text-[#45A180] text-xs font-['Lexend']">
                        3d ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
