import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { api, Device } from '../../services/api';
import { useToast } from '../ui/use-toast';

interface DeviceDetailsProps {
    device: Device;
    onUpdate: (device: Device) => void;
}

export function DeviceDetails({ device, onUpdate }: DeviceDetailsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState(device.name);
    const { toast } = useToast();

    const handleSave = async () => {
        try {
            const updated = await api.updateDevice(device.id, { name });
            onUpdate(updated);
            setIsOpen(false);
            toast({
                title: 'Success',
                description: 'Device updated successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update device',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost">View Details</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Device Details</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="info">
                    <TabsList>
                        <TabsTrigger value="info">Information</TabsTrigger>
                        <TabsTrigger value="network">Network</TabsTrigger>
                        <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                        <TabsTrigger value="config">Configuration</TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="space-y-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Type</Label>
                                <div className="text-sm">{device.type}</div>
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <div className="text-sm">{device.status}</div>
                            </div>

                            <div className="space-y-2">
                                <Label>Last Seen</Label>
                                <div className="text-sm">
                                    {device.last_seen
                                        ? new Date(device.last_seen).toLocaleString()
                                        : 'Never'}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="network" className="space-y-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label>IP Address</Label>
                                <div className="text-sm">{device.ip}</div>
                            </div>

                            <div className="space-y-2">
                                <Label>MAC Address</Label>
                                <div className="text-sm">{device.mac || 'N/A'}</div>
                            </div>

                            <div className="space-y-2">
                                <Label>Open Ports</Label>
                                <div className="text-sm">
                                    {device.ports?.join(', ') || 'No ports detected'}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="monitoring" className="space-y-4">
                        <div className="grid gap-4">
                            <Button className="w-full" variant="outline">
                                Start Continuous Ping
                            </Button>
                            <Button className="w-full" variant="outline">
                                Check Services
                            </Button>
                            <Button className="w-full" variant="outline">
                                Port Scan
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="config" className="space-y-4">
                        <div className="grid gap-4">
                            <Button className="w-full" variant="outline">
                                Wake on LAN
                            </Button>
                            <Button className="w-full" variant="outline">
                                Remote Desktop
                            </Button>
                            <Button className="w-full" variant="outline">
                                SSH Connection
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}