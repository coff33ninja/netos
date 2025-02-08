
import { EnhancedDevice } from '@/types/performance';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { PerformanceGraph } from './PerformanceGraph';
import { ScrollArea } from '../ui/scroll-area';

interface EnhancedDeviceDetailsProps {
    device: EnhancedDevice;
}

export function EnhancedDeviceDetails({ device }: EnhancedDeviceDetailsProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Device Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Name</div>
                            <div>{device.name}</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Status</div>
                            <div>
                                <Badge variant={device.status === 'online' ? 'success' : 'destructive'}>
                                    {device.status}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">IP Address</div>
                            <div>{device.ip}</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">MAC Address</div>
                            <div>{device.mac}</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Type</div>
                            <div>{device.type}</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Manufacturer</div>
                            <div>{device.manufacturer}</div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Tags</div>
                        <div className="flex gap-2 flex-wrap">
                            {device.tags.map((tag) => (
                                <Badge key={tag} variant="outline">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <PerformanceGraph
                            data={device.performance}
                            metric="latency"
                            title="Latency"
                        />
                        <PerformanceGraph
                            data={device.performance}
                            metric="packetLoss"
                            title="Packet Loss"
                        />
                        <PerformanceGraph
                            data={device.performance}
                            metric="bandwidth"
                            title="Bandwidth"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Connection History</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[200px]">
                        <div className="space-y-4">
                            {device.history.map((entry, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div>
                                        <Badge variant={entry.status === 'online' ? 'success' : 'destructive'}>
                                            {entry.status}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(entry.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
