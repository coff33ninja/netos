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
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Network } from 'lucide-react';

export const NetworkScanButton = () => {
    const [open, setOpen] = useState(false);
    const [startIp, setStartIp] = useState('192.168.1.1');
    const [endIp, setEndIp] = useState('192.168.1.254');
    const [isScanning, setIsScanning] = useState(false);
    const { toast } = useToast();

    const handleScan = async () => {
        try {
            setIsScanning(true);
            await api.startNetworkScan(startIp, endIp);
            toast({
                title: "Scan Started",
                description: "Network scan has been initiated successfully.",
            });
            setOpen(false);
        } catch (error) {
            console.error('Network scan error:', error);
            toast({
                title: "Scan Failed",
                description: error instanceof Error ? error.message : "Failed to start network scan",
                variant: "destructive",
            });
        } finally {
            setIsScanning(false);
        }
    };

    const validateIp = (ip: string): boolean => {
        const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!pattern.test(ip)) return false;
        return ip.split('.').every(num => parseInt(num) >= 0 && parseInt(num) <= 255);
    };

    const isValidRange = validateIp(startIp) && validateIp(endIp);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isScanning}>
                    {isScanning ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Scanning...
                        </>
                    ) : (
                        <>
                            <Network className="mr-2 h-4 w-4" />
                            Scan Network
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Network Scan</DialogTitle>
                    <DialogDescription>
                        Enter the IP range to scan for network devices.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="startIp">Start IP</Label>
                        <Input
                            id="startIp"
                            value={startIp}
                            onChange={(e) => setStartIp(e.target.value)}
                            placeholder="192.168.1.1"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="endIp">End IP</Label>
                        <Input
                            id="endIp"
                            value={endIp}
                            onChange={(e) => setEndIp(e.target.value)}
                            placeholder="192.168.1.254"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleScan} 
                        disabled={isScanning || !isValidRange}
                    >
                        {isScanning ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Scanning...
                            </>
                        ) : (
                            'Start Scan'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};