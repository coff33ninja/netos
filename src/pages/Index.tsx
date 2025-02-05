import { NetworkMap } from "@/components/network/NetworkMap";
import { DeviceList } from "@/components/network/DeviceList";
import { MonitoringPanel } from "@/components/network/MonitoringPanel";
import { HistoricalData } from "@/components/network/HistoricalData";
import { AlertSystem } from "@/components/network/AlertSystem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

const ITEMS_PER_PAGE = 5;

const Index = () => {
  const [currentHistoricalPage, setCurrentHistoricalPage] = useState(1);
  const [currentAlertsPage, setCurrentAlertsPage] = useState(1);
  const [currentDevicesPage, setCurrentDevicesPage] = useState(1);

  const renderPagination = (
    currentPage: number,
    setPage: (page: number) => void,
    totalPages: number
  ) => {
    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setPage(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Network Topology Scanner</h1>
      
      <div className="mb-6">
        <MonitoringPanel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Historical Data</CardTitle>
          </CardHeader>
          <CardContent>
            <HistoricalData currentPage={currentHistoricalPage} itemsPerPage={ITEMS_PER_PAGE} />
            {renderPagination(currentHistoricalPage, setCurrentHistoricalPage, 5)}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alert System</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertSystem currentPage={currentAlertsPage} itemsPerPage={ITEMS_PER_PAGE} />
            {renderPagination(currentAlertsPage, setCurrentAlertsPage, 3)}
          </CardContent>
        </Card>
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
              <DeviceList currentPage={currentDevicesPage} itemsPerPage={ITEMS_PER_PAGE} />
              {renderPagination(currentDevicesPage, setCurrentDevicesPage, 4)}
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