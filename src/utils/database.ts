
import { Device } from '@/types/network';
import { toast } from "@/hooks/use-toast";

const BACKEND_URL = 'http://localhost:3001'; // Update with your backend URL

export const saveDeviceScan = async (device: Device): Promise<boolean> => {
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

export const getDevices = async (): Promise<Device[]> => {
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
