// Using relative URLs since we're proxying through Vite
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
    deleteDevice: (id: string) => `/api/devices/${id}`,

    // Status
    status: '/api/status'
} as const;