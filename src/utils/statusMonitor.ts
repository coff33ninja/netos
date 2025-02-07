import { BackendStatus, SystemStatus, AlertInfo } from '../types/network';
import { toast } from "@/hooks/use-toast";

const BACKEND_CHECK_INTERVAL = 30000; // 30 seconds
const BACKEND_URL = 'http://localhost:3001'; // Update with your backend URL
let monitoringInterval: NodeJS.Timeout | null = null;
let lastBackendStatus: boolean | null = null;

export const checkBackendStatus = async (): Promise<BackendStatus> => {
  const startTime = performance.now();
  try {
    const response = await fetch(`${BACKEND_URL}/api/status`);
    if (!response.ok) {
      throw new Error('Backend is not responding');
    }
    const data = await response.json();
    return {
      isOnline: true,
      lastCheck: new Date().toISOString(),
      version: data.version,
      latency: performance.now() - startTime
    };
  } catch (error) {
    console.error('Backend status check failed:', error);
    return {
      isOnline: false,
      lastCheck: new Date().toISOString()
    };
  }
};

export const startStatusMonitoring = (
  onStatusChange: (status: SystemStatus) => void,
  onAlert: (alert: AlertInfo) => void
) => {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
  }

  const checkStatus = async () => {
    const backendStatus = await checkBackendStatus();
    
    // Notify only when status changes
    if (lastBackendStatus !== null && lastBackendStatus !== backendStatus.isOnline) {
      const alert: AlertInfo = {
        id: Date.now(),
        type: backendStatus.isOnline ? "info" : "error",
        message: backendStatus.isOnline ? 
          "Backend service is now online" : 
          "Backend service is offline",
        timestamp: new Date().toISOString(),
        priority: backendStatus.isOnline ? "low" : "high"
      };
      onAlert(alert);
      
      // Show toast notification
      toast({
        title: backendStatus.isOnline ? "Backend Connected" : "Backend Disconnected",
        description: backendStatus.isOnline ? 
          "Backend service is now available" : 
          "Backend service is currently unavailable",
        variant: backendStatus.isOnline ? "default" : "destructive",
      });
    }
    
    lastBackendStatus = backendStatus.isOnline;

    const systemStatus: SystemStatus = {
      backend: backendStatus,
      activeDevices: 0,
      activeNodes: 0,
      alerts: []
    };

    onStatusChange(systemStatus);
  };

  // Initial check
  checkStatus();
  
  // Start periodic checking
  monitoringInterval = setInterval(checkStatus, BACKEND_CHECK_INTERVAL);

  return () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      monitoringInterval = null;
    }
  };
};

export const stopStatusMonitoring = () => {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
};

export const controlBackend = async (action: 'start' | 'stop' | 'restart'): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/control`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });

    if (!response.ok) {
      throw new Error(`Failed to ${action} backend`);
    }

    toast({
      title: "Backend Control",
      description: `Successfully ${action}ed backend service`,
      variant: "default",
    });

    return true;
  } catch (error) {
    console.error(`Failed to ${action} backend:`, error);
    toast({
      title: "Backend Control Error",
      description: `Failed to ${action} backend service`,
      variant: "destructive",
    });
    return false;
  }
};
