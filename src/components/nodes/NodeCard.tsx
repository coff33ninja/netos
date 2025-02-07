import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NodeConfig } from "@/types/network";
import { NodeActions } from "./NodeActions";
import { DeviceList } from "./DeviceList";

interface NodeCardProps {
    node: NodeConfig;
    onEdit: (node: NodeConfig) => void;
    onDelete: (node: NodeConfig) => void;
    onConsole: (node: NodeConfig) => void;
    onNetworkInfo: (node: NodeConfig) => void;
    onPowerAction: (node: NodeConfig) => void;
    onTestConnection: (node: NodeConfig) => void;
}

export function NodeCard({
    node,
    onEdit,
    onDelete,
    onConsole,
    onNetworkInfo,
    onPowerAction,
    onTestConnection,
}: NodeCardProps) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "online":
                return "bg-green-500";
            case "offline":
                return "bg-red-500";
            case "maintenance":
                return "bg-yellow-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">{node.name}</CardTitle>
                <NodeActions
                    node={node}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onConsole={onConsole}
                    onNetworkInfo={onNetworkInfo}
                    onPowerAction={onPowerAction}
                    onTestConnection={onTestConnection}
                />
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <Badge variant="outline">{node.type}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <div className="flex items-center space-x-2">
                            <div
                                className={`h-2 w-2 rounded-full ${getStatusColor(
                                    node.status
                                )}`}
                            />
                            <span className="text-sm font-medium">
                                {node.status}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            Location
                        </span>
                        <span className="text-sm">{node.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Port</span>
                        <span className="text-sm">{node.port}</span>
                    </div>
                    {node.type !== "Primary" && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Primary Node
                            </span>
                            <span className="text-sm truncate max-w-[200px]">
                                {node.primaryNodeUrl}
                            </span>
                        </div>
                    )}
                    {node.devices && node.devices.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold mb-2">
                                Managed Devices
                            </h4>
                            <DeviceList devices={node.devices} />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}