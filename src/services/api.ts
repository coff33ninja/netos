
import { API_ENDPOINTS, handleApiResponse } from '@/config/api';

export interface Device {
    id: string;
    ip: string;
    mac: string;
    name: string;
    type: string;
    manufacturer: string;
    status: 'online' | 'offline' | 'unknown';
    lastSeen: string;
    firstSeen: string;
    ports?: number[];
}

export interface NetworkScan {
    id: number;
    start_ip: string;
    end_ip: string;
    status: 'pending' | 'completed' | 'failed';
    timestamp?: string;
    devices_found?: Array<{
        ip: string;
        mac: string | null;
        type: string;
        manufacturer?: string;
        resolvedName?: string;
    }>;
    error?: string;
}

class ApiService {
    async getAllDevices(): Promise<Device[]> {
        console.log('Making GET request to:', API_ENDPOINTS.getAllDevices);
        const response = await fetch(API_ENDPOINTS.getAllDevices);
        console.log('Response status:', response.status);
        return handleApiResponse<Device[]>(response);
    }

    async getDeviceById(id: string): Promise<Device> {
        const response = await fetch(API_ENDPOINTS.getDeviceById(id));
        return handleApiResponse<Device>(response);
    }

    async createDevice(device: Omit<Device, 'id'>): Promise<Device> {
        const response = await fetch(API_ENDPOINTS.createDevice, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(device),
        });
        return handleApiResponse<Device>(response);
    }

    async updateDevice(id: string, updates: Partial<Device>): Promise<Device> {
        const response = await fetch(API_ENDPOINTS.updateDevice(id), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });
        return handleApiResponse<Device>(response);
    }

    async deleteDevice(id: string): Promise<void> {
        const response = await fetch(API_ENDPOINTS.deleteDevice(id), {
            method: 'DELETE',
        });
        return handleApiResponse<void>(response);
    }

    async deleteAllDevices(): Promise<void> {
        const response = await fetch(API_ENDPOINTS.getAllDevices, {
            method: 'DELETE',
        });
        return handleApiResponse<void>(response);
    }

    async startNetworkScan(params: { start_ip: string; end_ip: string }): Promise<{ id: number }> {
        const response = await fetch(API_ENDPOINTS.startScan, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });
        return handleApiResponse<{ id: number }>(response);
    }

    async getScanStatus(id: number): Promise<any> {
        const response = await fetch(API_ENDPOINTS.getScanStatus(id));
        return handleApiResponse(response);
    }

    async getLatestScans(): Promise<any[]> {
        const response = await fetch(API_ENDPOINTS.getLatestScans);
        return handleApiResponse(response);
    }
}

export const api = new ApiService();
