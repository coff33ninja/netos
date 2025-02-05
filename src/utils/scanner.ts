
import { DeviceInfo, ScanResult } from '../types/network';
import { saveDeviceScan, recordScan } from './database';

// Mock data for development
const mockDevices: DeviceInfo[] = [
  {
    id: 1,
    name: "Main Server",
    ip: "192.168.1.100",
    mac: "00:1A:2B:3C:4D:5E",
    type: "Server",
    status: "Online",
    ports: [22, 80, 443],
    lastSeen: new Date().toISOString(),
    location: "Server Room",
    manufacturer: "Dell",
    model: "PowerEdge R740",
    osVersion: "Ubuntu 22.04 LTS"
  },
  {
    id: 2,
    name: "Developer Workstation",
    ip: "192.168.1.101",
    mac: "00:1B:2C:3D:4E:5F",
    type: "Workstation",
    status: "Online",
    ports: [3389],
    lastSeen: new Date().toISOString(),
    location: "Development Office",
    manufacturer: "HP",
    model: "Z4 G4",
    osVersion: "Windows 11 Pro"
  },
  {
    id: 3,
    name: "Network Storage",
    ip: "192.168.1.102",
    mac: "00:1C:2D:3E:4F:5G",
    type: "NAS",
    status: "Online",
    ports: [445, 5000],
    lastSeen: new Date().toISOString(),
    location: "Server Room",
    manufacturer: "Synology",
    model: "DS920+",
    osVersion: "DSM 7.2"
  }
];

export const performScan = async (): Promise<ScanResult> => {
  const startTime = Date.now();
  
  try {
    // Simulate network scan delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save each device to the database
    await Promise.all(mockDevices.map(device => saveDeviceScan(device)));

    const result: ScanResult = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      devicesFound: mockDevices.length,
      duration: Date.now() - startTime,
      status: 'success'
    };

    await recordScan(result);
    return result;
  } catch (error) {
    console.error('Scan failed:', error);
    const result: ScanResult = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      devicesFound: 0,
      duration: Date.now() - startTime,
      status: 'failed',
      errors: [(error as Error).message]
    };
    await recordScan(result);
    return result;
  }
};

