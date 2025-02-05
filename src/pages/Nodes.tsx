
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Server, Activity, Settings } from "lucide-react";
import { useState } from "react";

type Node = {
  id: string;
  name: string;
  status: "online" | "offline" | "warning";
  lastSeen: string;
  type: string;
};

const Nodes = () => {
  const [nodes] = useState<Node[]>([
    {
      id: "1",
      name: "Main Server",
      status: "online",
      lastSeen: "2024-02-20T10:00:00",
      type: "Primary"
    },
    {
      id: "2",
      name: "Backup Server",
      status: "online",
      lastSeen: "2024-02-20T09:55:00",
      type: "Secondary"
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Node Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Node
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node) => (
          <Card key={node.id}>
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
                  <span className="text-sm text-muted-foreground">Last Seen</span>
                  <span className="text-sm">
                    {new Date(node.lastSeen).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    <Activity className="h-4 w-4 mr-2" />
                    Monitor
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
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
