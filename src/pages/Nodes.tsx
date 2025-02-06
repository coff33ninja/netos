import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/services/api";
import { NodeCard } from "@/components/nodes/NodeCard";
import { ConsoleDialog } from "@/components/nodes/ConsoleDialog";
import { PowerDialog } from "@/components/nodes/PowerDialog";
import { ConfigDialog } from "@/components/nodes/ConfigDialog";

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

    const handleConsoleCommand = (command: string) => {
        setConsoleOutput([...consoleOutput, `> ${command}`, 'Command not found']);
    };

    const handleThresholdChange = (type: keyof typeof thresholds, value: number) => {
        setThresholds(prev => ({ ...prev, [type]: value }));
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
                    <NodeCard
                        key={node.id}
                        node={node}
                        onTestConnection={handleTestConnection}
                        onNetworkInfo={handleNetworkInfo}
                        onPowerAction={() => {
                            setSelectedNode(node);
                            setIsPowerDialogOpen(true);
                        }}
                        onConsole={handleConsole}
                        onRemove={handleRemoveNode}
                    />
                ))}
            </div>

            <PowerDialog
                isOpen={isPowerDialogOpen}
                onOpenChange={setIsPowerDialogOpen}
                onPowerAction={(action) => {
                    if (selectedNode) {
                        handlePowerAction(selectedNode.id, action);
                        setIsPowerDialogOpen(false);
                    }
                }}
            />

            <ConsoleDialog
                isOpen={isConsoleOpen}
                onOpenChange={setIsConsoleOpen}
                selectedNode={selectedNode}
                consoleOutput={consoleOutput}
                onCommand={handleConsoleCommand}
            />

            <ConfigDialog
                isOpen={isConfigOpen}
                onOpenChange={setIsConfigOpen}
                thresholds={thresholds}
                onThresholdChange={handleThresholdChange}
                onSave={() => selectedNode && handleConfigSave(selectedNode.id)}
            />
        </div>
    );
};

export default Nodes;
