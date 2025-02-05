export const API_BASE_URL = 'http://localhost:3001/api';

export const API_ENDPOINTS = {
    devices: {
        list: '/devices',
        get: (id: number) => `/devices/${id}`,
        create: '/devices',
        update: (id: number) => `/devices/${id}`,
    },
    networkScan: {
        start: '/network-scan',
        status: (id: number) => `/network-scan/${id}`,
        latest: '/network-scan',
    },
    users: {
        create: '/users',
        get: (id: number) => `/users/${id}`,
        update: (id: number) => `/users/${id}`,
    },
};