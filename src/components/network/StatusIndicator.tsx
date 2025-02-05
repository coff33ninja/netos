
import { useEffect, useState } from "react";
import { SystemStatus } from "@/types/network";
import { startStatusMonitoring, stopStatusMonitoring } from "@/utils/statusMonitor";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, WifiOff } from "lucide-react";

export const StatusIndicator = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const cleanup = startStatusMonitoring(
      (status) => {
        setSystemStatus(status);
        
        // Show toast for backend status changes
        if (!status.backend.isOnline) {
          toast({
            title: "Backend Offline",
            description: "The backend service is currently unavailable.",
            variant: "destructive"
          });
        }
      },
      (alert) => {
        toast({
          title: alert.type === "error" ? "Error" : alert.type === "warning" ? "Warning" : "Info",
          description: alert.message,
          variant: alert.type === "error" ? "destructive" : "default"
        });
      }
    );

    return () => {
      cleanup();
      stopStatusMonitoring();
    };
  }, []);

  if (!systemStatus) return null;

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {systemStatus.backend.isOnline ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            <div>
              <h3 className="text-sm font-medium">System Status</h3>
              <p className="text-xs text-muted-foreground">
                Last checked: {new Date(systemStatus.backend.lastCheck).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={systemStatus.backend.isOnline ? "default" : "destructive"}>
              {systemStatus.backend.isOnline ? "Online" : "Offline"}
            </Badge>
            {systemStatus.backend.latency && (
              <Badge variant="secondary">
                {Math.round(systemStatus.backend.latency)}ms
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

