export interface SystemInfo {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'warning';
    type: 'Primary' | 'Secondary' | 'Backup';
    lastSeen: string;
    location?: string;
    ipAddress?: string;
    version?: string;
    metrics: {
        cpu: number;
        memory: number;
        disk: number;
        network: number;
    };
    devices?: DeviceInfo[];
}

export interface DeviceInfo {
    id: number;
    name: string;
    ip: string;
    mac?: string;
    type: string;
    status: 'Online' | 'Offline' | 'Warning';
    lastSeen?: string;
    location?: string;
    manufacturer?: string;
    model?: string;
    osVersion?: string;
}

export interface NodeConfig {
    thresholds: {
        cpu: number;
        memory: number;
        disk: number;
        network: number;
    };
}