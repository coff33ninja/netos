
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Server, Activity, Network, Power, Monitor, Trash2 } from "lucide-react";
import { Node } from "@/types/network";

interface NodeCardProps {
    node: Node;
    onTestConnection: (nodeId: string) => void;
    onNetworkInfo: (nodeId: string) => void;
    onPowerAction: () => void;
    onConsole: (nodeId: string) => void;
    onRemove: (nodeId: string) => void;
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'online':
            return 'bg-green-500 text-white';
        case 'offline':
            return 'bg-red-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

const getMetricColor = (value: number) => {
    if (value >= 90) return 'text-red-500';
    if (value >= 75) return 'text-orange-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-green-500';
};

export const NodeCard = ({ 
    node, 
    onTestConnection, 
    onNetworkInfo, 
    onPowerAction, 
    onConsole, 
    onRemove 
}: NodeCardProps) => {
    return (
        <Card className="relative">
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
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => onTestConnection(node.id)}
                        >
                            <Activity className="h-4 w-4 mr-2" />
                            Test
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => onNetworkInfo(node.id)}
                        >
                            <Network className="h-4 w-4 mr-2" />
                            Network
                        </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={onPowerAction}
                        >
                            <Power className="h-4 w-4 mr-2" />
                            Power
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => onConsole(node.id)}
                        >
                            <Monitor className="h-4 w-4 mr-2" />
                            Console
                        </Button>
                    </div>

                    <Button 
                        variant="destructive" 
                        size="sm"
                        className="mt-2"
                        onClick={() => onRemove(node.id)}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Node
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
