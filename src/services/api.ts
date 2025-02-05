import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';

export interface Device {
    id: string;
    name: string;
    ip: string;
    mac: string | null;
    type: string;
    status: string;
    last_seen?: string;
}

export interface NetworkScan {
    id: number;
    start_ip: string;
    end_ip: string;
    status: 'pending' | 'completed' | 'failed';
    timestamp: string;
    devices_found?: Device[];
}

class ApiService {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'An error occurred' }));
            throw new Error(error.message || 'Network response was not ok');
        }

        return response.json();
    }

    // Network Scanning
    async startNetworkScan(startIp: string, endIp: string): Promise<NetworkScan> {
        return this.request<NetworkScan>(API_ENDPOINTS.startScan, {
            method: 'POST',
            body: JSON.stringify({ start_ip: startIp, end_ip: endIp }),
        });
    }

    async getScanStatus(scanId: number): Promise<NetworkScan> {
        return this.request<NetworkScan>(API_ENDPOINTS.getScanStatus(scanId));
    }

    async getLatestScans(limit: number = 10): Promise<NetworkScan[]> {
        return this.request<NetworkScan[]>(`${API_ENDPOINTS.getLatestScans}?limit=${limit}`);
    }

    // Devices
    async getAllDevices(): Promise<Device[]> {
        return this.request<Device[]>(API_ENDPOINTS.getAllDevices);
    }

    async getDeviceById(id: string): Promise<Device> {
        return this.request<Device>(API_ENDPOINTS.getDeviceById(id));
    }

    async createDevice(device: Omit<Device, 'id'>): Promise<Device> {
        return this.request<Device>(API_ENDPOINTS.createDevice, {
            method: 'POST',
            body: JSON.stringify(device),
        });
    }

    async updateDevice(id: string, data: Partial<Omit<Device, 'id' | 'ip' | 'mac'>>): Promise<Device> {
        return this.request<Device>(API_ENDPOINTS.updateDevice(id), {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
}

export const api = new ApiService();