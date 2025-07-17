import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Bell } from "lucide-react";

export default function SupplyDetails() {
  const [searchQuery, setSearchQuery] = useState("");

  // Static demo data
  const demoData = {
    supplies: [
      {
        id: "1",
        name: "Nitrogen Fertilizer",
        description:
          "High-quality nitrogen fertilizer for enhanced crop growth and soil nutrition",
        category: "fertilizers",
        sku: "FERT-N-001",
        unit: "lbs",
        current_stock: 2500,
        reorder_level: 500,
        cost_per_unit: 18.5,
        supplier_name: "AgriChem Solutions",
        stock_status: "good",
        last_updated: "2024-01-26",
      },
      {
        id: "2",
        name: "Premium Corn Seeds",
        description:
          "High-yield corn seeds genetically optimized for maximum harvest output",
        category: "seeds",
        sku: "SEED-CORN-001",
        unit: "bags",
        current_stock: 150,
        reorder_level: 50,
        cost_per_unit: 75.0,
        supplier_name: "SeedCo Genetics",
        stock_status: "good",
        last_updated: "2024-01-25",
      },
      {
        id: "3",
        name: "Organic Pesticide Pro",
        description:
          "Eco-friendly pesticide solution for sustainable crop protection",
        category: "pesticides",
        sku: "PEST-ORG-001",
        unit: "gallons",
        current_stock: 45,
        reorder_level: 25,
        cost_per_unit: 145.0,
        supplier_name: "EcoGuard Agricultural",
        stock_status: "medium",
        last_updated: "2024-01-24",
      },
      {
        id: "4",
        name: "Potassium Fertilizer",
        description:
          "Essential potassium supplement for healthy plant development",
        category: "fertilizers",
        sku: "FERT-K-001",
        unit: "lbs",
        current_stock: 15,
        reorder_level: 100,
        cost_per_unit: 22.0,
        supplier_name: "AgriChem Solutions",
        stock_status: "low",
        last_updated: "2024-01-23",
      },
      {
        id: "5",
        name: "Wheat Seeds Premium",
        description:
          "Disease-resistant wheat seeds for reliable harvest yields",
        category: "seeds",
        sku: "SEED-WHEAT-001",
        unit: "bags",
        current_stock: 85,
        reorder_level: 30,
        cost_per_unit: 65.0,
        supplier_name: "Heritage Seeds Co",
        stock_status: "good",
        last_updated: "2024-01-22",
      },
    ],
    alerts: [
      {
        id: "1",
        title: "Low Stock Alert",
        message: "Potassium Fertilizer critically low",
        severity: "critical",
        created_at: "2024-01-26T08:30:00Z",
      },
      {
        id: "2",
        title: "Reorder Reminder",
        message: "Organic Pesticide approaching reorder level",
        severity: "medium",
        created_at: "2024-01-25T14:20:00Z",
      },
    ],
    pricing_trend: [
      { month: "Aug", price: 18.2 },
      { month: "Sep", price: 18.0 },
      { month: "Oct", price: 18.3 },
      { month: "Nov", price: 18.1 },
      { month: "Dec", price: 18.4 },
      { month: "Jan", price: 18.5 },
    ],
    demand_forecast: [
      { month: "Feb", demand: 2200 },
      { month: "Mar", demand: 2800 },
      { month: "Apr", demand: 3200 },
      { month: "May", demand: 2900 },
      { month: "Jun", demand: 2600 },
      { month: "Jul", demand: 2400 },
    ],
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "good":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
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
              2
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
                    alert.severity === "critical"
                      ? "bg-red-100"
                      : alert.severity === "high"
                        ? "bg-orange-100"
                        : "bg-[#E5F5F0]"
                  }`}
                >
                  <Bell
                    className={`w-6 h-6 ${
                      alert.severity === "critical"
                        ? "text-red-600"
                        : alert.severity === "high"
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
                  className="text-[#0D1C17] text-sm font-normal font-['Lexend'] hover:text-[#45A180]"
                >
                  Dashboard
                </Link>
                <Link
                  to="/supplies"
                  className="text-[#009963] text-sm font-bold font-['Lexend']"
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

        {/* Supply Details Content */}
        <div className="flex-1 px-6 py-5">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="px-4 py-4">
              <h2 className="text-[#0D1C17] text-2xl font-bold font-['Lexend'] mb-3">
                Supply Details
              </h2>
              <p className="text-[#45A180] text-sm font-['Lexend']">
                Comprehensive inventory management with AI-driven insights
              </p>
            </div>

            {/* Supply Overview */}
            <section>
              <h3 className="text-[#0D1C17] text-xl font-bold font-['Lexend'] mb-4 px-4">
                Current Inventory
              </h3>
              <div className="px-4">
                <div className="bg-[#F7FCFA] border border-[#CCE8DE] rounded-xl overflow-hidden">
                  <div className="grid grid-cols-7 gap-4 p-4 bg-[#F7FCFA] border-b border-[#E5E8EB]">
                    <span className="text-[#0D1C17] text-sm font-medium font-['Lexend']">
                      Supply Name
                    </span>
                    <span className="text-[#0D1C17] text-sm font-medium font-['Lexend']">
                      Category
                    </span>
                    <span className="text-[#0D1C17] text-sm font-medium font-['Lexend']">
                      Current Stock
                    </span>
                    <span className="text-[#0D1C17] text-sm font-medium font-['Lexend']">
                      Unit Price
                    </span>
                    <span className="text-[#0D1C17] text-sm font-medium font-['Lexend']">
                      Supplier
                    </span>
                    <span className="text-[#0D1C17] text-sm font-medium font-['Lexend']">
                      Status
                    </span>
                    <span className="text-[#0D1C17] text-sm font-medium font-['Lexend']">
                      Last Updated
                    </span>
                  </div>

                  {demoData.supplies.map((supply, index) => {
                    const isLast = index === demoData.supplies.length - 1;
                    return (
                      <div
                        key={supply.id}
                        className={`grid grid-cols-7 gap-4 p-4 ${!isLast ? "border-b border-[#E5E8EB]" : ""}`}
                      >
                        <div>
                          <span className="text-[#0D1C17] text-sm font-['Lexend'] block">
                            {supply.name}
                          </span>
                          <span className="text-[#45A180] text-xs font-['Lexend']">
                            {supply.sku}
                          </span>
                        </div>
                        <span className="text-[#45A180] text-sm font-['Lexend'] capitalize">
                          {supply.category}
                        </span>
                        <span className="text-[#45A180] text-sm font-['Lexend']">
                          {supply.current_stock.toLocaleString()} {supply.unit}
                        </span>
                        <span className="text-[#45A180] text-sm font-['Lexend']">
                          ${supply.cost_per_unit.toFixed(2)}/{supply.unit}
                        </span>
                        <span className="text-[#45A180] text-sm font-['Lexend']">
                          {supply.supplier_name}
                        </span>
                        <div className="flex items-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium font-['Lexend'] capitalize ${getStockStatusColor(supply.stock_status)}`}
                          >
                            {supply.stock_status}
                          </span>
                        </div>
                        <span className="text-[#45A180] text-sm font-['Lexend']">
                          {supply.last_updated}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Analytics Section */}
            <section>
              <h3 className="text-[#0D1C17] text-xl font-bold font-['Lexend'] mb-4 px-4">
                Supply Analytics
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4">
                <div className="bg-white border border-[#CCE8DE] rounded-xl p-6">
                  <h4 className="text-[#0D1C17] text-base font-medium font-['Lexend'] mb-2">
                    Pricing Trends (Nitrogen Fertilizer)
                  </h4>
                  <p className="text-[#0D1C17] text-2xl font-bold font-['Lexend'] mb-1">
                    $18.50/lb
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    <span className="text-[#45A180] text-base font-['Lexend']">
                      Last 6 Months
                    </span>
                    <span className="text-[#08872E] text-base font-medium font-['Lexend']">
                      +1.6%
                    </span>
                  </div>
                  <div className="h-32 bg-[#E5F5F0] rounded-lg flex items-end justify-between px-4 pb-4">
                    {demoData.pricing_trend.map((trend, index) => {
                      const maxPrice = Math.max(
                        ...demoData.pricing_trend.map((t) => t.price),
                      );
                      const minPrice = Math.min(
                        ...demoData.pricing_trend.map((t) => t.price),
                      );
                      const height =
                        ((trend.price - minPrice) / (maxPrice - minPrice)) *
                          80 +
                        20;
                      return (
                        <div
                          key={index}
                          className="w-8 bg-[#45A180] rounded-t"
                          style={{ height: `${height}%` }}
                          title={`${trend.month}: $${trend.price}`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-[#45A180] font-bold font-['Lexend']">
                    {demoData.pricing_trend.map((trend, index) => (
                      <span key={index}>{trend.month}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-[#CCE8DE] rounded-xl p-6">
                  <h4 className="text-[#0D1C17] text-base font-medium font-['Lexend'] mb-2">
                    Demand Forecast (Next 6 Months)
                  </h4>
                  <p className="text-[#0D1C17] text-2xl font-bold font-['Lexend'] mb-1">
                    2,850 lbs
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    <span className="text-[#45A180] text-base font-['Lexend']">
                      Average Monthly
                    </span>
                    <span className="text-[#08872E] text-base font-medium font-['Lexend']">
                      +12%
                    </span>
                  </div>
                  <div className="h-32 bg-[#E5F5F0] rounded-lg flex items-end justify-between px-4 pb-4">
                    {demoData.demand_forecast.map((forecast, index) => {
                      const maxDemand = Math.max(
                        ...demoData.demand_forecast.map((f) => f.demand),
                      );
                      const height = (forecast.demand / maxDemand) * 100;
                      return (
                        <div
                          key={index}
                          className="w-8 bg-[#45A180] rounded-t"
                          style={{ height: `${height}%` }}
                          title={`${forecast.month}: ${forecast.demand} lbs`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-[#45A180] font-bold font-['Lexend']">
                    {demoData.demand_forecast.map((forecast, index) => (
                      <span key={index}>{forecast.month}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* AI Insights */}
            <section>
              <h3 className="text-[#0D1C17] text-xl font-bold font-['Lexend'] mb-4 px-4">
                AI-Powered Recommendations
              </h3>
              <div className="px-4">
                <div className="bg-white border border-[#CCE8DE] rounded-xl p-6">
                  <h4 className="text-[#0D1C17] text-base font-bold font-['Lexend'] mb-3">
                    Inventory Optimization Insights
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h5 className="text-sm font-medium text-red-800 font-['Lexend']">
                            Critical Stock Alert
                          </h5>
                          <p className="mt-1 text-sm text-red-700 font-['Lexend']">
                            Potassium Fertilizer is critically low (15 lbs
                            remaining). Recommend immediate reorder of 500 lbs
                            to prevent stockout.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h5 className="text-sm font-medium text-yellow-800 font-['Lexend']">
                            Seasonal Opportunity
                          </h5>
                          <p className="mt-1 text-sm text-yellow-700 font-['Lexend']">
                            Premium Corn Seeds demand typically increases 25% in
                            February. Consider bulk purchase to meet anticipated
                            demand.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h5 className="text-sm font-medium text-green-800 font-['Lexend']">
                            Cost Optimization
                          </h5>
                          <p className="mt-1 text-sm text-green-700 font-['Lexend']">
                            Nitrogen Fertilizer pricing shows stable trend.
                            Optimal purchase window identified for Q2 2024 with
                            projected 3% savings.
                          </p>
                        </div>
                      </div>
                    </div>
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
