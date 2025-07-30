import Layout from "../components/Layout";
import { Card } from "@/components/ui/card";
import { Search, Bell } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const alertsData = [
  {
    alertType: "Price Change",
    description: "Price of fertilizer increased by 15%",
    timestamp: "2024-07-26 10:30 AM",
    severity: "High",
  },
  {
    alertType: "Supply Shortage",
    description: "Potential shortage of wheat seeds in the next 2 weeks",
    timestamp: "2024-07-25 04:15 PM",
    severity: "Critical",
  },
  {
    alertType: "High Demand",
    description: "Increased demand for organic pesticides",
    timestamp: "2024-07-24 09:00 AM",
    severity: "Medium",
  },
  {
    alertType: "Price Change",
    description: "Price of corn seeds decreased by 5%",
    timestamp: "2024-07-23 02:45 PM",
    severity: "Low",
  },
  {
    alertType: "Supply Shortage",
    description: "Low stock of irrigation equipment",
    timestamp: "2024-07-22 11:20 AM",
    severity: "Medium",
  },
];

const demandTrendData = [
  { week: "Week 1", value: 95 },
  { week: "Week 2", value: 45 },
  { week: "Week 3", value: 120 },
  { week: "Week 4", value: 85 },
];

const inventoryData = [
  { category: "Fertilizer", level: 85 },
  { category: "Wheat Seeds", level: 85 },
  { category: "Pesticides", level: 85 },
  { category: "Corn Seeds", level: 85 },
  { category: "Irrigation Equipment", level: 85 },
];

const getSeverityBadge = (severity: string) => {
  return (
    <div className="flex items-center justify-center px-4 py-2 bg-[#E5F5F0] rounded-2xl min-w-[84px]">
      <span className="text-sm font-medium text-[#0D1C17] font-['Lexend']">
        {severity}
      </span>
    </div>
  );
};

export default function Alerts() {
  return (
    <Layout>
      <div className="w-full px-40 py-5 bg-[#F7FCFA]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="p-4 mb-4">
            <h1 className="text-[32px] font-bold text-[#0D1C17] font-['Lexend'] mb-3">
              Real-Time Alerts
            </h1>
          </div>

          {/* Critical Information */}
          <div className="mb-6">
            <h2 className="text-[22px] font-bold text-[#0D1C17] font-['Lexend'] px-4 py-5">
              Critical Information
            </h2>
            <div className="px-4">
              <Card className="border border-[#CCE8DE] bg-[#F7FCFA] rounded-xl">
                <div className="overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 bg-[#F7FCFA]">
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Alert Type
                    </div>
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Description
                    </div>
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Timestamp
                    </div>
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Severity
                    </div>
                  </div>

                  {/* Table Body */}
                  {alertsData.map((row, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 border-t border-[#E5E8EB]"
                    >
                      <div className="p-4 flex items-center h-18">
                        <span className="text-sm text-[#0D1C17] font-['Lexend']">
                          {row.alertType}
                        </span>
                      </div>
                      <div className="p-4 flex items-center h-18">
                        <span className="text-sm text-[#45A180] font-['Lexend']">
                          {row.description}
                        </span>
                      </div>
                      <div className="p-4 flex items-center h-18">
                        <span className="text-sm text-[#45A180] font-['Lexend']">
                          {row.timestamp}
                        </span>
                      </div>
                      <div className="p-4 flex items-center h-18">
                        {getSeverityBadge(row.severity)}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Demand Trends */}
          <div className="mb-6">
            <h2 className="text-[22px] font-bold text-[#0D1C17] font-['Lexend'] px-4 py-5">
              Demand Trends
            </h2>
            <div className="px-4">
              <Card className="border border-[#CCE8DE] rounded-xl p-6 max-w-2xl">
                <div className="mb-2">
                  <h3 className="text-base font-medium text-[#0D1C17] font-['Lexend']">
                    Consumer Demand for Supplies
                  </h3>
                </div>
                <div className="mb-2">
                  <span className="text-[32px] font-bold text-[#0D1C17] font-['Lexend']">
                    +12%
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-6">
                  <span className="text-base text-[#45A180] font-['Lexend']">
                    Last 30 Days
                  </span>
                  <span className="text-base font-medium text-[#08872E] font-['Lexend']">
                    +12%
                  </span>
                </div>
                <div className="h-37 mb-8">
                  <ResponsiveContainer width="100%" height={148}>
                    <LineChart data={demandTrendData}>
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
                  {demandTrendData.map((item) => (
                    <span
                      key={item.week}
                      className="text-[13px] font-bold text-[#45A180] font-['Lexend']"
                    >
                      {item.week}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Inventory Levels */}
          <div className="mb-6">
            <h2 className="text-[22px] font-bold text-[#0D1C17] font-['Lexend'] px-4 py-5">
              Inventory Levels
            </h2>
            <div className="px-4">
              <Card className="border border-[#CCE8DE] rounded-xl p-6 max-w-2xl">
                <div className="mb-2">
                  <h3 className="text-base font-medium text-[#0D1C17] font-['Lexend']">
                    Current Inventory Levels
                  </h3>
                </div>
                <div className="mb-2">
                  <span className="text-[32px] font-bold text-[#0D1C17] font-['Lexend']">
                    85%
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-6">
                  <span className="text-base text-[#45A180] font-['Lexend']">
                    Current
                  </span>
                  <span className="text-base font-medium text-[#E82E08] font-['Lexend']">
                    -5%
                  </span>
                </div>
                <div className="h-[180px] mb-4">
                  <div className="flex items-end gap-2 h-[137px] mb-4">
                    {inventoryData.map((item) => (
                      <div
                        key={item.category}
                        className="flex flex-col items-center flex-1"
                      >
                        <div className="w-full h-[137px] bg-[#E5F5F0] border-t-2 border-[#757575]"></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between gap-1">
                    {inventoryData.map((item) => (
                      <span
                        key={item.category}
                        className="text-[11px] font-bold text-[#45A180] font-['Lexend'] text-center flex-1 leading-tight"
                      >
                        {item.category}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
