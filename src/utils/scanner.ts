
import { DeviceInfo, ScanResult } from '../types/network';
import { toast } from "@/hooks/use-toast";

const BACKEND_URL = 'http://localhost:3001'; // Update with your backend URL

export const performScan = async (): Promise<ScanResult> => {
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/network/scan`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Network scan failed');
    }

    const result = await response.json();
    
    // Show success toast
    toast({
      title: "Scan Complete",
      description: `Found ${result.devicesFound} devices`,
      variant: "default",
    });

    return result;
  } catch (error) {
    console.error('Scan failed:', error);
    
    // Show error toast
    toast({
      title: "Scan Failed",
      description: "Failed to complete network scan",
      variant: "destructive",
    });

    return {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      devicesFound: 0,
      duration: Date.now() - startTime,
      status: 'failed',
      errors: [(error as Error).message]
    };
  }
};
