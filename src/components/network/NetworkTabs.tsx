import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkMap } from "./NetworkMap";
import { DeviceList } from "./DeviceList";
import { Device } from "@/services/api";

interface NetworkTabsProps {
  devices: Device[];
  currentDevicesPage: number;
  setCurrentDevicesPage: (page: number) => void;
  itemsPerPage: number;
  metrics: {
    activeDevices: number;
    networkLoad: number;
    serverStatus: string;
    alerts: number;
  };
  renderPagination: (
    currentPage: number,
    setPage: (page: number) => void,
    totalPages: number
  ) => JSX.Element;
}

export const NetworkTabs = ({
  devices,
  currentDevicesPage,
  setCurrentDevicesPage,
  itemsPerPage,
  metrics,
  renderPagination,
}: NetworkTabsProps) => {
  return (
    <Tabs defaultValue="map" className="space-y-4">
      <TabsList className="w-full justify-start overflow-x-auto flex-nowrap md:justify-center transition-colors duration-200">
        <TabsTrigger 
          value="map" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
        >
          Network Map
        </TabsTrigger>
        <TabsTrigger 
          value="devices"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
        >
          Devices
        </TabsTrigger>
        <TabsTrigger 
          value="monitoring"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
        >
          Details
        </TabsTrigger>
      </TabsList>

      <TabsContent value="map" className="space-y-4 animate-fade-in">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">Network Topology</CardTitle>
          </CardHeader>
          <CardContent>
            <NetworkMap networkDevices={devices} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="devices" className="animate-fade-in">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">Connected Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <DeviceList currentPage={currentDevicesPage} itemsPerPage={itemsPerPage} />
            {renderPagination(currentDevicesPage, setCurrentDevicesPage, 4)}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="monitoring" className="space-y-4 animate-fade-in">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">Network Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-accent/50">
                  <h3 className="text-lg font-medium text-primary mb-2">Network Performance</h3>
                  <p className="text-sm text-muted-foreground">
                    {metrics.activeDevices} active devices with {metrics.networkLoad}% network load
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent/50">
                  <h3 className="text-lg font-medium text-primary mb-2">Historical Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Server Status: {metrics.serverStatus}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};