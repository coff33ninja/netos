import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Wifi, Clock, AlertTriangle } from "lucide-react";

export const MonitoringPanel = () => {
  // Sample monitoring data - replace with actual data
  const monitoringData = {
    activeDevices: 15,
    networkSpeed: "1 Gbps",
    lastScan: "2 minutes ago",
    alerts: 2,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monitoringData.activeDevices}</div>
          <p className="text-xs text-muted-foreground">
            Devices currently online
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Network Speed</CardTitle>
          <Wifi className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monitoringData.networkSpeed}</div>
          <p className="text-xs text-muted-foreground">
            Current network speed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Scan</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monitoringData.lastScan}</div>
          <p className="text-xs text-muted-foreground">
            Time since last scan
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">{monitoringData.alerts}</div>
            <Badge variant="destructive">New</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Requires attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
};