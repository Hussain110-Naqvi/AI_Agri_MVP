import Layout from "../components/Layout";
import { Card } from "@/components/ui/card";
import { Search, Bell } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const commodityData = [
  {
    commodity: "Corn",
    currentPrice: "$4.50/bushel",
    trend: "Upward",
    forecast: "$4.75/bushel",
  },
  {
    commodity: "Soybeans",
    currentPrice: "$11.20/bushel",
    trend: "Stable",
    forecast: "$11.15/bushel",
  },
  {
    commodity: "Wheat",
    currentPrice: "$6.00/bushel",
    trend: "Downward",
    forecast: "$5.80/bushel",
  },
  {
    commodity: "Cotton",
    currentPrice: "$0.75/lb",
    trend: "Upward",
    forecast: "$0.80/lb",
  },
  {
    commodity: "Rice",
    currentPrice: "$15.50/cwt",
    trend: "Stable",
    forecast: "$15.45/cwt",
  },
];

const cornTrendData = [
  { month: "Jan", value: 92 },
  { month: "Feb", value: 18 },
  { month: "Mar", value: 35 },
  { month: "Apr", value: 79 },
  { month: "May", value: 28 },
  { month: "Jun", value: 86 },
  { month: "Jul", value: 52 },
];

const soybeanForecastData = [
  { month: "Jan", value: 85 },
  { month: "Feb", value: 85 },
  { month: "Mar", value: 85 },
  { month: "Apr", value: 85 },
  { month: "May", value: 85 },
  { month: "Jun", value: 85 },
];

const getTrendBadge = (trend: string) => {
  return (
    <div className="flex items-center justify-center px-4 py-2 bg-[#E5F5F0] rounded-2xl min-w-[84px]">
      <span className="text-sm font-medium text-[#0D1C17] font-['Lexend']">
        {trend}
      </span>
    </div>
  );
};

export default function MarketTrends() {
  return (
    <Layout>
      <div className="w-full px-40 py-5 bg-[#F7FCFA]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="p-4 mb-4">
            <h1 className="text-[32px] font-bold text-[#0D1C17] font-['Lexend'] mb-3">
              Market Trends
            </h1>
            <p className="text-sm text-[#45A180] font-['Lexend']">
              Stay ahead with real-time market analysis and forecasts.
            </p>
          </div>

          {/* Commodity Prices */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#0D1C17] font-['Lexend'] px-4 py-4">
              Commodity Prices
            </h2>
            <div className="px-4">
              <Card className="border border-[#CCE8DE] bg-[#F7FCFA] rounded-xl">
                <div className="overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 bg-[#F7FCFA]">
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Commodity
                    </div>
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Current Price
                    </div>
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Trend
                    </div>
                    <div className="p-4 text-sm font-medium text-[#0D1C17] font-['Lexend']">
                      Forecast
                    </div>
                  </div>

                  {/* Table Body */}
                  {commodityData.map((row, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 border-t border-[#E5E8EB]"
                    >
                      <div className="p-4 flex items-center h-18">
                        <span className="text-sm text-[#0D1C17] font-['Lexend']">
                          {row.commodity}
                        </span>
                      </div>
                      <div className="p-4 flex items-center h-18">
                        <span className="text-sm text-[#45A180] font-['Lexend']">
                          {row.currentPrice}
                        </span>
                      </div>
                      <div className="p-4 flex items-center h-18">
                        {getTrendBadge(row.trend)}
                      </div>
                      <div className="p-4 flex items-center h-18">
                        <span className="text-sm text-[#45A180] font-['Lexend']">
                          {row.forecast}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Market Analysis */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#0D1C17] font-['Lexend'] px-4 py-4">
              Market Analysis
            </h2>
            <div className="px-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Corn Price Trend */}
              <Card className="border border-[#CCE8DE] rounded-xl p-6">
                <div className="mb-2">
                  <h3 className="text-base font-medium text-[#0D1C17] font-['Lexend']">
                    Corn Price Trend
                  </h3>
                </div>
                <div className="mb-2">
                  <span className="text-[32px] font-bold text-[#0D1C17] font-['Lexend']">
                    $4.50/bushel
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-6">
                  <span className="text-base text-[#45A180] font-['Lexend']">
                    Last 12 Months
                  </span>
                  <span className="text-base font-medium text-[#08872E] font-['Lexend']">
                    +5%
                  </span>
                </div>
                <div className="h-37 mb-8">
                  <ResponsiveContainer width="100%" height={148}>
                    <LineChart data={cornTrendData}>
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
                  {cornTrendData.map((item) => (
                    <span
                      key={item.month}
                      className="text-[13px] font-bold text-[#45A180] font-['Lexend']"
                    >
                      {item.month}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Soybean Production Forecast */}
              <Card className="border border-[#CCE8DE] rounded-xl p-6">
                <div className="mb-2">
                  <h3 className="text-base font-medium text-[#0D1C17] font-['Lexend']">
                    Soybean Production Forecast
                  </h3>
                </div>
                <div className="mb-2">
                  <span className="text-[32px] font-bold text-[#0D1C17] font-['Lexend']">
                    120M bushels
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-6">
                  <span className="text-base text-[#45A180] font-['Lexend']">
                    Next 6 Months
                  </span>
                  <span className="text-base font-medium text-[#E82E08] font-['Lexend']">
                    -2%
                  </span>
                </div>
                <div className="h-37 mb-8 px-3">
                  <div className="flex items-end gap-6 h-[137px]">
                    {soybeanForecastData.map((item) => (
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

          {/* Expert Insights */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#0D1C17] font-['Lexend'] px-4 py-4">
              Expert Insights
            </h2>
            <div className="px-4">
              <Card className="border border-[#CCE8DE] rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className="text-base font-bold text-[#0D1C17] font-['Lexend'] mb-1">
                      Market Outlook for Q3 2024
                    </h3>
                    <p className="text-sm text-[#45A180] font-['Lexend']">
                      Dr. Emily Carter, agricultural economist, discusses the
                      expected market movements and factors influencing
                      commodity prices in the upcoming quarter.
                    </p>
                  </div>
                  <div className="w-80 h-[171px] bg-[#45A180] rounded-xl flex items-center justify-center">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2F7e77c78bcc0147ff888743468906bd8a%2F1f48d13b2cff4cd99b9b5409b6354d72?format=webp&width=800"
                      alt="Dr. Emily Carter"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Supply Chain Updates */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#0D1C17] font-['Lexend'] px-4 py-4">
              Supply Chain Updates
            </h2>
            <div className="px-4">
              <p className="text-base text-[#0D1C17] font-['Lexend'] leading-6">
                Stay informed about potential disruptions and changes in the
                supply chain that could affect your purchasing decisions. We
                provide real-time updates on logistics, weather impacts, and
                policy changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
