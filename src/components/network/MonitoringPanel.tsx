
import { Card, CardContent } from '@/components/ui/card';
import { NetworkScanButton } from './NetworkScanButton';
import { DeviceManagementButton } from './DeviceManagementButton';
import { Activity, Wifi, Server, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MonitoringPanelProps {
    metrics: {
        activeDevices: number;
        networkLoad: number;
        serverStatus: string;
        alerts: number;
    };
    onScanRequest?: (nodeId: string) => void;
}

export const MonitoringPanel = ({ metrics, onScanRequest }: MonitoringPanelProps) => {
    const { toast } = useToast();

    const handleScanClick = async (nodeId: string) => {
        try {
            if (onScanRequest) {
                await onScanRequest(nodeId);
                toast({
                    title: "Scan Initiated",
                    description: "Network scan has been initiated on the node",
                });
            }
        } catch (error) {
            toast({
                title: "Scan Failed",
                description: "Failed to initiate network scan",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end space-x-2 mb-4">
                <DeviceManagementButton />
                <NetworkScanButton onClick={() => handleScanClick('main')} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="flex items-center justify-between p-6">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Active Devices</p>
                            <p className="text-2xl font-bold">{metrics.activeDevices}</p>
                        </div>
                        <Server className="h-6 w-6 text-muted-foreground" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center justify-between p-6">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Network Load</p>
                            <p className="text-2xl font-bold">{metrics.networkLoad}%</p>
                        </div>
                        <Activity className="h-6 w-6 text-muted-foreground" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center justify-between p-6">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Server Status</p>
                            <p className="text-2xl font-bold">{metrics.serverStatus}</p>
                        </div>
                        <Wifi className="h-6 w-6 text-muted-foreground" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center justify-between p-6">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                            <p className="text-2xl font-bold">{metrics.alerts}</p>
                        </div>
                        <AlertTriangle className="h-6 w-6 text-muted-foreground" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
