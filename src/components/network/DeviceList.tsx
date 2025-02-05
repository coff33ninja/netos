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
import { Power, Monitor, Settings } from "lucide-react";
import { DeviceInfo } from "@/types/network";
import { getDevices } from "@/utils/database";
import { performScan } from "@/utils/scanner";
import { useToast } from "@/components/ui/use-toast";

export const DeviceList = () => {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const loadDevices = () => {
    try {
      const deviceList = getDevices();
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
      loadDevices(); // Reload device list after scan
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

  useEffect(() => {
    loadDevices();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Connected Devices</h2>
        <Button 
          onClick={handleScan} 
          disabled={isScanning}
        >
          {isScanning ? "Scanning..." : "Scan Network"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Open Ports</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device.id}>
              <TableCell className="font-medium">{device.name}</TableCell>
              <TableCell>{device.ip}</TableCell>
              <TableCell>{device.type}</TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {device.status}
                </span>
              </TableCell>
              <TableCell>{device.ports?.join(", ")}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" title="Wake-on-LAN">
                    <Power className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" title="Monitor">
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" title="Settings">
                    <Settings className="h-4 w-4" />
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