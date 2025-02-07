
export interface Device {
    id: string;
    name: string;
    type: string;
    status: 'online' | 'offline' | 'unknown';
    ip: string;
    mac: string;
    manufacturer: string;
    lastSeen: string;
    firstSeen: string;
}

export interface NodeConfig {
    id: string;
    name: string;
    type: "Primary" | "Secondary" | "Backup";
    status: "online" | "offline" | "maintenance";
    location: string;
    port: number;
    primaryNodeUrl?: string;
    devices: Device[];
}

export interface Node {
    id: string;
    name: string;
    type: string;
    status: string;
    location: string;
}

export interface NodeThresholds {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
}

export interface DeviceInfo {
    id: string;
    ip: string;
    mac: string;
    name: string;
    type: string;
    status: string;
    lastSeen: string;
    firstSeen: string;
}

export interface ScanResult {
    id: number;
    timestamp: string;
    devicesFound: number;
    duration: number;
    status: 'completed' | 'failed';
    errors?: string[];
}

export interface BackendStatus {
    isOnline: boolean;
    lastCheck: string;
    version?: string;
    latency?: number;
}

export interface SystemStatus {
    backend: BackendStatus;
    activeDevices: number;
    activeNodes: number;
    alerts: AlertInfo[];
}

export interface AlertInfo {
    id: number;
    type: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
    priority: 'low' | 'medium' | 'high';
}
