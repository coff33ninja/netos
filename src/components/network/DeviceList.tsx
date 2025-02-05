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

export const DeviceList = () => {
  // Sample data - replace with actual device data
  const devices = [
    {
      id: 1,
      name: "Main Router",
      ip: "192.168.1.1",
      type: "Router",
      status: "Online",
      ports: ["80", "443", "22"],
    },
    {
      id: 2,
      name: "File Server",
      ip: "192.168.1.100",
      type: "Server",
      status: "Online",
      ports: ["22", "445", "3389"],
    },
  ];

  return (
    <div className="space-y-4">
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
              <TableCell>{device.ports.join(", ")}</TableCell>
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