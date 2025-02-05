import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useNetworkScan } from '@/hooks/useNetworkScan';
import { NetworkScanResults } from './NetworkScanResults';
import { Progress } from '@/components/ui/progress';

export function NetworkScanButton() {
    const [open, setOpen] = useState(false);
    const [startIp, setStartIp] = useState('192.168.1.1');
    const [endIp, setEndIp] = useState('192.168.1.10'); // Reduced range for testing
    const { isScanning, startScan, currentScan } = useNetworkScan();

    const handleScan = async () => {
        try {
            console.log('Starting scan with range:', { startIp, endIp });
            await startScan(startIp, endIp);
        } catch (error) {
            console.error('Error during scan:', error);
        }
    };

    const isValidIp = (ip: string): boolean => {
        if (!ip) return false;
        const parts = ip.split('.');
        return parts.length === 4 &&
            parts.every(num => {
                const value = parseInt(num);
                return value >= 0 && value <= 255;
            });
    };

    // Convert IPs to numbers for range validation
    const ipToNum = (ip: string): number => {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
    };

    const isValidRange = isValidIp(startIp) && isValidIp(endIp);

    const isValidIpRange = (): boolean => {
        if (!isValidRange) return false;
        const start = ipToNum(startIp);
        const end = ipToNum(endIp);
        return start <= end && end - start <= 254; // Limit range to 254 addresses
    };

    // Calculate scan progress
    const calculateProgress = () => {
        if (!currentScan) return 0;
        if (currentScan.status === 'completed') return 100;
        if (currentScan.status === 'failed') return 0;

        const start = ipToNum(currentScan.start_ip);
        const end = ipToNum(currentScan.end_ip);
        const total = end - start + 1;
        const scanned = currentScan.devices_found?.length || 0;
        
        return Math.min(Math.round((scanned / total) * 100), 99);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Scan Network</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Network Scan</DialogTitle>
                    <DialogDescription>
                        Enter IP range to scan for devices.
                        For best results, start with a small range (e.g., 10 addresses).
                    </DialogDescription>
                </DialogHeader>

                {!currentScan?.devices_found ? (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Input
                                id="startIp"
                                value={startIp}
                                onChange={(e) => setStartIp(e.target.value)}
                                placeholder="192.168.1.1"
                                disabled={isScanning}
                            />
                            <span className="text-center col-span-2">to</span>
                            <Input
                                id="endIp"
                                value={endIp}
                                onChange={(e) => setEndIp(e.target.value)}
                                placeholder="192.168.1.10"
                                disabled={isScanning}
                            />
                        </div>

                        {isScanning && (
                            <div className="space-y-2">
                                <Progress value={calculateProgress()} />
                                <p className="text-sm text-muted-foreground text-center">
                                    Scanning... {calculateProgress()}%
                                </p>
                            </div>
                        )}

                        {currentScan && (
                            <div className="text-sm text-muted-foreground">
                                Status: {currentScan.status}
                            </div>
                        )}

                        <div className="flex justify-between">
                            <Button 
                                variant="outline" 
                                onClick={() => setOpen(false)}
                                disabled={isScanning}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleScan}
                                disabled={isScanning || !isValidIpRange()}
                            >
                                {isScanning ? 'Scanning...' : 'Start Scan'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <NetworkScanResults 
                        devices={currentScan.devices_found}
                        onClose={() => setOpen(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}