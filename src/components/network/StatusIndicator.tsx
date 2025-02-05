import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { API_BASE_URL } from '@/config/api';
import { Loader2 } from 'lucide-react';

interface BackendStatus {
    status: 'online' | 'offline';
    version: string;
    uptime: string;
}

export const StatusIndicator = () => {
    const [status, setStatus] = useState<BackendStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/status`);
                if (response.ok) {
                    const data = await response.json();
                    setStatus(data);
                } else {
                    setStatus({ status: 'offline', version: 'N/A', uptime: 'N/A' });
                }
            } catch (error) {
                setStatus({ status: 'offline', version: 'N/A', uptime: 'N/A' });
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <Card className="mb-6">
                <CardContent className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mb-6">
            <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-4">
                    <Badge 
                        variant={status?.status === 'online' ? 'default' : 'destructive'}
                        className="capitalize"
                    >
                        {status?.status || 'Unknown'}
                    </Badge>
                    {status?.status === 'online' && (
                        <>
                            <div className="text-sm text-muted-foreground">
                                Version: <span className="font-medium">{status.version}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Uptime: <span className="font-medium">{status.uptime}</span>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};