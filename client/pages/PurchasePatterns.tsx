import React from "react";
import Layout from "../components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingUp, Users, DollarSign, Calendar, Eye } from "lucide-react";

const segmentationData = [
  {
    segment: "High-Demand Crops",
    description:
      "Customers focusing on high-demand crops like corn and soybeans.",
    predictedNeeds:
      "Increased fertilizer and pesticide needs over the next quarter.",
    optimalPurchaseTime: "Purchase during off-peak season to maximize savings.",
    potentialSavings: "$5,000 - $10,000",
    customers: 156,
    revenue: 245000,
  },
  {
    segment: "Specialty Crops",
    description:
      "Customers growing specialty crops such as fruits and vegetables.",
    predictedNeeds: "Consistent need for specific nutrients and pest control.",
    optimalPurchaseTime: "Optimal purchase times vary; monitor market trends.",
    potentialSavings: "$2,000 - $5,000",
    customers: 89,
    revenue: 178000,
  },
  {
    segment: "Livestock Feed",
    description: "Customers involved in livestock farming.",
    predictedNeeds: "High demand for feed supplements and related products.",
    optimalPurchaseTime:
      "Purchase in bulk during harvest season for cost efficiency.",
    potentialSavings: "$3,000 - $7,000",
    customers: 124,
    revenue: 298000,
  },
];

const customerPatternsData = [
  {
    customer: "Ethan Carter",
    lastPurchase: "2 weeks ago",
    frequency: "Monthly",
    averageSpend: "$1,500",
    predictedNext: "In 2 weeks",
    segment: "High-Demand Crops",
    totalSpend: "$18,000",
  },
  {
    customer: "Olivia Bennett",
    lastPurchase: "1 month ago",
    frequency: "Quarterly",
    averageSpend: "$3,200",
    predictedNext: "In 2 months",
    segment: "Specialty Crops",
    totalSpend: "$12,800",
  },
  {
    customer: "Marcus Johnson",
    lastPurchase: "3 weeks ago",
    frequency: "Bi-monthly",
    averageSpend: "$2,800",
    predictedNext: "In 3 weeks",
    segment: "Livestock Feed",
    totalSpend: "$16,800",
  },
  {
    customer: "Sarah Wilson",
    lastPurchase: "1 week ago",
    frequency: "Monthly",
    averageSpend: "$1,200",
    predictedNext: "In 3 weeks",
    segment: "High-Demand Crops",
    totalSpend: "$14,400",
  },
];

const monthlyTrends = [
  { month: "Jan", purchases: 45, revenue: 128000 },
  { month: "Feb", purchases: 52, revenue: 142000 },
  { month: "Mar", purchases: 48, revenue: 135000 },
  { month: "Apr", purchases: 61, revenue: 168000 },
  { month: "May", purchases: 58, revenue: 159000 },
  { month: "Jun", purchases: 67, revenue: 184000 },
];

const segmentDistribution = [
  { name: "High-Demand Crops", value: 42, color: "#45A180" },
  { name: "Specialty Crops", value: 24, color: "#7DD3FC" },
  { name: "Livestock Feed", value: 34, color: "#FB7185" },
];

export default function PurchasePatterns() {
  return (
    <Layout>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#F7FCFA] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1C17] font-['Lexend'] mb-2">
              Customer Insights & Purchase Patterns
            </h1>
            <p className="text-[#45A180] text-sm sm:text-base font-['Lexend']">
              Analyze customer behavior and predict future purchasing trends
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card className="bg-white border border-[#E5E8EB] shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#45A180] text-sm font-['Lexend']">
                      Total Customers
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#0D1C17] font-['Lexend']">
                      369
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-[#45A180]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-[#E5E8EB] shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#45A180] text-sm font-['Lexend']">
                      Avg Purchase
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#0D1C17] font-['Lexend']">
                      $2,150
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-[#45A180]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-[#E5E8EB] shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#45A180] text-sm font-['Lexend']">
                      Purchase Frequency
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#0D1C17] font-['Lexend']">
                      6.2/yr
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-[#45A180]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-[#E5E8EB] shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#45A180] text-sm font-['Lexend']">
                      Growth Rate
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#0D1C17] font-['Lexend']">
                      +15.3%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-[#45A180]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
            {/* Monthly Trends */}
            <Card className="bg-white border border-[#E5E8EB] shadow-sm">
              <CardHeader className="p-4 sm:p-6 pb-2">
                <CardTitle className="text-lg font-bold text-[#0D1C17] font-['Lexend']">
                  Monthly Purchase Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrends}>
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                      />
                      <YAxis tick={{ fontSize: 12 }} axisLine={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="purchases"
                        stroke="#45A180"
                        strokeWidth={2}
                        dot={{ fill: "#45A180", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Customer Segments */}
            <Card className="bg-white border border-[#E5E8EB] shadow-sm">
              <CardHeader className="p-4 sm:p-6 pb-2">
                <CardTitle className="text-lg font-bold text-[#0D1C17] font-['Lexend']">
                  Customer Segments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={segmentDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {segmentDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Segments Analysis */}
          <Card className="bg-white border border-[#E5E8EB] shadow-sm mb-6 lg:mb-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg font-bold text-[#0D1C17] font-['Lexend']">
                Customer Segmentation Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {segmentationData.map((segment, index) => (
                  <div
                    key={index}
                    className="p-4 border border-[#E5E8EB] rounded-lg bg-[#F7FCFA]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-[#0D1C17] font-['Lexend']">
                        {segment.segment}
                      </h3>
                      <span className="text-xs bg-[#45A180] text-white px-2 py-1 rounded-full font-['Lexend']">
                        {segment.customers} customers
                      </span>
                    </div>

                    <p className="text-sm text-[#45A180] font-['Lexend'] mb-3 leading-relaxed">
                      {segment.description}
                    </p>

                    <div className="space-y-2 text-xs font-['Lexend']">
                      <div>
                        <span className="font-medium text-[#0D1C17]">
                          Revenue:{" "}
                        </span>
                        <span className="text-[#45A180]">
                          ${segment.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-[#0D1C17]">
                          Potential Savings:{" "}
                        </span>
                        <span className="text-[#45A180]">
                          {segment.potentialSavings}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Purchase Patterns Table */}
          <Card className="bg-white border border-[#E5E8EB] shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-lg font-bold text-[#0D1C17] font-['Lexend']">
                  Individual Customer Patterns
                </CardTitle>
                <button className="text-[#45A180] text-sm font-medium font-['Lexend'] hover:underline flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  View All Customers
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-[#E5E8EB]">
                        <th className="text-left py-3 px-2 sm:px-4 text-[#45A180] text-sm font-medium font-['Lexend']">
                          Customer
                        </th>
                        <th className="text-left py-3 px-2 sm:px-4 text-[#45A180] text-sm font-medium font-['Lexend'] hidden sm:table-cell">
                          Segment
                        </th>
                        <th className="text-left py-3 px-2 sm:px-4 text-[#45A180] text-sm font-medium font-['Lexend']">
                          Frequency
                        </th>
                        <th className="text-left py-3 px-2 sm:px-4 text-[#45A180] text-sm font-medium font-['Lexend'] hidden md:table-cell">
                          Avg Spend
                        </th>
                        <th className="text-left py-3 px-2 sm:px-4 text-[#45A180] text-sm font-medium font-['Lexend']">
                          Next Purchase
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerPatternsData.map((customer, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#F0F0F0] hover:bg-[#F7FCFA]"
                        >
                          <td className="py-3 px-2 sm:px-4">
                            <div>
                              <div className="font-medium text-[#0D1C17] text-sm font-['Lexend']">
                                {customer.customer}
                              </div>
                              <div className="text-[#45A180] text-xs font-['Lexend'] sm:hidden">
                                {customer.segment}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2 sm:px-4 text-[#0D1C17] text-sm font-['Lexend'] hidden sm:table-cell">
                            {customer.segment}
                          </td>
                          <td className="py-3 px-2 sm:px-4 text-[#0D1C17] text-sm font-['Lexend']">
                            {customer.frequency}
                          </td>
                          <td className="py-3 px-2 sm:px-4 text-[#0D1C17] text-sm font-bold font-['Lexend'] hidden md:table-cell">
                            {customer.averageSpend}
                          </td>
                          <td className="py-3 px-2 sm:px-4">
                            <span className="text-[#45A180] text-sm font-['Lexend'] bg-[#E5F5F0] px-2 py-1 rounded-full">
                              {customer.predictedNext}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
