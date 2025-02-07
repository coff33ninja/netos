
import { useState, useEffect } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useToast } from "@/hooks/use-toast";
import { MonitoringPanel } from "@/components/network/MonitoringPanel";
import { MainContent } from "@/components/network/MainContent";
import { NetworkTabs } from "@/components/network/NetworkTabs";
import { LoadingState } from "@/components/network/LoadingState";
import { ErrorState } from "@/components/network/ErrorState";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 5;

const Index = () => {
  const [currentHistoricalPage, setCurrentHistoricalPage] = useState(1);
  const [currentAlertsPage, setCurrentAlertsPage] = useState(1);
  const [currentDevicesPage, setCurrentDevicesPage] = useState(1);
  const { devices, currentScan, isLoading, error } = useWebSocket();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState({
    activeDevices: 0,
    networkLoad: 0,
    serverStatus: 'Unknown',
    alerts: 0
  });

  useEffect(() => {
    const updateMetrics = () => {
      const onlineDevices = devices.filter(d => d.status === 'online').length;
      const totalDevices = devices.length;
      const networkLoad = Math.round((onlineDevices / Math.max(totalDevices, 1)) * 100);

      setMetrics({
        activeDevices: onlineDevices,
        networkLoad: networkLoad,
        serverStatus: currentScan?.status === 'completed' ? 'Healthy' : 'Scanning',
        alerts: devices.filter(d => d.status === 'offline').length
      });
    };

    updateMetrics();
  }, [devices, currentScan]);

  const renderPagination = (
    currentPage: number,
    setPage: (page: number) => void,
    totalPages: number
  ) => (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            className={`transition-opacity duration-200 ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
          />
        </PaginationItem>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => setPage(page)}
              isActive={currentPage === page}
              className="transition-colors duration-200"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            className={`transition-opacity duration-200 ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 min-h-screen animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-primary">Network Topology Scanner</h1>
      
      <div className="mb-6 transition-all duration-300">
        <MonitoringPanel metrics={metrics} />
      </div>

      <MainContent
        currentAlertsPage={currentAlertsPage}
        currentHistoricalPage={currentHistoricalPage}
        setCurrentAlertsPage={setCurrentAlertsPage}
        setCurrentHistoricalPage={setCurrentHistoricalPage}
        itemsPerPage={ITEMS_PER_PAGE}
        renderPagination={renderPagination}
      />

      <NetworkTabs
        devices={devices}
        currentDevicesPage={currentDevicesPage}
        setCurrentDevicesPage={setCurrentDevicesPage}
        itemsPerPage={ITEMS_PER_PAGE}
        metrics={metrics}
        renderPagination={renderPagination}
      />
    </div>
  );
};

export default Index;
