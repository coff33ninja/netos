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
import { Checkbox } from "@/components/ui/checkbox";
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/config/api';
import type { Device } from '@/types/api';

interface ScanDevice {
    ip: string;
    mac: string | null;
    type: string;
    manufacturer?: string;
    resolvedName?: string;
}

interface NetworkScanResultsProps {
    devices: ScanDevice[];
    onClose?: () => void;
}

export function NetworkScanResults({ devices, onClose }: NetworkScanResultsProps) {
    const [selectedDevices, setSelectedDevices] = React.useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = React.useState(false);
    const { toast } = useToast();

    const toggleDevice = (ip: string) => {
        const newSelected = new Set(selectedDevices);
        if (newSelected.has(ip)) {
            newSelected.delete(ip);
        } else {
            newSelected.add(ip);
        }
        setSelectedDevices(newSelected);
    };

    const toggleAll = () => {
        if (selectedDevices.size === devices.length) {
            setSelectedDevices(new Set());
        } else {
            setSelectedDevices(new Set(devices.map(d => d.ip)));
        }
    };

    const saveSelectedDevices = async () => {
        try {
            setIsSaving(true);
            const devicesToSave = devices.filter(d => selectedDevices.has(d.ip));
            
            for (const device of devicesToSave) {
                try {
                    console.log('Creating device:', {
                        ip: device.ip,
                        mac: device.mac || '',
                        type: device.type || 'unknown',
                        name: device.resolvedName || `Device ${device.ip}`,
                        manufacturer: device.manufacturer || 'Unknown',
                        status: 'online',
                        lastSeen: new Date().toISOString(),
                        firstSeen: new Date().toISOString()
                    });

                    await api.createDevice({
                        ip: device.ip,
                        mac: device.mac || '',
                        type: device.type || 'unknown',
                        name: device.resolvedName || `Device ${device.ip}`,
                        manufacturer: device.manufacturer || 'Unknown',
                        status: 'online',
                        lastSeen: new Date().toISOString(),
                        firstSeen: new Date().toISOString()
                    });
                } catch (error) {
                    if (error instanceof ApiError) {
                        console.error(`Failed to save device ${device.ip}:`, error.message, error.data);
                        throw new Error(`Failed to save device ${device.ip}: ${error.message}`);
                    }
                    throw error;
                }
            }

            toast({
                title: "Success",
                description: `Successfully saved ${selectedDevices.size} devices`,
            });

            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error('Error saving devices:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save selected devices. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                    Scan Results ({devices.length} devices found)
                </h3>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        onClick={toggleAll}
                        disabled={isSaving}
                    >
                        {selectedDevices.size === devices.length ? 'Deselect All' : 'Select All'}
                    </Button>
                    <Button
                        onClick={saveSelectedDevices}
                        disabled={selectedDevices.size === 0 || isSaving}
                    >
                        {isSaving ? 'Saving...' : `Save Selected (${selectedDevices.size})`}
                    </Button>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">Select</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>MAC Address</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Manufacturer</TableHead>
                            <TableHead>Type</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {devices.map((device) => (
                            <TableRow key={device.ip}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedDevices.has(device.ip)}
                                        onCheckedChange={() => toggleDevice(device.ip)}
                                        disabled={isSaving}
                                    />
                                </TableCell>
                                <TableCell>{device.ip}</TableCell>
                                <TableCell>{device.mac || 'N/A'}</TableCell>
                                <TableCell>{device.resolvedName || 'Unknown'}</TableCell>
                                <TableCell>{device.manufacturer || 'Unknown'}</TableCell>
                                <TableCell>{device.type || 'Unknown'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}