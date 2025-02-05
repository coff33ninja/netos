import { useState, useEffect } from 'react';
import { api, Device } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw } from 'lucide-react';

interface DeviceListProps {
    currentPage: number;
    itemsPerPage: number;
}

export const DeviceList = ({ currentPage, itemsPerPage }: DeviceListProps) => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { toast } = useToast();

    const fetchDevices = async () => {
        try {
            const data = await api.getAllDevices();
            setDevices(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch devices",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchDevices();
            toast({
                title: "Success",
                description: "Device list refreshed",
            });
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDevices = devices.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Connected Devices</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    {refreshing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="ml-2">Refresh</span>
                </Button>
            </div>

            {currentDevices.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                        No devices found
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {currentDevices.map((device) => (
                        <Card key={device.id}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{device.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">IP Address</span>
                                        <span className="text-sm font-medium">{device.ip}</span>
                                    </div>
                                    {device.mac && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">MAC Address</span>
                                            <span className="text-sm font-medium">{device.mac}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Type</span>
                                        <span className="text-sm font-medium">{device.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Status</span>
                                        <span className={`text-sm font-medium ${
                                            device.status.toLowerCase() === 'online' ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                            {device.status}
                                        </span>
                                    </div>
                                    {device.last_seen && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Last Seen</span>
                                            <span className="text-sm font-medium">
                                                {new Date(device.last_seen).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};