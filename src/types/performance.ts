
export interface DevicePerformance {
    deviceId: string;
    timestamp: string;
    latency: number;
    packetLoss: number;
    bandwidth: number;
}

export interface DeviceGroup {
    id: string;
    name: string;
    deviceIds: string[];
    color: string;
    tags: string[];
}

export interface DeviceHistory {
    timestamp: string;
    status: 'online' | 'offline';
    latency: number;
    lastSeen: string;
}

export interface EnhancedDevice extends Device {
    group?: string;
    tags: string[];
    performance: DevicePerformance[];
    history: DeviceHistory[];
}
