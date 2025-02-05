import { API_ENDPOINTS } from '@/config/api';

export interface Device {
    id?: string;
    name: string;
    ip: string;
    mac: string | null;
    type: string;
    status: 'online' | 'offline';
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
        try {
            console.log(`Making ${options.method || 'GET'} request to:`, endpoint);
            if (options.body) {
                console.log('Request body:', options.body);
            }

            const response = await fetch(endpoint, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            const responseData = await response.json().catch(() => null);
            console.log('Response status:', response.status);
            console.log('Response data:', responseData);

            if (!response.ok) {
                throw new Error(
                    responseData?.message || 
                    `HTTP error! status: ${response.status} - ${response.statusText}`
                );
            }

            return responseData;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
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

    async createDevice(deviceData: Omit<Device, 'id'>): Promise<Device> {
        // Ensure status is set
        const device = {
            ...deviceData,
            status: deviceData.status || 'online',
        };

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

    async deleteDevice(id: string): Promise<void> {
        return this.request<void>(API_ENDPOINTS.deleteDevice(id), {
            method: 'DELETE',
        });
    }
}

export const api = new ApiService();