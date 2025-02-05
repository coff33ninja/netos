
import { DeviceInfo, ScanResult } from '../types/network';
import { toast } from "@/hooks/use-toast";

const BACKEND_URL = 'http://localhost:3001'; // Update with your backend URL

export const saveDeviceScan = async (device: DeviceInfo): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/devices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(device),
    });

    if (!response.ok) {
      throw new Error('Failed to save device scan');
    }

    return true;
  } catch (error) {
    console.error('Error saving device scan:', error);
    toast({
      title: "Error",
      description: "Failed to save device scan",
      variant: "destructive",
    });
    return false;
  }
};

export const getDevices = async (): Promise<DeviceInfo[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/devices`);
    if (!response.ok) {
      throw new Error('Failed to fetch devices');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching devices:', error);
    toast({
      title: "Error",
      description: "Failed to fetch devices",
      variant: "destructive",
    });
    return [];
  }
};

export const getScanHistory = async (): Promise<ScanResult[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/scans`);
    if (!response.ok) {
      throw new Error('Failed to fetch scan history');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching scan history:', error);
    toast({
      title: "Error",
      description: "Failed to fetch scan history",
      variant: "destructive",
    });
    return [];
  }
};

export const recordScan = async (result: ScanResult): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/scans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    });

    if (!response.ok) {
      throw new Error('Failed to record scan');
    }

    return true;
  } catch (error) {
    console.error('Error recording scan:', error);
    toast({
      title: "Error",
      description: "Failed to record scan result",
      variant: "destructive",
    });
    return false;
  }
};
