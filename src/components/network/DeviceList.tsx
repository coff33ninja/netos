
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Monitor, Settings, Activity, Network, Link2, Computer, Power } from "lucide-react";
import { DeviceInfo } from "@/types/network";
import { getDevices } from "@/utils/database";
import { performScan } from "@/utils/scanner";
import { wakeDevice } from "@/utils/wol";
import { useToast } from "@/components/ui/use-toast";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface DeviceListProps {
  currentPage: number;
  itemsPerPage: number;
}

export const DeviceList = ({ currentPage, itemsPerPage }: DeviceListProps) => {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const loadDevices = async () => {
    try {
      const deviceList = await getDevices();
      setDevices(deviceList);
    } catch (error) {
      console.error('Error loading devices:', error);
      toast({
        title: "Error",
        description: "Failed to load device list",
        variant: "destructive"
      });
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const result = await performScan();
      toast({
        title: "Scan Complete",
        description: `Found ${result.devicesFound} devices in ${result.duration}ms`,
      });
      await loadDevices();
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Failed to complete network scan",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleWakeDevice = async (mac: string | undefined, deviceName: string) => {
    if (!mac) {
      toast({
        title: "Error",
        description: "No MAC address available for this device",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await wakeDevice(mac, deviceName);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to wake device",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDevices = devices.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: DeviceInfo['status']) => {
    switch (status) {
      case "Online":
        return "bg-green-100 text-green-800";
      case "Offline":
        return "bg-red-100 text-red-800";
      case "Warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Connected Devices</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => loadDevices()}
          >
            <Activity className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button 
            onClick={handleScan} 
            disabled={isScanning}
          >
            <Network className="mr-2 h-4 w-4" />
            {isScanning ? "Scanning..." : "Scan Network"}
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Device Info</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Connection</TableHead>
            <TableHead>Monitoring</TableHead>
            <TableHead>Remote Access</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedDevices.map((device) => (
            <TableRow key={device.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{device.name}</span>
                  <span className="text-sm text-muted-foreground">{device.ip}</span>
                  <span className="text-xs text-muted-foreground">{device.manufacturer}</span>
                </div>
              </TableCell>
              <TableCell>
                <HoverCard>
                  <HoverCardTrigger>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                      {device.status}
                    </span>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium">Last Seen: {device.lastSeen}</p>
                      <p className="text-sm">Location: {device.location || 'Unknown'}</p>
                      <p className="text-sm">OS: {device.osVersion || 'Unknown'}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-sm">Ports: {device.ports?.join(", ") || "None"}</span>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Link2 className="h-4 w-4 mr-2" />
                    Port Monitor
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Continuous Ping
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Computer className="h-4 w-4 mr-2" />
                    Service Check
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start" 
                    disabled={device.status === "Offline"}>
                    <Monitor className="h-4 w-4 mr-2" />
                    RDP
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start"
                    disabled={device.status === "Offline"}>
                    <Link2 className="h-4 w-4 mr-2" />
                    AnyDesk/RustDesk
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleWakeDevice(device.mac, device.name)}
                  >
                    <Power className="h-4 w-4 mr-2" />
                    WOL
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
