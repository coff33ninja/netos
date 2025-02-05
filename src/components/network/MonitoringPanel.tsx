import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NetworkScanButton } from './NetworkScanButton';
import { Activity, Wifi, Server, AlertTriangle } from 'lucide-react';

export const MonitoringPanel = () => {
    const [metrics] = useState({
        activeDevices: 12,
        networkLoad: 45,
        serverStatus: 'Healthy',
        alerts: 2
    });

    return (
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
            <div className="lg:col-span-4">
                <NetworkScanButton />
            </div>
        </div>
    );
};