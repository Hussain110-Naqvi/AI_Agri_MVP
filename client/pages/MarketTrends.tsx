import React, { useState } from "react";
import Layout from "../components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Cloud,
  Thermometer,
  Droplets,
  Calendar,
  Filter,
  Download,
} from "lucide-react";

const priceData = [
  { date: "Jan 1", corn: 6.25, soybeans: 14.5, wheat: 8.75, fertilizer: 1200 },
  { date: "Jan 15", corn: 6.18, soybeans: 14.75, wheat: 8.6, fertilizer: 1180 },
  { date: "Feb 1", corn: 6.35, soybeans: 14.9, wheat: 8.95, fertilizer: 1220 },
  { date: "Feb 15", corn: 6.42, soybeans: 15.1, wheat: 9.15, fertilizer: 1250 },
  { date: "Mar 1", corn: 6.55, soybeans: 15.25, wheat: 9.3, fertilizer: 1280 },
  { date: "Mar 15", corn: 6.48, soybeans: 14.95, wheat: 9.1, fertilizer: 1260 },
  { date: "Apr 1", corn: 6.7, soybeans: 15.4, wheat: 9.45, fertilizer: 1300 },
];

const commodityOverview = [
  {
    name: "Corn",
    currentPrice: "$6.70/bu",
    change: "+7.2%",
    trend: "up",
    volume: "1.2M bu",
    forecast: "Bullish",
    color: "#45A180",
  },
  {
    name: "Soybeans",
    currentPrice: "$15.40/bu",
    change: "+6.2%",
    trend: "up",
    volume: "850K bu",
    forecast: "Neutral",
    color: "#7DD3FC",
  },
  {
    name: "Wheat",
    currentPrice: "$9.45/bu",
    change: "+8.0%",
    trend: "up",
    volume: "950K bu",
    forecast: "Bullish",
    color: "#FB7185",
  },
  {
    name: "Fertilizer",
    currentPrice: "$1,300/ton",
    change: "+8.3%",
    trend: "up",
    volume: "2.5K tons",
    forecast: "Bearish",
    color: "#A78BFA",
  },
];

const weatherData = [
  { region: "Midwest", temp: 72, rainfall: 3.2, conditions: "Favorable" },
  { region: "Plains", temp: 78, rainfall: 2.1, conditions: "Dry" },
  { region: "Southeast", temp: 81, rainfall: 4.8, conditions: "Wet" },
  { region: "Northeast", temp: 68, rainfall: 2.9, conditions: "Favorable" },
];

const marketNews = [
  {
    title: "Corn Futures Rally on Export Demand",
    time: "2 hours ago",
    impact: "Positive",
    summary:
      "Strong export demand from China drives corn prices higher in morning trading.",
  },
  {
    title: "Weather Concerns in Argentina",
    time: "5 hours ago",
    impact: "Neutral",
    summary:
      "Drought conditions in Argentina may affect global soybean supply projections.",
  },
  {
    title: "Fertilizer Costs Continue to Rise",
    time: "1 day ago",
    impact: "Negative",
    summary:
      "Energy costs and supply chain issues drive fertilizer prices to new highs.",
  },
];

export default function MarketTrends() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("3M");
  const [selectedCommodity, setSelectedCommodity] = useState("All");

  const timeframes = ["1M", "3M", "6M", "1Y"];
  const commodities = ["All", "Corn", "Soybeans", "Wheat", "Fertilizer"];

  return (
    <Layout>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#F7FCFA] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1C17] font-['Lexend'] mb-2">
                  Market Trends & Analysis
                </h1>
                <p className="text-[#45A180] text-sm sm:text-base font-['Lexend']">
                  Real-time commodity prices and market intelligence
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Time Controls */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm font-medium text-[#0D1C17] font-['Lexend']">
              Timeframe:
            </span>
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe}
                variant={
                  selectedTimeframe === timeframe ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
                className="text-xs"
              >
                {timeframe}
              </Button>
            ))}

            <span className="text-sm font-medium text-[#0D1C17] font-['Lexend'] ml-4">
              Commodity:
            </span>
            {commodities.map((commodity) => (
              <Button
                key={commodity}
                variant={
                  selectedCommodity === commodity ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCommodity(commodity)}
                className="text-xs"
              >
                {commodity}
              </Button>
            ))}
          </div>

          {/* Commodity Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {commodityOverview.map((commodity, index) => (
              <Card
                key={index}
                className="bg-white border border-[#E5E8EB] shadow-sm"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-[#0D1C17] font-['Lexend']">
                      {commodity.name}
                    </h3>
                    <div
                      className={`flex items-center gap-1 ${
                        commodity.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {commodity.trend === "up" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="text-xs font-bold">
                        {commodity.change}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xl sm:text-2xl font-bold text-[#0D1C17] font-['Lexend']">
                      {commodity.currentPrice}
                    </div>
                    <div className="flex justify-between text-xs font-['Lexend']">
                      <span className="text-[#45A180]">
                        Volume: {commodity.volume}
                      </span>
                      <span
                        className={`font-medium ${
                          commodity.forecast === "Bullish"
                            ? "text-green-600"
                            : commodity.forecast === "Bearish"
                              ? "text-red-600"
                              : "text-yellow-600"
                        }`}
                      >
                        {commodity.forecast}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
            {/* Price Trends Chart */}
            <Card className="bg-white border border-[#E5E8EB] shadow-sm">
              <CardHeader className="p-4 sm:p-6 pb-2">
                <CardTitle className="text-lg font-bold text-[#0D1C17] font-['Lexend']">
                  Price Trends ({selectedTimeframe})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceData}>
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                      />
                      <YAxis tick={{ fontSize: 10 }} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #E5E8EB",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="corn"
                        stroke="#45A180"
                        strokeWidth={2}
                        name="Corn"
                      />
                      <Line
                        type="monotone"
                        dataKey="soybeans"
                        stroke="#7DD3FC"
                        strokeWidth={2}
                        name="Soybeans"
                      />
                      <Line
                        type="monotone"
                        dataKey="wheat"
                        stroke="#FB7185"
                        strokeWidth={2}
                        name="Wheat"
                      />
                      <Line
                        type="monotone"
                        dataKey="fertilizer"
                        stroke="#A78BFA"
                        strokeWidth={2}
                        name="Fertilizer"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Volume Chart */}
            <Card className="bg-white border border-[#E5E8EB] shadow-sm">
              <CardHeader className="p-4 sm:p-6 pb-2">
                <CardTitle className="text-lg font-bold text-[#0D1C17] font-['Lexend']">
                  Trading Volume
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceData}>
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                      />
                      <YAxis tick={{ fontSize: 10 }} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="corn" fill="#45A180" name="Corn" />
                      <Bar dataKey="soybeans" fill="#7DD3FC" name="Soybeans" />
                      <Bar dataKey="wheat" fill="#FB7185" name="Wheat" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Weather Impact */}
            <Card className="bg-white border border-[#E5E8EB] shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg font-bold text-[#0D1C17] font-['Lexend'] flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-[#45A180]" />
                  Weather Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-4">
                  {weatherData.map((region, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#F7FCFA] rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-[#0D1C17] text-sm font-['Lexend']">
                          {region.region}
                        </h4>
                        <p className="text-xs text-[#45A180] font-['Lexend']">
                          {region.conditions}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-['Lexend']">
                        <div className="flex items-center gap-1">
                          <Thermometer className="w-4 h-4 text-orange-500" />
                          <span className="text-[#0D1C17]">
                            {region.temp}°F
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="w-4 h-4 text-blue-500" />
                          <span className="text-[#0D1C17]">
                            {region.rainfall}"
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market News */}
            <Card className="bg-white border border-[#E5E8EB] shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg font-bold text-[#0D1C17] font-['Lexend']">
                  Market News & Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-4">
                  {marketNews.map((news, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-[#45A180] pl-4 py-2"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-[#0D1C17] text-sm font-['Lexend'] leading-snug">
                          {news.title}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-['Lexend'] flex-shrink-0 ${
                            news.impact === "Positive"
                              ? "bg-green-100 text-green-700"
                              : news.impact === "Negative"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {news.impact}
                        </span>
                      </div>
                      <p className="text-xs text-[#45A180] font-['Lexend'] mb-1 leading-relaxed">
                        {news.summary}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-[#45A180] font-['Lexend']">
                        <Calendar className="w-3 h-3" />
                        <span>{news.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
