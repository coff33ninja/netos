import { DeviceInfo, ScanResult } from '../types/network';

// Mock database using in-memory array
let devices: DeviceInfo[] = [
  {
    id: 1,
    name: "Main Router",
    ip: "192.168.1.1",
    mac: "00:11:22:33:44:55",
    type: "Router",
    status: "Online",
    ports: [80, 443, 22]
  },
  {
    id: 2,
    name: "File Server",
    ip: "192.168.1.100",
    mac: "AA:BB:CC:DD:EE:FF",
    type: "Server",
    status: "Online",
    ports: [22, 445, 3389]
  }
];

export const saveDeviceScan = (device: DeviceInfo): boolean => {
  try {
    const existingIndex = devices.findIndex(d => d.ip === device.ip);
    if (existingIndex >= 0) {
      devices[existingIndex] = { ...devices[existingIndex], ...device };
    } else {
      devices.push({ ...device, id: devices.length + 1 });
    }
    return true;
  } catch (error) {
    console.error('Error saving device scan:', error);
    return false;
  }
};

export const getDevices = (): DeviceInfo[] => {
  return [...devices];
};

let scanHistory: ScanResult[] = [];

export const getScanHistory = () => {
  return [...scanHistory];
};

export const recordScan = (result: ScanResult) => {
  scanHistory.push(result);
  return true;
};