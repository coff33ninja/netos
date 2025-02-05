
import { BackendStatus, SystemStatus, AlertInfo } from '../types/network';
import { useToast } from "@/components/ui/use-toast";

const BACKEND_CHECK_INTERVAL = 30000; // 30 seconds
let monitoringInterval: NodeJS.Timeout | null = null;

export const checkBackendStatus = async (): Promise<BackendStatus> => {
  const startTime = performance.now();
  try {
    // In development, we'll simulate the backend check
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      isOnline: true,
      lastCheck: new Date().toISOString(),
      version: "1.0.0",
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
    
    if (!backendStatus.isOnline) {
      const alert: AlertInfo = {
        id: Date.now(),
        type: "error",
        message: "Backend service is offline",
        timestamp: new Date().toISOString(),
        priority: "high"
      };
      onAlert(alert);
    }

    const systemStatus: SystemStatus = {
      backend: backendStatus,
      activeDevices: 0, // This will be updated from actual device monitoring
      activeNodes: 0, // This will be updated from actual node monitoring
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

