
import { DeviceInfo, ScanResult } from '../types/network';

// Mock scan history
const mockScanHistory: ScanResult[] = [];

// Mock devices storage
let mockDevicesStorage: DeviceInfo[] = [];

export const saveDeviceScan = async (device: DeviceInfo): Promise<boolean> => {
  try {
    // Update or add device to mock storage
    const existingDeviceIndex = mockDevicesStorage.findIndex(d => d.ip === device.ip);
    if (existingDeviceIndex >= 0) {
      mockDevicesStorage[existingDeviceIndex] = device;
    } else {
      mockDevicesStorage.push(device);
    }
    return true;
  } catch (error) {
    console.error('Error saving device scan:', error);
    return false;
  }
};

export const getDevices = async (): Promise<DeviceInfo[]> => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDevicesStorage;
  } catch (error) {
    console.error('Error fetching devices:', error);
    return [];
  }
};

export const getScanHistory = async (): Promise<ScanResult[]> => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockScanHistory;
  } catch (error) {
    console.error('Error fetching scan history:', error);
    return [];
  }
};

export const recordScan = async (result: ScanResult): Promise<boolean> => {
  try {
    mockScanHistory.push(result);
    return true;
  } catch (error) {
    console.error('Error recording scan:', error);
    return false;
  }
};

