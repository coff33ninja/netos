import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface NetworkScan {
    id: number;
    start_ip: string;
    end_ip: string;
    status: 'pending' | 'completed' | 'failed';
    timestamp: string;
    results?: any[];
}

export function useNetworkScan() {
    const [currentScan, setCurrentScan] = useState<NetworkScan | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const { toast } = useToast();

    const startScan = useCallback(async (startIp: string, endIp: string) => {
        setIsScanning(true);
        try {
            const scan = await api.startNetworkScan(startIp, endIp);
            setCurrentScan(scan);
            toast({
                title: "Scan Started",
                description: `Scanning network from ${startIp} to ${endIp}`,
            });

            // Poll for scan status
            const checkStatus = async () => {
                const updatedScan = await api.getScanStatus(scan.id);
                setCurrentScan(updatedScan);

                if (updatedScan.status === 'completed') {
                    setIsScanning(false);
                    toast({
                        title: "Scan Complete",
                        description: `Found ${updatedScan.results?.length || 0} devices`,
                    });
                } else if (updatedScan.status === 'failed') {
                    setIsScanning(false);
                    toast({
                        title: "Scan Failed",
                        description: "Network scan failed to complete",
                        variant: "destructive",
                    });
                } else {
                    // Continue polling if scan is still pending
                    setTimeout(checkStatus, 2000);
                }
            };

            checkStatus();
        } catch (error) {
            setIsScanning(false);
            toast({
                title: "Error",
                description: "Failed to start network scan",
                variant: "destructive",
            });
        }
    }, [toast]);

    return {
        currentScan,
        isScanning,
        startScan,
    };
}