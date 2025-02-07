
import { Device } from '../types/network';
import { toast } from "@/hooks/use-toast";

const BACKEND_URL = 'http://localhost:3001';

export const performScan = async (): Promise<Device[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/network/scan`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Network scan failed');
    }

    const result = await response.json();
    
    toast({
      title: "Scan Complete",
      description: `Found ${result.length} devices`,
      variant: "default",
    });

    return result;
  } catch (error) {
    console.error('Scan failed:', error);
    
    toast({
      title: "Scan Failed",
      description: "Failed to complete network scan",
      variant: "destructive",
    });

    return [];
  }
};
