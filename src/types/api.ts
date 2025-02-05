// Network Scan Types
export interface NetworkScanRequest {
    start_ip: string;
    end_ip: string;
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

// Device Types
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
}

export type DeviceUpdate = Partial<Omit<Device, 'id'>>;