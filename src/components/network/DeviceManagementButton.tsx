import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus } from 'lucide-react';

const DEVICE_TYPES = [
    { value: 'router', label: 'Router' },
    { value: 'switch', label: 'Switch' },
    { value: 'server', label: 'Server' },
    { value: 'workstation', label: 'Workstation' },
    { value: 'printer', label: 'Printer' },
    { value: 'other', label: 'Other' },
] as const;

interface DeviceForm {
    name: string;
    ip: string;
    mac: string;
    type: typeof DEVICE_TYPES[number]['value'];
}

interface Props {
    onDeviceAdded?: () => void;
}

export const DeviceManagementButton = ({ onDeviceAdded }: Props) => {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const [form, setForm] = useState<DeviceForm>({
        name: '',
        ip: '',
        mac: '',
        type: 'workstation',
    });

    const validateIp = (ip: string): boolean => {
        const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!pattern.test(ip)) return false;
        return ip.split('.').every(num => parseInt(num) >= 0 && parseInt(num) <= 255);
    };

    const validateMac = (mac: string): boolean => {
        if (!mac) return true; // MAC is optional
        return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac);
    };

    const handleSubmit = async () => {
        try {
            // Validation
            if (!form.name.trim()) {
                toast({
                    title: "Validation Error",
                    description: "Device name is required",
                    variant: "destructive",
                });
                return;
            }

            if (!validateIp(form.ip)) {
                toast({
                    title: "Validation Error",
                    description: "Invalid IP address format",
                    variant: "destructive",
                });
                return;
            }

            if (!validateMac(form.mac)) {
                toast({
                    title: "Validation Error",
                    description: "Invalid MAC address format (use XX:XX:XX:XX:XX:XX)",
                    variant: "destructive",
                });
                return;
            }

            setIsSubmitting(true);

            // Prepare device data
            const deviceData = {
                name: form.name.trim(),
                ip: form.ip.trim(),
                mac: form.mac.trim() || null,
                type: form.type,
                status: 'online' as const,
            };

            console.log('Submitting device data:', deviceData);

            await api.createDevice(deviceData);
            
            toast({
                title: "Success",
                description: "Device added successfully",
            });
            
            setOpen(false);
            setForm({
                name: '',
                ip: '',
                mac: '',
                type: 'workstation',
            });
            
            onDeviceAdded?.();
        } catch (error) {
            console.error('Failed to add device:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to add device",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Device
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Device</DialogTitle>
                    <DialogDescription>
                        Enter the details of the network device you want to add.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Device Name</Label>
                        <Input
                            id="name"
                            value={form.name}
                            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Main Router"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="ip">IP Address</Label>
                        <Input
                            id="ip"
                            value={form.ip}
                            onChange={(e) => setForm(prev => ({ ...prev, ip: e.target.value }))}
                            placeholder="192.168.1.1"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="mac">MAC Address (Optional)</Label>
                        <Input
                            id="mac"
                            value={form.mac}
                            onChange={(e) => setForm(prev => ({ ...prev, mac: e.target.value }))}
                            placeholder="XX:XX:XX:XX:XX:XX"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="type">Device Type</Label>
                        <Select
                            value={form.type}
                            onValueChange={(value: typeof DEVICE_TYPES[number]['value']) => 
                                setForm(prev => ({ ...prev, type: value }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select device type" />
                            </SelectTrigger>
                            <SelectContent>
                                {DEVICE_TYPES.map(type => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            'Add Device'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};