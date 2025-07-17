import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Bell } from "lucide-react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  // Static demo data
  const demoData = {
    metrics: {
      total_revenue: 125000,
      total_orders: 45,
      avg_order_value: 2778,
      low_stock_items: 3,
      unread_alerts: 2,
      active_customers: 12,
    },
    revenue_trend: [
      { date: "2024-01-20", revenue: 8500, order_count: 3 },
      { date: "2024-01-21", revenue: 12000, order_count: 4 },
      { date: "2024-01-22", revenue: 6500, order_count: 2 },
      { date: "2024-01-23", revenue: 15000, order_count: 5 },
      { date: "2024-01-24", revenue: 18500, order_count: 7 },
      { date: "2024-01-25", revenue: 22000, order_count: 8 },
      { date: "2024-01-26", revenue: 25000, order_count: 9 },
    ],
    top_supplies: [
      {
        id: "1",
        name: "Nitrogen Fertilizer",
        category: "fertilizers",
        total_sold: 2500,
        total_revenue: 45000,
      },
      {
        id: "2",
        name: "Premium Corn Seeds",
        category: "seeds",
        total_sold: 500,
        total_revenue: 38000,
      },
      {
        id: "3",
        name: "Organic Pesticide Pro",
        category: "pesticides",
        total_sold: 150,
        total_revenue: 22000,
      },
    ],
    recent_activities: [
      {
        id: "1",
        order_number: "ORD-2024-001",
        status: "completed",
        total_amount: 8500,
        created_at: "2024-01-26T10:30:00Z",
        customer_name: "Green Valley Farms",
      },
      {
        id: "2",
        order_number: "ORD-2024-002",
        status: "pending",
        total_amount: 12000,
        created_at: "2024-01-26T09:15:00Z",
        customer_name: "Sunrise Agriculture",
      },
      {
        id: "3",
        order_number: "ORD-2024-003",
        status: "completed",
        total_amount: 6500,
        created_at: "2024-01-25T16:20:00Z",
        customer_name: "Prairie Harvest Co",
      },
    ],
    alerts: [
      {
        id: "1",
        title: "Low Stock Alert",
        message: "Nitrogen Fertilizer running low",
        severity: "high",
        created_at: "2024-01-26T08:30:00Z",
      },
      {
        id: "2",
        title: "Market Alert",
        message: "Corn price increase detected",
        severity: "medium",
        created_at: "2024-01-25T14:20:00Z",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F7FCFA] flex">
      {/* Sidebar */}
      <aside className="w-80 bg-[#F7FCFA] border-r border-[#E5E8EB] p-6 overflow-y-auto">
        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-[#0D1C17] text-xl font-bold font-['Lexend'] mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full h-10 px-4 bg-[#009963] rounded-2xl flex items-center justify-center transition-colors hover:bg-[#008055]">
              <span className="text-[#F7FCFA] text-sm font-bold font-['Lexend']">
                New Purchase Order
              </span>
            </button>
            <button className="w-full h-10 px-4 bg-[#E5F5F0] rounded-2xl flex items-center justify-center transition-colors hover:bg-[#CCE8DE]">
              <span className="text-[#0D1C17] text-sm font-bold font-['Lexend']">
                View Inventory
              </span>
            </button>
            <button className="w-full h-10 px-4 bg-[#E5F5F0] rounded-2xl flex items-center justify-center transition-colors hover:bg-[#CCE8DE]">
              <span className="text-[#0D1C17] text-sm font-bold font-['Lexend']">
                Market Analysis
              </span>
            </button>
          </div>
        </section>

        {/* Alerts */}
        <section>
          <h2 className="text-[#0D1C17] text-xl font-bold font-['Lexend'] mb-4">
            Alerts
            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
              {demoData.metrics.unread_alerts}
            </span>
          </h2>
          <div className="space-y-3">
            {demoData.alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center gap-4 p-2 bg-[#F7FCFA] rounded-lg"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    alert.severity === "high" ? "bg-orange-100" : "bg-[#E5F5F0]"
                  }`}
                >
                  <Bell
                    className={`w-6 h-6 ${
                      alert.severity === "high"
                        ? "text-orange-600"
                        : "text-[#0D1C17]"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#0D1C17] text-sm font-medium font-['Lexend']">
                    {alert.title}
                  </h3>
                  <p className="text-[#45A180] text-xs font-['Lexend']">
                    {alert.message}
                  </p>
                </div>
                <span className="text-[#45A180] text-xs font-['Lexend']">
                  {new Date(alert.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-[#E5E8EB] px-10 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-[#0D1C17] text-lg font-bold font-['Lexend']">
                AgriSupply Insights
              </h1>
              <nav className="flex items-center gap-9">
                <Link
                  to="/"
                  className="text-[#009963] text-sm font-bold font-['Lexend']"
                >
                  Dashboard
                </Link>
                <Link
                  to="/supplies"
                  className="text-[#0D1C17] text-sm font-normal font-['Lexend'] hover:text-[#45A180]"
                >
                  Supply Details
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center bg-[#E5F5F0] rounded-xl overflow-hidden">
                <div className="pl-4 pr-2 flex items-center">
                  <Search className="w-6 h-6 text-[#45A180]" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent px-2 py-2 text-[#45A180] placeholder-[#45A180] text-base font-['Lexend'] outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#45A180] rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 px-6 py-5">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="px-4 py-4">
              <h2 className="text-[#0D1C17] text-2xl font-bold font-['Lexend'] mb-3">
                Dashboard Overview
              </h2>
              <p className="text-[#45A180] text-sm font-['Lexend']">
                AI-driven insights for optimal supply purchasing
              </p>
            </div>

            {/* Key Metrics */}
            <section>
              <h3 className="text-[#0D1C17] text-xl font-bold font-['Lexend'] mb-4 px-4">
                Key Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
                <div className="bg-[#E5F5F0] rounded-xl p-6">
                  <h4 className="text-[#0D1C17] text-base font-medium font-['Lexend'] mb-2">
                    Total Revenue
                  </h4>
                  <p className="text-[#0D1C17] text-2xl font-bold font-['Lexend'] mb-1">
                    ${demoData.metrics.total_revenue.toLocaleString()}
                  </p>
                  <span className="text-[#08872E] text-base font-medium font-['Lexend']">
                    {demoData.metrics.total_orders} orders
                  </span>
                </div>
                <div className="bg-[#E5F5F0] rounded-xl p-6">
                  <h4 className="text-[#0D1C17] text-base font-medium font-['Lexend'] mb-2">
                    Average Order Value
                  </h4>
                  <p className="text-[#0D1C17] text-2xl font-bold font-['Lexend'] mb-1">
                    ${demoData.metrics.avg_order_value.toLocaleString()}
                  </p>
                  <span className="text-[#45A180] text-base font-medium font-['Lexend']">
                    {demoData.metrics.active_customers} active customers
                  </span>
                </div>
                <div className="bg-[#E5F5F0] rounded-xl p-6">
                  <h4 className="text-[#0D1C17] text-base font-medium font-['Lexend'] mb-2">
                    Low Stock Alerts
                  </h4>
                  <p className="text-[#0D1C17] text-2xl font-bold font-['Lexend'] mb-1">
                    {demoData.metrics.low_stock_items}
                  </p>
                  <span className="text-[#E82E08] text-base font-medium font-['Lexend']">
                    {demoData.metrics.unread_alerts} unread alerts
                  </span>
                </div>
              </div>
            </section>

            {/* Top Selling Supplies */}
            <section>
              <h3 className="text-[#0D1C17] text-xl font-bold font-['Lexend'] mb-4 px-4">
                Top Selling Supplies
              </h3>
              <div className="px-4">
                <div className="bg-[#F7FCFA] border border-[#CCE8DE] rounded-xl overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 p-4 bg-[#F7FCFA] border-b border-[#E5E8EB]">
                    <span className="text-[#0D1C17] text-sm font-medium font-['Lexend']">
                      Product
                    </span>
                    <span className="text-[#0D1C17] text-sm font-medium font-['Lexend']">
                      Category
                    </span>
                    <span className="text-[#0D1C17] text-sm font-medium font-['Lexend']">
                      Total Sold
                    </span>
                    <span className="text-[#0D1C17] text-sm font-medium font-['Lexend']">
                      Revenue
                    </span>
                  </div>
                  {demoData.top_supplies.map((supply, index) => (
                    <div
                      key={supply.id}
                      className={`grid grid-cols-4 gap-4 p-4 ${index < 2 ? "border-b border-[#E5E8EB]" : ""}`}
                    >
                      <span className="text-[#0D1C17] text-sm font-['Lexend']">
                        {supply.name}
                      </span>
                      <span className="text-[#45A180] text-sm font-['Lexend'] capitalize">
                        {supply.category}
                      </span>
                      <span className="text-[#45A180] text-sm font-['Lexend']">
                        {supply.total_sold.toLocaleString()} units
                      </span>
                      <span className="text-[#45A180] text-sm font-['Lexend']">
                        ${supply.total_revenue.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Business Analytics */}
            <section>
              <h3 className="text-[#0D1C17] text-xl font-bold font-['Lexend'] mb-4 px-4">
                Business Analytics
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4">
                <div className="bg-white border border-[#CCE8DE] rounded-xl p-6">
                  <h4 className="text-[#0D1C17] text-base font-medium font-['Lexend'] mb-2">
                    Revenue Trend
                  </h4>
                  <p className="text-[#0D1C17] text-2xl font-bold font-['Lexend'] mb-1">
                    ${demoData.metrics.total_revenue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    <span className="text-[#45A180] text-base font-['Lexend']">
                      Total Revenue
                    </span>
                    <span className="text-[#08872E] text-base font-medium font-['Lexend']">
                      {demoData.metrics.total_orders} orders
                    </span>
                  </div>
                  <div className="h-32 bg-[#E5F5F0] rounded-lg flex items-end justify-between px-2 pb-4">
                    {demoData.revenue_trend.map((trend, index) => {
                      const maxRevenue = Math.max(
                        ...demoData.revenue_trend.map((t) => t.revenue),
                      );
                      const height = (trend.revenue / maxRevenue) * 100;
                      return (
                        <div
                          key={index}
                          className="w-6 bg-[#45A180] rounded-t"
                          style={{ height: `${height}%` }}
                          title={`${new Date(trend.date).toLocaleDateString()}: $${trend.revenue.toLocaleString()}`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-[#45A180] font-bold font-['Lexend']">
                    {demoData.revenue_trend.map((trend, index) => (
                      <span key={index}>{new Date(trend.date).getDate()}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-[#CCE8DE] rounded-xl p-6">
                  <h4 className="text-[#0D1C17] text-base font-medium font-['Lexend'] mb-2">
                    Recent Activities
                  </h4>
                  <div className="space-y-2">
                    {demoData.recent_activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex-1">
                          <p className="text-[#0D1C17] text-sm font-medium font-['Lexend']">
                            Order #{activity.order_number}
                          </p>
                          <p className="text-[#45A180] text-xs font-['Lexend']">
                            {activity.customer_name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#0D1C17] text-sm font-bold font-['Lexend']">
                            ${activity.total_amount.toLocaleString()}
                          </p>
                          <p
                            className={`text-xs font-['Lexend'] capitalize ${
                              activity.status === "completed"
                                ? "text-[#08872E]"
                                : activity.status === "pending"
                                  ? "text-[#FF8F00]"
                                  : "text-[#45A180]"
                            }`}
                          >
                            {activity.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
