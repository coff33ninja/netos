import { useEffect, useState, useRef, useMemo } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/services/api';
import type { Device } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface GraphNode {
    id: string;
    name: string;
    type: string;
    status: string;
    val: number;
}

interface GraphLink {
    source: string;
    target: string;
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

export const NetworkMap = () => {
    const graphRef = useRef<any>();
    const { toast } = useToast();
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDevices = async () => {
        try {
            const data = await api.getAllDevices();
            setDevices(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch network data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
        const interval = setInterval(fetchDevices, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const graphData = useMemo<GraphData>(() => {
        const nodes: GraphNode[] = devices.map(device => ({
            id: device.id,
            name: device.name,
            type: device.type,
            status: device.status,
            val: 1, // Node size
        }));

        // Create links between devices (you might want to adjust this based on your network topology)
        const links: GraphLink[] = [];
        if (devices.length > 0) {
            // Connect each device to the first device (assuming it's the gateway/router)
            const gateway = devices[0];
            devices.slice(1).forEach(device => {
                links.push({
                    source: gateway.id,
                    target: device.id,
                });
            });
        }

        return { nodes, links };
    }, [devices]);

    const getNodeColor = (node: GraphNode) => {
        if (node.status === 'offline') return '#ef4444'; // red-500
        switch (node.type.toLowerCase()) {
            case 'router':
                return '#3b82f6'; // blue-500
            case 'switch':
                return '#10b981'; // emerald-500
            case 'server':
                return '#8b5cf6'; // violet-500
            default:
                return '#6b7280'; // gray-500
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Network Topology</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <div className="h-[400px] w-full">
                        <ForceGraph2D
                            ref={graphRef}
                            graphData={graphData}
                            nodeLabel="name"
                            nodeColor={getNodeColor}
                            linkColor={() => '#e5e7eb'} // gray-200
                            nodeCanvasObject={(node: any, ctx, globalScale) => {
                                const label = node.name;
                                const fontSize = 12/globalScale;
                                ctx.font = `${fontSize}px Sans-Serif`;
                                const textWidth = ctx.measureText(label).width;
                                const bckgDimensions = [textWidth, fontSize];
                                const paddedDimensions = bckgDimensions.map(n => n + fontSize * 0.2);

                                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                                ctx.fillRect(
                                    node.x - paddedDimensions[0] / 2,
                                    node.y - paddedDimensions[1] / 2,
                                    paddedDimensions[0],
                                    paddedDimensions[1]
                                );

                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = getNodeColor(node);
                                ctx.fillText(label, node.x, node.y);
                            }}
                            nodePointerAreaPaint={(node: any, color, ctx) => {
                                ctx.fillStyle = color;
                                const size = 8;
                                ctx.beginPath();
                                ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
                                ctx.fill();
                            }}
                            cooldownTicks={100}
                            onEngineStop={() => {
                                graphRef.current.zoomToFit(400, 50);
                            }}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
