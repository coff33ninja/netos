import { useEffect, useMemo, useRef } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Device } from '../../services/api';
import { useWebSocket } from '../../hooks/useWebSocket';

interface GraphNode {
    id: string;
    name: string;
    val: number;
    color: string;
}

interface GraphLink {
    source: string;
    target: string;
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

export function NetworkMap() {
    const { devices } = useWebSocket();
    const graphRef = useRef<any>();

    const graphData = useMemo<GraphData>(() => {
        const nodes: GraphNode[] = devices.map(device => ({
            id: device.ip,
            name: device.name,
            val: 1,
            color: getNodeColor(device)
        }));

        // Create links between devices (example: connect all to first router found)
        const router = devices.find(d => d.type.toLowerCase().includes('router'));
        const links: GraphLink[] = router
            ? devices
                .filter(d => d.ip !== router.ip)
                .map(device => ({
                    source: router.ip,
                    target: device.ip
                }))
            : [];

        return { nodes, links };
    }, [devices]);

    useEffect(() => {
        if (graphRef.current) {
            graphRef.current.d3Force('charge').strength(-150);
            graphRef.current.d3Force('link').distance(100);
        }
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Network Map</CardTitle>
            </CardHeader>
            <CardContent>
                <div style={{ height: '500px' }}>
                    <ForceGraph2D
                        ref={graphRef}
                        graphData={graphData}
                        nodeLabel="name"
                        nodeColor="color"
                        linkColor={() => '#999'}
                        nodeRelSize={6}
                        linkWidth={1}
                        linkDirectionalParticles={2}
                        linkDirectionalParticleSpeed={0.005}
                        onNodeClick={(node: any) => {
                            // Handle node click - could open device details
                            console.log('Clicked node:', node);
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

function getNodeColor(device: Device): string {
    switch (device.type.toLowerCase()) {
        case 'router':
            return '#4CAF50';
        case 'server':
            return '#2196F3';
        case 'web server':
        case 'web server (https)':
            return '#9C27B0';
        case 'ssh server':
            return '#FF9800';
        case 'dns server':
            return '#607D8B';
        default:
            return '#999';
    }
}