export interface DeviceInfo {
  id?: number;
  name: string;
  ip: string;
  mac?: string;
  type: string;
  status: string;
  ports?: number[];
  last_seen?: string;
}

export interface ScanResult {
  devicesFound: number;
  duration: number;
  status: string;
}

export interface PortInfo {
  deviceId: number;
  portNumber: number;
  service: string;
  status: string;
}