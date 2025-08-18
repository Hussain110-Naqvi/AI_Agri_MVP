import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Progress } from "../components/ui/progress";
import {
  RefreshCw,
  Database,
  CheckCircle,
  AlertTriangle,
  Clock,
  Play,
  Square,
  Activity,
  BarChart3,
  Users,
  Package,
  TrendingUp,
  Truck,
} from "lucide-react";

interface SyncStatus {
  isRunning: boolean;
  lastSyncTime: string | null;
  stats: {
    totalRecords: number;
    successfulUpserts: number;
    errors: number;
    duplicatesSkipped: number;
  };
  recentErrors: Array<{
    table: string;
    error: string;
    timestamp: string;
  }>;
}

interface HealthStatus {
  bigQuery: boolean;
  supabase: boolean;
  overall: boolean;
  timestamp: string;
}

const DataSync: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const tables = [
    {
      id: "inventory_data",
      name: "Inventory Data",
      description: "Product inventory and stock levels",
      icon: Package,
      targetTable: "inventory",
    },
    {
      id: "sales_transactions",
      name: "Sales Transactions",
      description: "Customer purchase transactions",
      icon: BarChart3,
      targetTable: "purchase_transactions",
    },
    {
      id: "market_prices",
      name: "Market Prices",
      description: "Commodity prices and market data",
      icon: TrendingUp,
      targetTable: "market_data",
    },
    {
      id: "customer_profiles",
      name: "Customer Profiles",
      description: "Customer information and segments",
      icon: Users,
      targetTable: "customers",
    },
    {
      id: "supplier_data",
      name: "Supplier Data",
      description: "Supplier contacts and information",
      icon: Truck,
      targetTable: "suppliers",
    },
  ];

  useEffect(() => {
    loadStatus();
    loadHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (!isSyncing) {
        loadStatus();
        loadHealth();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isSyncing]);

  const loadStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/data-sync/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSyncStatus(data.data);
        setIsSyncing(data.data.isRunning);
      }
    } catch (error) {
      console.error("Failed to load sync status:", error);
    }
  };

  const loadHealth = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/data-sync/health", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHealthStatus(data.data);
      }
    } catch (error) {
      console.error("Failed to load health status:", error);
    }
  };

  const startFullSync = async () => {
    setIsLoading(true);
    setError(null);
    setIsSyncing(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/data-sync/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          options: {
            incrementalSync: false,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSyncStatus((prev) => ({
          ...prev!,
          stats: data.data.stats,
          lastSyncTime: new Date().toISOString(),
        }));
        await loadStatus();
      } else {
        setError(data.message || "Sync failed");
      }
    } catch (error) {
      setError("Failed to start sync");
      console.error("Sync error:", error);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  const syncTable = async (tableName: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedTable(tableName);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/data-sync/table", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tableName,
          options: {},
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await loadStatus();
      } else {
        setError(data.message || `Failed to sync ${tableName}`);
      }
    } catch (error) {
      setError(`Failed to sync ${tableName}`);
      console.error("Table sync error:", error);
    } finally {
      setIsLoading(false);
      setSelectedTable(null);
    }
  };

  const getSuccessRate = () => {
    if (!syncStatus?.stats || syncStatus.stats.totalRecords === 0) return 0;
    return (
      (syncStatus.stats.successfulUpserts / syncStatus.stats.totalRecords) *
      100
    );
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "Never";
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Sync</h1>
          <p className="text-gray-600">
            Sync data from BigQuery to Supabase database
          </p>
        </div>
        <Button
          onClick={loadStatus}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BigQuery</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {healthStatus?.bigQuery ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <span className="text-lg font-semibold">
                {healthStatus?.bigQuery ? "Connected" : "Disconnected"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Source data connection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supabase</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {healthStatus?.supabase ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <span className="text-lg font-semibold">
                {healthStatus?.supabase ? "Connected" : "Disconnected"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Target database connection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {healthStatus?.overall ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <span className="text-lg font-semibold">
                {healthStatus?.overall ? "Healthy" : "Issues Detected"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              System ready for sync
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sync Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5" />
            <span>Sync Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Full Data Sync</h3>
              <p className="text-sm text-gray-600">
                Sync all data from BigQuery to Supabase
              </p>
              {syncStatus?.lastSyncTime && (
                <p className="text-xs text-gray-500 mt-1">
                  Last sync: {formatTimestamp(syncStatus.lastSyncTime)}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {isSyncing && (
                <Badge variant="secondary" className="animate-pulse">
                  <Clock className="h-3 w-3 mr-1" />
                  Syncing...
                </Badge>
              )}
              <Button
                onClick={startFullSync}
                disabled={
                  isLoading || isSyncing || !healthStatus?.overall
                }
                size="lg"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Start Full Sync
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sync Statistics */}
      {syncStatus?.stats && (
        <Card>
          <CardHeader>
            <CardTitle>Sync Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {syncStatus.stats.totalRecords.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Records</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {syncStatus.stats.successfulUpserts.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {syncStatus.stats.errors.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Errors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {getSuccessRate().toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{getSuccessRate().toFixed(1)}%</span>
              </div>
              <Progress value={getSuccessRate()} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Table Sync */}
      <Card>
        <CardHeader>
          <CardTitle>Table-Specific Sync</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table) => {
              const Icon = table.icon;
              const isSelected = selectedTable === table.id;
              
              return (
                <div
                  key={table.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Icon className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">{table.name}</h3>
                      <p className="text-sm text-gray-600">
                        {table.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      → {table.targetTable}
                    </Badge>
                    <Button
                      onClick={() => syncTable(table.id)}
                      disabled={
                        isLoading || 
                        isSyncing || 
                        !healthStatus?.overall ||
                        isSelected
                      }
                      size="sm"
                    >
                      {isSelected ? (
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3 mr-1" />
                      )}
                      Sync
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Errors */}
      {syncStatus?.recentErrors && syncStatus.recentErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Recent Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {syncStatus.recentErrors.slice(0, 5).map((error, index) => (
                <Alert key={index} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{error.table}:</strong> {error.error}
                    <br />
                    <span className="text-xs opacity-80">
                      {formatTimestamp(error.timestamp)}
                    </span>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataSync;
