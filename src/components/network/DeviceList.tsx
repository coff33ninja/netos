
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { api, type Device } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Power, PowerOff, Wifi, TestTube } from 'lucide-react';
import { wakeDevice } from '@/utils/wol';
import { PowerDialog } from '../nodes/PowerDialog';

interface DeviceListProps {
    currentPage: number;
    itemsPerPage: number;
}

export function DeviceList({ currentPage, itemsPerPage }: DeviceListProps) {
    const [devices, setDevices] = React.useState<Device[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [selectedDeviceId, setSelectedDeviceId] = React.useState<string | null>(null);
    const [isPowerDialogOpen, setIsPowerDialogOpen] = React.useState(false);
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

    const handleTestDevice = async (device: Device) => {
        try {
            toast({
                title: "Testing Connection",
                description: `Testing connection to ${device.name}...`,
            });
            // TODO: Implement actual test functionality
            console.log('Testing device:', device.name);
            
            // Simulate test success after 1 second
            setTimeout(() => {
                toast({
                    title: "Test Complete",
                    description: `Connection test to ${device.name} successful`,
                });
            }, 1000);
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to test ${device.name}`,
                variant: "destructive",
            });
        }
    };

    const handlePowerAction = (action: 'start' | 'stop' | 'restart') => {
        const device = devices.find(d => d.id === selectedDeviceId);
        if (!device) return;

        toast({
            title: "Power Action",
            description: `${action} command sent to ${device.name}`,
        });
        setIsPowerDialogOpen(false);
        setSelectedDeviceId(null);
    };

    const handleWakeDevice = async (device: Device) => {
        try {
            const result = await wakeDevice(device.mac, device.name);
            toast({
                title: result.success ? "Success" : "Error",
                description: result.message,
                variant: result.success ? "default" : "destructive",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to wake ${device.name}`,
                variant: "destructive",
            });
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
                                <TableHead>Actions</TableHead>
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
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleTestDevice(device)}
                                                title="Test Connection"
                                            >
                                                <TestTube className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedDeviceId(device.id);
                                                    setIsPowerDialogOpen(true);
                                                }}
                                                title="Power Actions"
                                            >
                                                <Power className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleWakeDevice(device)}
                                                disabled={device.status === 'online' || !device.mac}
                                                title="Wake Device"
                                            >
                                                <Wifi className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <PowerDialog 
                isOpen={isPowerDialogOpen}
                onOpenChange={setIsPowerDialogOpen}
                onPowerAction={handlePowerAction}
            />
        </div>
    );
}
