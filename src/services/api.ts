import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export interface Device {
    id: number;
    name: string;
    ip: string;
    mac: string | null;
    type: string;
    status: string;
    created_at: string;
    updated_at: string;
    last_seen?: string;
}

export interface NetworkScan {
    id: number;
    start_ip: string;
    end_ip: string;
    status: 'in_progress' | 'completed' | 'failed';
    devices_found: number;
    started_at: string;
    completed_at?: string;
    error?: string;
}

class ApiClient {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(error.error || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // Device endpoints
    async getDevices(): Promise<Device[]> {
        return this.request(API_ENDPOINTS.devices.list);
    }

    async getDevice(id: number): Promise<Device> {
        return this.request(API_ENDPOINTS.devices.get(id));
    }

    async createDevice(device: Omit<Device, 'id' | 'created_at' | 'updated_at'>): Promise<Device> {
        return this.request(API_ENDPOINTS.devices.create, {
            method: 'POST',
            body: JSON.stringify(device),
        });
    }

    async updateDevice(id: number, updates: Partial<Device>): Promise<Device> {
        return this.request(API_ENDPOINTS.devices.update(id), {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    // Network scan endpoints
    async startNetworkScan(startIp: string, endIp: string): Promise<NetworkScan> {
        return this.request(API_ENDPOINTS.networkScan.start, {
            method: 'POST',
            body: JSON.stringify({ start_ip: startIp, end_ip: endIp }),
        });
    }

    async getNetworkScanStatus(id: number): Promise<NetworkScan> {
        return this.request(API_ENDPOINTS.networkScan.status(id));
    }

    async getLatestNetworkScans(): Promise<NetworkScan[]> {
        return this.request(API_ENDPOINTS.networkScan.latest);
    }
}

export const api = new ApiClient();