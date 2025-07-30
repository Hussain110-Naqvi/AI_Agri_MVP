import Layout from "../components/Layout";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const segmentationData = [
  {
    segment: "High-Demand Crops",
    description:
      "Customers focusing on high-demand crops like corn and soybeans.",
    predictedNeeds:
      "Increased fertilizer and pesticide needs over the next quarter.",
    optimalPurchaseTime: "Purchase during off-peak season to maximize savings.",
    potentialSavings: "$5,000 - $10,000",
  },
  {
    segment: "Specialty Crops",
    description:
      "Customers growing specialty crops such as fruits and vegetables.",
    predictedNeeds: "Consistent need for specific nutrients and pest control.",
    optimalPurchaseTime: "Optimal purchase times vary; monitor market trends.",
    potentialSavings: "$2,000 - $5,000",
  },
  {
    segment: "Livestock Feed",
    description: "Customers involved in livestock farming.",
    predictedNeeds: "High demand for feed supplements and related products.",
    optimalPurchaseTime:
      "Purchase in bulk during harvest season for cost efficiency.",
    potentialSavings: "$3,000 - $7,000",
  },
];

const customerPatternsData = [
  {
    customer: "Ethan Carter",
    lastPurchase: "2 weeks ago",
    frequency: "Monthly",
    averageSpend: "$1,500",
    predictedNext: "In 2 weeks",
  },
  {
    customer: "Olivia Bennett",
    lastPurchase: "1 month ago",
    frequency: "Quarterly",
    averageSpend: "$3,000",
    predictedNext: "In 2 months",
  },
  {
    customer: "Noah Thompson",
    lastPurchase: "3 weeks ago",
    frequency: "Bi-monthly",
    averageSpend: "$2,000",
    predictedNext: "In 3 weeks",
  },
  {
    customer: "Ava Harper",
    lastPurchase: "2 months ago",
    frequency: "Semi-annually",
    averageSpend: "$5,000",
    predictedNext: "In 4 months",
  },
  {
    customer: "Liam Foster",
    lastPurchase: "1 week ago",
    frequency: "Monthly",
    averageSpend: "$1,200",
    predictedNext: "In 3 weeks",
  },
];

const predictionsChartData = [
  { week: "Week 1", value: 92 },
  { week: "Week 2", value: 18 },
  { week: "Week 3", value: 35 },
  { week: "Week 4", value: 79 },
  { week: "Week 5", value: 28 },
  { week: "Week 6", value: 86 },
  { week: "Week 7", value: 52 },
];

const purchaseWindowsData = [
  { month: "Jan", value: 85 },
  { month: "Feb", value: 85 },
  { month: "Mar", value: 85 },
  { month: "Apr", value: 85 },
  { month: "May", value: 85 },
  { month: "Jun", value: 85 },
  { month: "Jul", value: 85 },
];

export default function PurchasePatterns() {
  return (
    <Layout>
      <div className="w-full px-40 py-5 bg-[#F7FCFA]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="p-4 mb-4">
            <h1 className="text-[32px] font-bold text-[#0D1C17] font-['Lexend'] mb-3">
              Customer Purchase Patterns
            </h1>
            <p className="text-sm text-[#45A180] font-['Lexend']">
              AI-driven insights on customer purchasing patterns, predicted
              future needs, and optimal purchasing times.
            </p>
          </div>

          {/* Customer Segmentation */}
          <div className="mb-6">
            <h2 className="text-[22px] font-bold text-[#0D1C17] font-['Lexend'] px-4 py-5">
              Customer Segmentation
            </h2>
            <div className="px-4">
              <Card className="border border-[#CCE8DE] bg-[#F7FCFA] rounded-xl">
                <div className="overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-5 bg-[#F7FCFA]">
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Segment
                    </div>
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Description
                    </div>
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Predicted Needs
                    </div>
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Optimal Purchase Time
                    </div>
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Potential Savings
                    </div>
                  </div>

                  {/* Table Body */}
                  {segmentationData.map((row, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 border-t border-[#E5E8EB]"
                    >
                      <div className="p-4 flex items-center min-h-[101px]">
                        <span className="text-sm text-[#0D1C17] font-['Lexend']">
                          {row.segment}
                        </span>
                      </div>
                      <div className="p-4 flex items-center min-h-[101px]">
                        <span className="text-sm text-[#45A180] font-['Lexend']">
                          {row.description}
                        </span>
                      </div>
                      <div className="p-4 flex items-center min-h-[101px]">
                        <span className="text-sm text-[#45A180] font-['Lexend']">
                          {row.predictedNeeds}
                        </span>
                      </div>
                      <div className="p-4 flex items-center min-h-[101px]">
                        <span className="text-sm text-[#45A180] font-['Lexend']">
                          {row.optimalPurchaseTime}
                        </span>
                      </div>
                      <div className="p-4 flex items-center min-h-[101px]">
                        <span className="text-sm text-[#45A180] font-['Lexend']">
                          {row.potentialSavings}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Purchase Predictions */}
          <div className="mb-6">
            <h2 className="text-[22px] font-bold text-[#0D1C17] font-['Lexend'] px-4 py-5">
              Purchase Predictions
            </h2>
            <div className="px-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Predicted Needs Over Time */}
              <Card className="border border-[#CCE8DE] rounded-xl p-6">
                <div className="mb-2">
                  <h3 className="text-base font-medium text-[#0D1C17] font-['Lexend']">
                    Predicted Needs Over Time
                  </h3>
                </div>
                <div className="mb-2">
                  <span className="text-[32px] font-bold text-[#0D1C17] font-['Lexend']">
                    15%
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-6">
                  <span className="text-base text-[#45A180] font-['Lexend']">
                    Next 3 Months
                  </span>
                  <span className="text-base font-medium text-[#08872E] font-['Lexend']">
                    +5%
                  </span>
                </div>
                <div className="h-37 mb-8">
                  <ResponsiveContainer width="100%" height={148}>
                    <LineChart data={predictionsChartData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#45A180"
                        strokeWidth={3}
                        dot={false}
                        fill="url(#gradient)"
                      />
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#E6F5F0" />
                          <stop
                            offset="100%"
                            stopColor="#E6F5F0"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between">
                  {predictionsChartData.map((item) => (
                    <span
                      key={item.week}
                      className="text-[13px] font-bold text-[#45A180] font-['Lexend']"
                    >
                      {item.week}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Optimal Purchase Windows */}
              <Card className="border border-[#CCE8DE] rounded-xl p-6">
                <div className="mb-2">
                  <h3 className="text-base font-medium text-[#0D1C17] font-['Lexend']">
                    Optimal Purchase Windows
                  </h3>
                </div>
                <div className="mb-2">
                  <span className="text-[32px] font-bold text-[#0D1C17] font-['Lexend']">
                    20%
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-6">
                  <span className="text-base text-[#45A180] font-['Lexend']">
                    Next 3 Months
                  </span>
                  <span className="text-base font-medium text-[#E82E08] font-['Lexend']">
                    -2%
                  </span>
                </div>
                <div className="h-37 mb-8 px-3">
                  <div className="flex items-end gap-6 h-[137px]">
                    {purchaseWindowsData.map((item) => (
                      <div
                        key={item.month}
                        className="flex flex-col items-center gap-6"
                      >
                        <div className="w-12 h-[137px] bg-[#E5F5F0] border-t-2 border-[#757575]"></div>
                        <span className="text-[13px] font-bold text-[#45A180] font-['Lexend']">
                          {item.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Customer Purchasing Patterns */}
          <div className="mb-6">
            <h2 className="text-[22px] font-bold text-[#0D1C17] font-['Lexend'] px-4 py-5">
              Customer Purchasing Patterns
            </h2>
            <div className="px-4">
              <Card className="border border-[#CCE8DE] bg-[#F7FCFA] rounded-xl">
                <div className="overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-5 bg-[#F7FCFA]">
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Customer
                    </div>
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Last Purchase
                    </div>
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Frequency
                    </div>
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Average Spend
                    </div>
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Predicted Next Purchase
                    </div>
                  </div>

                  {/* Table Body */}
                  {customerPatternsData.map((row, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 border-t border-[#E5E8EB]"
                    >
                      <div className="p-4 flex items-center h-18">
                        <span className="text-sm text-[#0D1C17] font-['Lexend']">
                          {row.customer}
                        </span>
                      </div>
                      <div className="p-4 flex items-center h-18">
                        <span className="text-sm text-[#45A180] font-['Lexend']">
                          {row.lastPurchase}
                        </span>
                      </div>
                      <div className="p-4 flex items-center h-18">
                        <span className="text-sm text-[#45A180] font-['Lexend']">
                          {row.frequency}
                        </span>
                      </div>
                      <div className="p-4 flex items-center h-18">
                        <span className="text-sm text-[#45A180] font-['Lexend']">
                          {row.averageSpend}
                        </span>
                      </div>
                      <div className="p-4 flex items-center h-18">
                        <span className="text-sm text-[#45A180] font-['Lexend']">
                          {row.predictedNext}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
