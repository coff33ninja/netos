import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, Device } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { DeviceManagementButton } from './DeviceManagementButton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Loader2, MoreVertical, Search, Wifi, WifiOff } from 'lucide-react';

export const Devices = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

    const fetchDevices = async () => {
        try {
            const data = await api.getAllDevices();
            setDevices(data);
        } catch (error) {
            console.error('Failed to fetch devices:', error);
            toast({
                title: "Error",
                description: "Failed to fetch devices",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
        // Refresh devices every 30 seconds
        const interval = setInterval(fetchDevices, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleDeleteDevice = async (deviceId: string) => {
        try {
            await api.deleteDevice(deviceId);
            toast({
                title: "Success",
                description: "Device deleted successfully",
            });
            fetchDevices(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete device:', error);
            toast({
                title: "Error",
                description: "Failed to delete device",
                variant: "destructive",
            });
        }
    };

    const filteredDevices = devices.filter(device => 
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.ip.includes(searchQuery) ||
        (device.mac && device.mac.toLowerCase().includes(searchQuery.toLowerCase())) ||
        device.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getDeviceTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'router':
                return 'bg-blue-500';
            case 'switch':
                return 'bg-green-500';
            case 'server':
                return 'bg-purple-500';
            case 'printer':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Network Devices</CardTitle>
                    <DeviceManagementButton onDeviceAdded={fetchDevices} />
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search devices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>MAC Address</TableHead>
                                    <TableHead>Last Seen</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDevices.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center text-muted-foreground"
                                        >
                                            No devices found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredDevices.map((device) => (
                                        <TableRow key={device.id}>
                                            <TableCell>
                                                {device.status === 'online' ? (
                                                    <Wifi className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <WifiOff className="h-4 w-4 text-red-500" />
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {device.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={`${getDeviceTypeColor(device.type)} text-white`}
                                                >
                                                    {device.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{device.ip}</TableCell>
                                            <TableCell>
                                                {device.mac || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {device.lastSeen
                                                    ? new Date(device.lastSeen).toLocaleString()
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>
                                                            Actions
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => handleDeleteDevice(device.id)}
                                                        >
                                                            Delete Device
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
