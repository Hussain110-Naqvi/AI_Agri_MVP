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
  Search,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react";

const inventoryData = [
  {
    id: 1,
    name: "Nitrogen Fertilizer 50lb",
    sku: "FERT-N-50",
    category: "Fertilizer",
    currentStock: 45,
    reorderLevel: 50,
    unitCost: 25.5,
    unitPrice: 35.0,
    supplier: "AgriCorp Supplies",
    lastOrdered: "2 weeks ago",
    status: "low",
  },
  {
    id: 2,
    name: "Corn Seeds - Hybrid",
    sku: "SEED-CORN-H1",
    category: "Seeds",
    currentStock: 120,
    reorderLevel: 75,
    unitCost: 45.0,
    unitPrice: 65.0,
    supplier: "AgriCorp Supplies",
    lastOrdered: "1 month ago",
    status: "good",
  },
  {
    id: 3,
    name: "Glyphosate Herbicide",
    sku: "HERB-GLYPH-32",
    category: "Pesticides",
    currentStock: 25,
    reorderLevel: 30,
    unitCost: 18.75,
    unitPrice: 28.5,
    supplier: "AgriCorp Supplies",
    lastOrdered: "3 weeks ago",
    status: "critical",
  },
  {
    id: 4,
    name: "Potassium Fertilizer",
    sku: "FERT-K-40",
    category: "Fertilizer",
    currentStock: 85,
    reorderLevel: 40,
    unitCost: 22.0,
    unitPrice: 32.0,
    supplier: "Farm Equipment Co",
    lastOrdered: "1 week ago",
    status: "good",
  },
  {
    id: 5,
    name: "Soybean Seeds",
    sku: "SEED-SOY-P1",
    category: "Seeds",
    currentStock: 60,
    reorderLevel: 50,
    unitCost: 38.0,
    unitPrice: 52.0,
    supplier: "AgriCorp Supplies",
    lastOrdered: "2 weeks ago",
    status: "good",
  },
];

const inventoryStats = [
  { label: "Total Items", value: 156, icon: Package, color: "bg-blue-500" },
  { label: "Low Stock", value: 8, icon: AlertTriangle, color: "bg-orange-500" },
  { label: "Critical", value: 3, icon: AlertTriangle, color: "bg-red-500" },
  {
    label: "Total Value",
    value: "$47,850",
    icon: TrendingUp,
    color: "bg-green-500",
  },
];

const categories = ["All", "Fertilizer", "Seeds", "Pesticides", "Equipment"];

export default function SupplyDetails() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "good":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "low":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "good":
        return <Package className="w-4 h-4 text-green-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredInventory = inventoryData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <Layout>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#F7FCFA] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1C17] font-['Lexend'] mb-2">
                  Inventory Management
                </h1>
                <p className="text-[#45A180] text-sm sm:text-base font-['Lexend']">
                  Monitor stock levels and manage your agricultural supplies
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" className="text-xs">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Inventory Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {inventoryStats.map((stat, index) => (
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
                      placeholder="Search by name or SKU..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#E5E8EB] rounded-lg text-sm font-['Lexend'] focus:outline-none focus:ring-2 focus:ring-[#45A180] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-[#0D1C17] font-['Lexend'] flex items-center">
                    Category:
                  </span>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="text-xs"
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Status Filter */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-[#0D1C17] font-['Lexend'] flex items-center">
                    Status:
                  </span>
                  {[
                    { id: "all", label: "All" },
                    { id: "critical", label: "Critical" },
                    { id: "low", label: "Low Stock" },
                    { id: "good", label: "Good" },
                  ].map((status) => (
                    <Button
                      key={status.id}
                      variant={
                        selectedStatus === status.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedStatus(status.id)}
                      className="text-xs"
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card className="bg-white border border-[#E5E8EB] shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg font-bold text-[#0D1C17] font-['Lexend']">
                Inventory Items ({filteredInventory.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredInventory.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="w-12 h-12 text-[#45A180] mx-auto mb-4 opacity-50" />
                  <p className="text-[#45A180] font-['Lexend']">
                    No inventory items found
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F7FCFA] border-b border-[#E5E8EB]">
                      <tr>
                        <th className="text-left py-3 px-4 sm:px-6 text-[#45A180] text-sm font-medium font-['Lexend']">
                          Product
                        </th>
                        <th className="text-left py-3 px-4 sm:px-6 text-[#45A180] text-sm font-medium font-['Lexend'] hidden sm:table-cell">
                          SKU
                        </th>
                        <th className="text-left py-3 px-4 sm:px-6 text-[#45A180] text-sm font-medium font-['Lexend']">
                          Stock
                        </th>
                        <th className="text-left py-3 px-4 sm:px-6 text-[#45A180] text-sm font-medium font-['Lexend'] hidden md:table-cell">
                          Unit Price
                        </th>
                        <th className="text-left py-3 px-4 sm:px-6 text-[#45A180] text-sm font-medium font-['Lexend'] hidden lg:table-cell">
                          Supplier
                        </th>
                        <th className="text-left py-3 px-4 sm:px-6 text-[#45A180] text-sm font-medium font-['Lexend']">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 sm:px-6 text-[#45A180] text-sm font-medium font-['Lexend']">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F0F0]">
                      {filteredInventory.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-[#F7FCFA] transition-colors"
                        >
                          <td className="py-3 px-4 sm:px-6">
                            <div>
                              <div className="font-medium text-[#0D1C17] text-sm font-['Lexend']">
                                {item.name}
                              </div>
                              <div className="text-[#45A180] text-xs font-['Lexend']">
                                {item.category}
                              </div>
                              <div className="text-[#45A180] text-xs font-['Lexend'] sm:hidden">
                                SKU: {item.sku}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 sm:px-6 text-[#0D1C17] text-sm font-['Lexend'] hidden sm:table-cell">
                            {item.sku}
                          </td>
                          <td className="py-3 px-4 sm:px-6">
                            <div className="text-[#0D1C17] text-sm font-bold font-['Lexend']">
                              {item.currentStock}
                            </div>
                            <div className="text-[#45A180] text-xs font-['Lexend']">
                              Reorder: {item.reorderLevel}
                            </div>
                          </td>
                          <td className="py-3 px-4 sm:px-6 text-[#0D1C17] text-sm font-bold font-['Lexend'] hidden md:table-cell">
                            ${item.unitPrice}
                          </td>
                          <td className="py-3 px-4 sm:px-6 text-[#0D1C17] text-sm font-['Lexend'] hidden lg:table-cell">
                            {item.supplier}
                          </td>
                          <td className="py-3 px-4 sm:px-6">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(item.status)}
                              <Badge
                                className={`text-xs ${getStatusColor(item.status)}`}
                              >
                                {item.status}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-3 px-4 sm:px-6">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs p-1"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs p-1"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs p-1"
                              >
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
