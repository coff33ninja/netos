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
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/services/api";

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
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [thresholds, setThresholds] = useState({
        cpu: 80,
        memory: 80,
        disk: 90,
        network: 70
    });
    const { toast } = useToast();

    const handleTestConnection = async (nodeId: string) => {
        try {
            const result = await api.testNodeConnection(nodeId);
            toast({
                title: result.success ? "Connection Successful" : "Connection Failed",
                description: result.success
                    ? `Latency: ${result.latency}ms`
                    : result.error,
                variant: result.success ? "default" : "destructive",
            });
        } catch (error) {
            toast({
                title: "Test Failed",
                description: "Could not complete connection test",
                variant: "destructive",
            });
        }
    };

    const handleConfigSave = async (nodeId: string) => {
        try {
            await api.updateNodeConfig(nodeId, {
                alertThresholds: thresholds,
                enabled: true,
            });
            setIsConfigOpen(false);
            toast({
                title: "Success",
                description: "Node configuration updated",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update configuration",
                variant: "destructive",
            });
        }
    };

    const renderConfigDialog = () => (
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Node Configuration</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>CPU Threshold (%)</Label>
                        <Slider
                            value={[thresholds.cpu]}
                            onValueChange={(value) => setThresholds(prev => ({ ...prev, cpu: value[0] }))}
                            max={100}
                            step={1}
                        />
                        <span className="text-sm text-muted-foreground">{thresholds.cpu}%</span>
                    </div>
                    <div className="space-y-2">
                        <Label>Memory Threshold (%)</Label>
                        <Slider
                            value={[thresholds.memory]}
                            onValueChange={(value) => setThresholds(prev => ({ ...prev, memory: value[0] }))}
                            max={100}
                            step={1}
                        />
                        <span className="text-sm text-muted-foreground">{thresholds.memory}%</span>
                    </div>
                    <div className="space-y-2">
                        <Label>Disk Threshold (%)</Label>
                        <Slider
                            value={[thresholds.disk]}
                            onValueChange={(value) => setThresholds(prev => ({ ...prev, disk: value[0] }))}
                            max={100}
                            step={1}
                        />
                        <span className="text-sm text-muted-foreground">{thresholds.disk}%</span>
                    </div>
                    <div className="space-y-2">
                        <Label>Network Threshold (%)</Label>
                        <Slider
                            value={[thresholds.network]}
                            onValueChange={(value) => setThresholds(prev => ({ ...prev, network: value[0] }))}
                            max={100}
                            step={1}
                        />
                        <span className="text-sm text-muted-foreground">{thresholds.network}%</span>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => selectedNode && handleConfigSave(selectedNode.id)}>
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );

    const handleConfigureClick = (node: Node) => {
        setSelectedNode(node);
        setIsConfigOpen(true);
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
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="flex-1"
                                        onClick={() => handleTestConnection(node.id)}
                                    >
                                        <Activity className="h-4 w-4 mr-2" />
                                        Test
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="flex-1"
                                        onClick={() => handleConfigureClick(node)}
                                    >
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

            {renderConfigDialog()}
        </div>
    );
};

export default Nodes;
