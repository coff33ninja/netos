
import { DeviceInfo, ScanResult } from '../types/network';
import { saveDeviceScan, recordScan } from './database';

export const performScan = async (): Promise<ScanResult> => {
  const startTime = Date.now();
  
  try {
    // TODO: Implement actual network scanning logic
    const response = await fetch('/api/network/scan', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Network scan failed');
    }

    const devices: DeviceInfo[] = await response.json();
    
    // Save each device to the database
    await Promise.all(devices.map(device => saveDeviceScan(device)));

    const result: ScanResult = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      devicesFound: devices.length,
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
