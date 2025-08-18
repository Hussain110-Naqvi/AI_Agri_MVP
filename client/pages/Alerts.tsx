import React, { useState } from "react";
import Layout from "../components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Settings,
  TrendingUp,
  Package,
  DollarSign,
  X,
  Eye,
  MoreHorizontal,
} from "lucide-react";

const alertsData = [
  {
    id: 1,
    type: "inventory",
    title: "Low Stock Alert",
    message:
      "Nitrogen Fertilizer inventory has dropped below the reorder threshold (50 units remaining)",
    severity: "high",
    time: "2 minutes ago",
    isRead: false,
    category: "Inventory",
    affectedItems: ["Nitrogen Fertilizer 50lb"],
  },
  {
    id: 2,
    type: "price",
    title: "Price Increase Alert",
    message: "Corn seed prices have increased by 8% in the last 24 hours",
    severity: "medium",
    time: "1 hour ago",
    isRead: false,
    category: "Market",
    affectedItems: ["Corn Seeds - Hybrid"],
  },
  {
    id: 3,
    type: "delivery",
    title: "Delayed Delivery",
    message: "Shipment #12345 from AgriCorp Supplies is delayed by 2 days",
    severity: "medium",
    time: "3 hours ago",
    isRead: true,
    category: "Logistics",
    affectedItems: ["Shipment #12345"],
  },
  {
    id: 4,
    type: "weather",
    title: "Weather Advisory",
    message:
      "Heavy rainfall expected in your area may affect field operations this week",
    severity: "low",
    time: "5 hours ago",
    isRead: false,
    category: "Weather",
    affectedItems: [],
  },
  {
    id: 5,
    type: "supplier",
    title: "Supplier Update",
    message:
      "New products available from Farm Equipment Co - Special discount available",
    severity: "low",
    time: "1 day ago",
    isRead: true,
    category: "Supplier",
    affectedItems: ["Farm Equipment Co"],
  },
  {
    id: 6,
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance tonight from 2 AM to 4 AM EST",
    severity: "low",
    time: "1 day ago",
    isRead: false,
    category: "System",
    affectedItems: [],
  },
];

const alertStats = [
  { label: "Total Alerts", value: 24, icon: Bell, color: "bg-blue-500" },
  { label: "Unread", value: 8, icon: AlertTriangle, color: "bg-orange-500" },
  {
    label: "High Priority",
    value: 3,
    icon: AlertTriangle,
    color: "bg-red-500",
  },
  {
    label: "Resolved Today",
    value: 12,
    icon: CheckCircle,
    color: "bg-green-500",
  },
];

export default function Alerts() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [alerts, setAlerts] = useState(alertsData);

  const filters = [
    { id: "all", label: "All Alerts", count: alerts.length },
    {
      id: "unread",
      label: "Unread",
      count: alerts.filter((a) => !a.isRead).length,
    },
    {
      id: "high",
      label: "High Priority",
      count: alerts.filter((a) => a.severity === "high").length,
    },
    {
      id: "inventory",
      label: "Inventory",
      count: alerts.filter((a) => a.category === "Inventory").length,
    },
    {
      id: "market",
      label: "Market",
      count: alerts.filter((a) => a.category === "Market").length,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "inventory":
        return <Package className="w-5 h-5" />;
      case "price":
        return <DollarSign className="w-5 h-5" />;
      case "delivery":
        return <Clock className="w-5 h-5" />;
      case "weather":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const markAsRead = (alertId: number) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert,
      ),
    );
  };

  const deleteAlert = (alertId: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId));
  };

  const filteredAlerts = alerts
    .filter((alert) => {
      if (selectedFilter === "all") return true;
      if (selectedFilter === "unread") return !alert.isRead;
      if (selectedFilter === "high") return alert.severity === "high";
      if (selectedFilter === "inventory") return alert.category === "Inventory";
      if (selectedFilter === "market") return alert.category === "Market";
      return true;
    })
    .filter(
      (alert) =>
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <Layout>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#F7FCFA] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1C17] font-['Lexend'] mb-2">
                  Alerts & Notifications
                </h1>
                <p className="text-[#45A180] text-sm sm:text-base font-['Lexend']">
                  Stay updated with important system alerts and notifications
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </div>

          {/* Alert Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {alertStats.map((stat, index) => (
              <Card
                key={index}
                className="bg-white border border-[#E5E8EB] shadow-sm"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center`}
                    >
                      <stat.icon
                        className={`w-5 h-5 ${stat.color.replace("bg-", "text-")}`}
                      />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-[#0D1C17] font-['Lexend']">
                        {stat.value}
                      </p>
                      <p className="text-[#45A180] text-sm font-['Lexend']">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search and Filters */}
          <Card className="bg-white border border-[#E5E8EB] shadow-sm mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#45A180] w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search alerts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#E5E8EB] rounded-lg text-sm font-['Lexend'] focus:outline-none focus:ring-2 focus:ring-[#45A180] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={
                        selectedFilter === filter.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedFilter(filter.id)}
                      className="text-xs"
                    >
                      {filter.label}
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {filter.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <Card className="bg-white border border-[#E5E8EB] shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg font-bold text-[#0D1C17] font-['Lexend']">
                {selectedFilter === "all"
                  ? "All Alerts"
                  : filters.find((f) => f.id === selectedFilter)?.label ||
                    "Alerts"}
                ({filteredAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredAlerts.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-[#45A180] mx-auto mb-4 opacity-50" />
                  <p className="text-[#45A180] font-['Lexend']">
                    No alerts found
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#F0F0F0]">
                  {filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 sm:p-6 hover:bg-[#F7FCFA] transition-colors ${
                        !alert.isRead
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Alert Icon */}
                        <div
                          className={`w-10 h-10 rounded-lg ${getSeverityColor(alert.severity)} flex items-center justify-center flex-shrink-0`}
                        >
                          {getAlertIcon(alert.type)}
                        </div>

                        {/* Alert Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3
                                className={`text-sm sm:text-base font-bold font-['Lexend'] ${
                                  !alert.isRead
                                    ? "text-[#0D1C17]"
                                    : "text-[#45A180]"
                                }`}
                              >
                                {alert.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className={`text-xs ${getSeverityColor(alert.severity)}`}
                              >
                                {alert.severity}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {alert.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-[#45A180] font-['Lexend']">
                                {alert.time}
                              </span>
                              {!alert.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-[#45A180] font-['Lexend'] mb-3 leading-relaxed">
                            {alert.message}
                          </p>

                          {/* Affected Items */}
                          {alert.affectedItems.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs text-[#45A180] font-['Lexend'] mb-1">
                                Affected Items:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {alert.affectedItems.map((item, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {!alert.isRead && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markAsRead(alert.id)}
                                className="text-xs"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Mark as Read
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteAlert(alert.id)}
                              className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Dismiss
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                            >
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {filteredAlerts.some((alert) => !alert.isRead) && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={() =>
                  setAlerts(alerts.map((alert) => ({ ...alert, isRead: true })))
                }
                className="text-sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All as Read
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
