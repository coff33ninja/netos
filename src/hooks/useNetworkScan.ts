import { useState } from 'react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface NetworkScan {
    id: number;
    start_ip: string;
    end_ip: string;
    status: 'pending' | 'completed' | 'failed';
    devices_found?: Array<{
        ip: string;
        mac: string | null;
        type: string;
        manufacturer?: string;
        resolvedName?: string;
    }>;
    error?: string;
}

export function useNetworkScan() {
    const [isScanning, setIsScanning] = useState(false);
    const [currentScan, setCurrentScan] = useState<NetworkScan | null>(null);
    const { toast } = useToast();

    const startScan = async (startIp: string, endIp: string) => {
        try {
            setIsScanning(true);
            console.log('Starting network scan:', { startIp, endIp });
            
            const scan = await api.startNetworkScan({
                start_ip: startIp,  // Changed to match backend's expected format
                end_ip: endIp       // Changed to match backend's expected format
            });
            console.log('Scan started:', scan);
            setCurrentScan(scan);

            // Start polling for status
            const checkStatus = async () => {
                try {
                    console.log('Checking scan status for ID:', scan.id);
                    const updatedScan = await api.getScanStatus(scan.id);
                    console.log('Updated scan status:', updatedScan);
                    setCurrentScan(updatedScan);

                    if (updatedScan.status === 'completed') {
                        setIsScanning(false);
                        toast({
                            title: "Scan Complete",
                            description: `Found ${updatedScan.devices_found?.length || 0} devices`,
                        });
                    } else if (updatedScan.status === 'failed') {
                        setIsScanning(false);
                        toast({
                            title: "Scan Failed",
                            description: updatedScan.error || "Network scan failed to complete",
                            variant: "destructive",
                        });
                    } else {
                        // Continue polling if scan is still pending
                        setTimeout(checkStatus, 2000);
                    }
                } catch (error) {
                    console.error('Error checking scan status:', error);
                    setIsScanning(false);
                    toast({
                        title: "Error",
                        description: error instanceof Error ? error.message : "Failed to check scan status",
                        variant: "destructive",
                    });
                }
            };

            // Start polling
            setTimeout(checkStatus, 1000);
        } catch (error) {
            console.error('Error starting network scan:', error);
            setIsScanning(false);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to start network scan",
                variant: "destructive",
            });
        }
    };

    return {
        isScanning,
        startScan,
        currentScan
    };
}