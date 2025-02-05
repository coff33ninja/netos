import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface HistoricalDataProps {
    currentPage: number;
    itemsPerPage: number;
}

interface HistoricalEvent {
    id: string;
    event: string;
    timestamp: string;
    type: 'info' | 'warning' | 'error';
}

export const HistoricalData = ({ currentPage, itemsPerPage }: HistoricalDataProps) => {
    const [events] = useState<HistoricalEvent[]>([
        {
            id: '1',
            event: 'Network scan completed',
            timestamp: '2024-02-20T10:00:00',
            type: 'info'
        },
        {
            id: '2',
            event: 'New device detected',
            timestamp: '2024-02-20T09:45:00',
            type: 'info'
        },
        {
            id: '3',
            event: 'High network load detected',
            timestamp: '2024-02-20T09:30:00',
            type: 'warning'
        }
    ]);

    const getEventColor = (type: HistoricalEvent['type']) => {
        switch (type) {
            case 'info':
                return 'text-blue-500';
            case 'warning':
                return 'text-yellow-500';
            case 'error':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEvents = events.slice(startIndex, endIndex);

    return (
        <div className="space-y-4">
            {currentEvents.map((event) => (
                <Card key={event.id}>
                    <CardContent className="flex items-start space-x-4 p-4">
                        <Clock className={`h-5 w-5 mt-0.5 ${getEventColor(event.type)}`} />
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">{event.event}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(event.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
            {currentEvents.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">No historical data available</p>
            )}
        </div>
    );
};