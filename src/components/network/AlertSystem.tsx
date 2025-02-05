import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, WifiOff, Zap, Server } from "lucide-react";

interface Alert {
  id: number;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  device?: string;
}

interface AlertSystemProps {
  currentPage: number;
  itemsPerPage: number;
}

const alerts: Alert[] = [
  {
    id: 1,
    type: 'error',
    message: 'Server connection lost',
    timestamp: '2 minutes ago',
    device: 'Main Server'
  },
  {
    id: 2,
    type: 'warning',
    message: 'High network latency detected',
    timestamp: '5 minutes ago'
  },
  {
    id: 3,
    type: 'info',
    message: 'New device connected',
    timestamp: '10 minutes ago',
    device: 'Unknown Device'
  }
];

const getAlertIcon = (type: Alert['type']) => {
  switch (type) {
    case 'error':
      return <WifiOff className="h-4 w-4 text-destructive" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'info':
      return <Server className="h-4 w-4 text-blue-500" />;
  }
};

const getAlertBadgeVariant = (type: Alert['type']) => {
  switch (type) {
    case 'error':
      return 'destructive';
    case 'warning':
      return 'default';
    case 'info':
      return 'secondary';
  }
};

export const AlertSystem = ({ currentPage, itemsPerPage }: AlertSystemProps) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlerts = alerts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {paginatedAlerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start space-x-4 rounded-lg border p-3"
          >
            {getAlertIcon(alert.type)}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{alert.message}</p>
                <Badge variant={getAlertBadgeVariant(alert.type)}>
                  {alert.type}
                </Badge>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{alert.timestamp}</span>
                {alert.device && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{alert.device}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};