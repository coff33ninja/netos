// Base URL for API endpoints - default to localhost if not configured
const API_BASE_URL = typeof window !== 'undefined' 
    ? (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api')
    : 'http://localhost:3001/api';

// API endpoints configuration
export const API_ENDPOINTS = {
    // Network scanning endpoints
    startScan: `${API_BASE_URL}/network-scan`,
    getScanStatus: (id: number) => `${API_BASE_URL}/network-scan/${id}`,
    getLatestScans: `${API_BASE_URL}/network-scan/history`,
    
    // Device management endpoints
    getAllDevices: `${API_BASE_URL}/devices`,
    getDeviceById: (id: string) => `${API_BASE_URL}/devices/${id}`,
    createDevice: `${API_BASE_URL}/devices`,
    updateDevice: (id: string) => `${API_BASE_URL}/devices/${id}`,
    deleteDevice: (id: string) => `${API_BASE_URL}/devices/${id}`,
    
    // Auto-scan configuration endpoints
    getAutoScanConfig: `${API_BASE_URL}/devices/auto-scan/config`,
    updateAutoScanConfig: `${API_BASE_URL}/devices/auto-scan/config`,
    startAutoScan: `${API_BASE_URL}/devices/auto-scan/start`,
    stopAutoScan: `${API_BASE_URL}/devices/auto-scan/stop`,
    
    // Status endpoint
    status: `${API_BASE_URL}/status`
};

// API response handler
export async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
            errorData.error || `HTTP error! status: ${response.status}`,
            response.status,
            errorData
        );
    }
    return response.json();
}

// Custom API error class
export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}