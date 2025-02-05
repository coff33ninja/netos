import { NetworkMap } from "@/components/network/NetworkMap";
import { DeviceList } from "@/components/network/DeviceList";
import { MonitoringPanel } from "@/components/network/MonitoringPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Network Topology Scanner</h1>
      
      {/* Monitoring Panel */}
      <div className="mb-6">
        <MonitoringPanel />
      </div>

      <Tabs defaultValue="map" className="space-y-4">
        <TabsList>
          <TabsTrigger value="map">Network Map</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="monitoring">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Topology</CardTitle>
            </CardHeader>
            <CardContent>
              <NetworkMap />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Connected Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <DeviceList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium">Network Performance</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed network statistics and performance metrics will be displayed here.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Historical Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Historical network data and trends will be shown here.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;