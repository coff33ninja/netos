import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlertSystemProps {
    currentPage: number;
    itemsPerPage: number;
}

interface Alert {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
}

export const AlertSystem = ({ currentPage, itemsPerPage }: AlertSystemProps) => {
    const [alerts] = useState<Alert[]>([
        {
            id: '1',
            title: 'High Network Load',
            description: 'Network load has exceeded 80%',
            severity: 'high',
            timestamp: '2024-02-20T10:00:00'
        },
        {
            id: '2',
            title: 'New Device Detected',
            description: 'Unknown device connected to network',
            severity: 'medium',
            timestamp: '2024-02-20T09:45:00'
        },
        {
            id: '3',
            title: 'System Update Available',
            description: 'New system update is available',
            severity: 'low',
            timestamp: '2024-02-20T09:30:00'
        }
    ]);

    const getAlertIcon = (severity: Alert['severity']) => {
        switch (severity) {
            case 'high':
                return <AlertOctagon className="h-5 w-5 text-red-500" />;
            case 'medium':
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'low':
                return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAlerts = alerts.slice(startIndex, endIndex);

    return (
        <div className="space-y-4">
            {currentAlerts.map((alert) => (
                <Card key={alert.id}>
                    <CardContent className="flex items-start space-x-4 p-4">
                        {getAlertIcon(alert.severity)}
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium">{alert.title}</p>
                                <Button variant="ghost" size="sm">
                                    Dismiss
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(alert.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
            {currentAlerts.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">No active alerts</p>
            )}
        </div>
    );
};