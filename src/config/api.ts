export const API_BASE_URL = 'http://localhost:3001';

export const API_ENDPOINTS = {
    // Network scanning
    startScan: '/api/network-scan',
    getScanStatus: (id: number) => `/api/network-scan/${id}`,
    getLatestScans: '/api/network-scan',
    
    // Devices
    getAllDevices: '/api/devices',
    getDeviceById: (id: string) => `/api/devices/${id}`,
    updateDevice: (id: string) => `/api/devices/${id}`,
    createDevice: '/api/devices',
} as const;