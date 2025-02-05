import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

interface Device {
    id: string;
    ip: string;
    mac: string;
    name: string;
    type: string;
    manufacturer: string;
    status: 'online' | 'offline' | 'unknown';
    lastSeen: string;
}

export function DeviceList() {
    const [devices, setDevices] = React.useState<Device[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const { toast } = useToast();

    const fetchDevices = async () => {
        try {
            setIsLoading(true);
            const response = await api.getAllDevices();
            setDevices(response);
        } catch (error) {
            console.error('Error fetching devices:', error);
            toast({
                title: "Error",
                description: "Failed to fetch devices",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAllDevices = async () => {
        if (!window.confirm('Are you sure you want to delete all devices? This cannot be undone.')) {
            return;
        }

        try {
            setIsDeleting(true);
            await api.deleteAllDevices();
            setDevices([]);
            toast({
                title: "Success",
                description: "All devices have been deleted",
            });
        } catch (error) {
            console.error('Error deleting devices:', error);
            toast({
                title: "Error",
                description: "Failed to delete all devices",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    React.useEffect(() => {
        fetchDevices();
    }, []);

    if (isLoading) {
        return <div>Loading devices...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Devices ({devices.length})</h2>
                <Button
                    variant="destructive"
                    onClick={deleteAllDevices}
                    disabled={isDeleting || devices.length === 0}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? 'Deleting...' : 'Delete All'}
                </Button>
            </div>

            {devices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    No devices found. Try scanning your network to discover devices.
                </div>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>IP Address</TableHead>
                                <TableHead>MAC Address</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Manufacturer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Seen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {devices.map((device) => (
                                <TableRow key={device.id}>
                                    <TableCell>{device.name}</TableCell>
                                    <TableCell>{device.ip}</TableCell>
                                    <TableCell>{device.mac}</TableCell>
                                    <TableCell>{device.type}</TableCell>
                                    <TableCell>{device.manufacturer}</TableCell>
                                    <TableCell>{device.status}</TableCell>
                                    <TableCell>{new Date(device.lastSeen).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}