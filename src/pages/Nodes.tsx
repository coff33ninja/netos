
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { NodeCard } from "@/components/nodes/NodeCard";
import { DeployNodeDialog } from "@/components/nodes/DeployNodeDialog";
import { EditNodeDialog } from "@/components/nodes/EditNodeDialog";
import { NodeConfig } from "@/types/network";

export default function NodesPage() {
    const { toast } = useToast();
    const [showDeployDialog, setShowDeployDialog] = useState(false);
    const [editNode, setEditNode] = useState<NodeConfig | null>(null);
    const [nodes, setNodes] = useState<NodeConfig[]>([
        {
            id: "1",
            name: "Primary Node",
            type: "Primary",
            status: "online",
            location: "Data Center 1",
            port: 3001,
            devices: [
                { 
                    id: "d1", 
                    name: "Device 1", 
                    type: "Sensor", 
                    status: "online",
                    ip: "192.168.1.10",
                    mac: "00:11:22:33:44:55",
                    manufacturer: "Generic",
                    lastSeen: new Date().toISOString(),
                    firstSeen: new Date().toISOString()
                },
                { 
                    id: "d2", 
                    name: "Device 2", 
                    type: "Controller", 
                    status: "online",
                    ip: "192.168.1.11",
                    mac: "00:11:22:33:44:56",
                    manufacturer: "Generic",
                    lastSeen: new Date().toISOString(),
                    firstSeen: new Date().toISOString()
                },
            ],
        },
        {
            id: "2",
            name: "Secondary Node 1",
            type: "Secondary",
            status: "online",
            location: "Branch Office",
            port: 3002,
            primaryNodeUrl: "https://primary:3001",
            devices: [
                { 
                    id: "d3", 
                    name: "Device 3", 
                    type: "Sensor", 
                    status: "offline",
                    ip: "192.168.2.10",
                    mac: "00:11:22:33:44:57",
                    manufacturer: "Generic",
                    lastSeen: new Date().toISOString(),
                    firstSeen: new Date().toISOString()
                },
            ],
        },
    ]);

    const handleEdit = (node: NodeConfig) => {
        setEditNode(node);
    };

    const handleDelete = async (node: NodeConfig) => {
        try {
            // Here you would typically make an API call to delete the node
            // await deleteNode(node.id);
            
            setNodes(nodes.filter((n) => n.id !== node.id));
            toast({
                title: "Node Deleted",
                description: `${node.name} has been deleted successfully.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete the node. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleSaveEdit = async (updatedNode: NodeConfig) => {
        try {
            // Here you would typically make an API call to update the node
            // await updateNode(updatedNode);
            
            setNodes(nodes.map((node) => 
                node.id === updatedNode.id ? updatedNode : node
            ));
            toast({
                title: "Node Updated",
                description: `${updatedNode.name} has been updated successfully.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update the node. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleConsole = (node: NodeConfig) => {
        // Implement console access logic
        toast({
            title: "Console Access",
            description: `Opening console for ${node.name}...`,
        });
    };

    const handleNetworkInfo = (node: NodeConfig) => {
        // Implement network info display logic
        toast({
            title: "Network Information",
            description: `Fetching network info for ${node.name}...`,
        });
    };

    const handlePowerAction = (node: NodeConfig) => {
        // Implement power actions logic
        toast({
            title: "Power Actions",
            description: `Opening power actions for ${node.name}...`,
        });
    };

    const handleTestConnection = async (node: NodeConfig) => {
        try {
            // Here you would typically make an API call to test the connection
            // await testNodeConnection(node.id);
            
            toast({
                title: "Connection Test",
                description: `Successfully connected to ${node.name}.`,
            });
        } catch (error) {
            toast({
                title: "Connection Failed",
                description: `Failed to connect to ${node.name}. Please check the node's status.`,
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Nodes</h1>
                <Button onClick={() => setShowDeployDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Deploy New Node
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nodes.map((node) => (
                    <NodeCard
                        key={node.id}
                        node={node}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onConsole={handleConsole}
                        onNetworkInfo={handleNetworkInfo}
                        onPowerAction={handlePowerAction}
                        onTestConnection={handleTestConnection}
                    />
                ))}
            </div>

            <DeployNodeDialog
                isOpen={showDeployDialog}
                onOpenChange={setShowDeployDialog}
            />

            <EditNodeDialog
                node={editNode}
                isOpen={!!editNode}
                onOpenChange={(open) => !open && setEditNode(null)}
                onSave={handleSaveEdit}
            />
        </div>
    );
}
