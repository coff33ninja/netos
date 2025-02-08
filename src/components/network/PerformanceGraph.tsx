
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DevicePerformance } from '@/types/performance';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface PerformanceGraphProps {
    data: DevicePerformance[];
    metric: 'latency' | 'packetLoss' | 'bandwidth';
    title: string;
}

export function PerformanceGraph({ data, metric, title }: PerformanceGraphProps) {
    const formatData = (data: DevicePerformance[]) => {
        return data.map(d => ({
            timestamp: new Date(d.timestamp).toLocaleTimeString(),
            value: d[metric]
        }));
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formatData(data)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="timestamp" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#8884d8" 
                                name={metric.charAt(0).toUpperCase() + metric.slice(1)} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
