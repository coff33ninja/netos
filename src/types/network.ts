export interface DeviceInfo {
  id?: number;
  name: string;
  ip: string;
  mac?: string;
  type: string;
  status: "Online" | "Offline" | "Warning";
  ports?: number[];
  lastSeen?: string;
  location?: string;
  manufacturer?: string;
  model?: string;
  osVersion?: string;
}

export interface ScanResult {
  id: number;
  timestamp: string;
  devicesFound: number;
  duration: number;
  status: "success" | "failed";
  errors?: string[];
}

export interface PortInfo {
  deviceId: number;
  portNumber: number;
  service: string;
  status: "open" | "closed" | "filtered";
  protocol: "tcp" | "udp";
  banner?: string;
}

export interface Node {
  id: string;
  name: string;
  status: "online" | "offline" | "warning";
  type: "Primary" | "Secondary" | "Backup";
  lastSeen: string;
  location?: string;
  ipAddress?: string;
  version?: string;
  metrics?: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}

export interface NodeMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

export interface NodeThresholds {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

export interface AlertInfo {
  id: number;
  type: "error" | "warning" | "info";
  message: string;
  timestamp: string;
  deviceId?: number;
  nodeId?: string;
  resolved?: boolean;
  priority: "high" | "medium" | "low";
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
  lastScanTimestamp?: string;
  alerts: AlertInfo[];
}
