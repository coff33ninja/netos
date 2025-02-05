
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Server, Activity, Settings, Network, Power, Monitor } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Node } from "@/types/network";

const Nodes = () => {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "1",
      name: "Main Server",
      status: "online",
      lastSeen: "2024-02-20T10:00:00",
      type: "Primary",
      location: "Main Office",
      ipAddress: "192.168.1.100",
      version: "1.0.0",
      metrics: {
        cpu: 45,
        memory: 60,
        disk: 75,
        network: 30
      }
    },
    {
      id: "2",
      name: "Backup Server",
      status: "online",
      lastSeen: "2024-02-20T09:55:00",
      type: "Secondary",
      location: "Branch Office",
      ipAddress: "192.168.1.101",
      version: "1.0.0",
      metrics: {
        cpu: 30,
        memory: 45,
        disk: 60,
        network: 25
      }
    }
  ]);

  const getStatusColor = (status: Node["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return "text-red-500";
    if (value >= 60) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Node Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Node
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Node</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Node Name</Label>
                <Input id="name" placeholder="Enter node name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Node Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select node type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="backup">Backup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ip">IP Address</Label>
                <Input id="ip" placeholder="192.168.1.100" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter location" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Add Node</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node) => (
          <Card key={node.id} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {node.name}
              </CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(node.status)}`}>
                    {node.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm">{node.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">IP Address</span>
                  <span className="text-sm">{node.ipAddress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="text-sm">{node.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Version</span>
                  <span className="text-sm">{node.version}</span>
                </div>

                <div className="pt-4">
                  <div className="text-sm font-medium mb-2">System Metrics</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">CPU</span>
                      <span className={`text-xs font-medium ${getMetricColor(node.metrics?.cpu || 0)}`}>
                        {node.metrics?.cpu}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Memory</span>
                      <span className={`text-xs font-medium ${getMetricColor(node.metrics?.memory || 0)}`}>
                        {node.metrics?.memory}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Disk</span>
                      <span className={`text-xs font-medium ${getMetricColor(node.metrics?.disk || 0)}`}>
                        {node.metrics?.disk}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Network</span>
                      <span className={`text-xs font-medium ${getMetricColor(node.metrics?.network || 0)}`}>
                        {node.metrics?.network}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Activity className="h-4 w-4 mr-2" />
                    Monitor
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Network className="h-4 w-4 mr-2" />
                    Network
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Power className="h-4 w-4 mr-2" />
                    Power
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Monitor className="h-4 w-4 mr-2" />
                    Console
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Nodes;
