import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Server, Activity, Settings, Network, Power, Monitor, Trash2 } from "lucide-react";
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

// Utility functions for status and metric colors
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
    const [isPowerDialogOpen, setIsPowerDialogOpen] = useState(false);
    const [isConsoleOpen, setIsConsoleOpen] = useState(false);
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [thresholds, setThresholds] = useState({
        cpu: 80,
        memory: 80,
        disk: 90,
        network: 70
    });
    const { toast } = useToast();

    // Add Node Handler
    const handleAddNode = (formData: any) => {
        const newNode: Node = {
            id: String(nodes.length + 1),
            name: formData.name,
            status: "offline",
            lastSeen: new Date().toISOString(),
            type: formData.type,
            location: formData.location,
            ipAddress: formData.ipAddress,
            version: "1.0.0",
            metrics: {
                cpu: 0,
                memory: 0,
                disk: 0,
                network: 0
            }
        };
        setNodes([...nodes, newNode]);
        toast({
            title: "Node Added",
            description: `Node ${formData.name} has been added successfully.`
        });
    };

    // Remove Node Handler
    const handleRemoveNode = (nodeId: string) => {
        setNodes(nodes.filter(node => node.id !== nodeId));
        toast({
            title: "Node Removed",
            description: "The node has been removed from the network.",
            variant: "destructive"
        });
    };

    // Test Connection Handler
    const handleTestConnection = async (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;

        toast({
            title: "Testing Connection",
            description: `Testing connection to ${node.name}...`
        });

        // Simulate network delay
        setTimeout(() => {
            const success = Math.random() > 0.3; // 70% success rate
            toast({
                title: success ? "Connection Successful" : "Connection Failed",
                description: success 
                    ? `Successfully connected to ${node.name}. Latency: ${Math.floor(Math.random() * 100)}ms`
                    : `Failed to connect to ${node.name}. Please check network settings.`,
                variant: success ? "default" : "destructive",
            });
        }, 1500);
    };

    // Network Info Handler
    const handleNetworkInfo = (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;

        toast({
            title: "Network Information",
            description: `IP: ${node.ipAddress} | Type: ${node.type} | Status: ${node.status}`,
        });
    };

    // Power Action Handler
    const handlePowerAction = (nodeId: string, action: 'start' | 'stop' | 'restart') => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;

        toast({
            title: "Power Action",
            description: `${action.charAt(0).toUpperCase() + action.slice(1)}ing ${node.name}...`,
        });

        // Simulate power action
        setTimeout(() => {
            setNodes(nodes.map(n => {
                if (n.id === nodeId) {
                    return {
                        ...n,
                        status: action === 'stop' ? 'offline' : 'online'
                    };
                }
                return n;
            }));

            toast({
                title: "Action Complete",
                description: `Successfully ${action}ed ${node.name}`,
            });
        }, 2000);
    };

    // Console Handler
    const handleConsole = (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;

        setSelectedNode(node);
        setConsoleOutput([
            `Connected to ${node.name}`,
            `System Info:`,
            `OS: Linux Linux 5.15.0`,
            `CPU Usage: ${node.metrics.cpu}%`,
            `Memory Usage: ${node.metrics.memory}%`,
            `Disk Usage: ${node.metrics.disk}%`,
            `Type 'help' for available commands`
        ]);
        setIsConsoleOpen(true);
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
                                        onClick={() => handleNetworkInfo(node.id)}
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
                                        onClick={() => setIsPowerDialogOpen(true)}
                                    >
                                        <Power className="h-4 w-4 mr-2" />
                                        Power
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="flex-1"
                                        onClick={() => handleConsole(node.id)}
                                    >
                                        <Monitor className="h-4 w-4 mr-2" />
                                        Console
                                    </Button>
                                </div>

                                <Button 
                                    variant="destructive" 
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => handleRemoveNode(node.id)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove Node
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Power Actions Dialog */}
            <Dialog open={isPowerDialogOpen} onOpenChange={setIsPowerDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Power Actions</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-2">
                        <Button onClick={() => {
                            handlePowerAction(selectedNode?.id || '', 'start');
                            setIsPowerDialogOpen(false);
                        }}>
                            Start
                        </Button>
                        <Button onClick={() => {
                            handlePowerAction(selectedNode?.id || '', 'stop');
                            setIsPowerDialogOpen(false);
                        }}>
                            Stop
                        </Button>
                        <Button onClick={() => {
                            handlePowerAction(selectedNode?.id || '', 'restart');
                            setIsPowerDialogOpen(false);
                        }}>
                            Restart
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Console Dialog */}
            <Dialog open={isConsoleOpen} onOpenChange={setIsConsoleOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Console - {selectedNode?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="bg-black text-green-500 p-4 rounded-md font-mono text-sm h-[300px] overflow-y-auto">
                        {consoleOutput.map((line, index) => (
                            <div key={index}>{line}</div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Enter command..."
                            className="font-mono"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setConsoleOutput([...consoleOutput, `> ${e.currentTarget.value}`, 'Command not found']);
                                    e.currentTarget.value = '';
                                }
                            }}
                        />
                        <Button variant="secondary">Send</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {renderConfigDialog()}
        </div>
    );
};

export default Nodes;
