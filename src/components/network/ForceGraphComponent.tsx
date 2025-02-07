
import { ForceGraph2D } from 'react-force-graph';
import { Device } from '@/types/api';
import { iconDictionary } from './IconMapping';

interface GraphNode {
    id: string;
    name: string;
    type: string;
    status: string;
    val: number;
    icon: JSX.Element | null;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
    location?: { lat: number; lng: number };
}

interface GraphLink {
    source: string;
    target: string;
    type: string;
    animated: boolean;
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

interface ForceGraphComponentProps {
    graphData: GraphData;
    containerRef: React.RefObject<HTMLDivElement>;
    onNodeClick: (node: any) => void;
    getNodeColor: (node: GraphNode) => string;
}

export const ForceGraphComponent = ({ 
    graphData, 
    containerRef, 
    onNodeClick, 
    getNodeColor 
}: ForceGraphComponentProps) => {
    const constrainNode = (node: GraphNode) => {
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const padding = 50;

        const minX = padding;
        const maxX = containerRect.width - padding;
        const minY = padding;
        const maxY = containerRect.height - padding;

        if (node.x !== undefined) {
            node.x = Math.max(minX, Math.min(maxX, node.x));
            node.fx = node.x;
        }
        if (node.y !== undefined) {
            node.y = Math.max(minY, Math.min(maxY, node.y));
            node.fy = node.y;
        }
    };

    return (
        <ForceGraph2D
            graphData={graphData}
            nodeLabel="name"
            nodeColor={getNodeColor}
            linkColor={() => '#e5e7eb'}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
                constrainNode(node);
                
                // Draw node background
                const size = 30;
                ctx.beginPath();
                ctx.fillStyle = getNodeColor(node);
                ctx.arc(node.x, node.y, size/2, 0, 2 * Math.PI);
                ctx.fill();

                // Draw node border
                ctx.strokeStyle = '#e5e7eb';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw node label
                const label = node.name;
                const fontSize = 12/globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillStyle = '#000000';
                ctx.fillText(label, node.x, node.y + size);

                // Draw status indicator
                const statusRadius = 4;
                ctx.beginPath();
                ctx.fillStyle = node.status === 'online' ? '#22c55e' : '#ef4444';
                ctx.arc(node.x + size/2, node.y - size/2, statusRadius, 0, 2 * Math.PI);
                ctx.fill();
            }}
            nodePointerAreaPaint={(node: any, color, ctx) => {
                ctx.fillStyle = color;
                const size = 30;
                ctx.beginPath();
                ctx.arc(node.x, node.y, size/2, 0, 2 * Math.PI);
                ctx.fill();
            }}
            cooldownTicks={50}
            onNodeClick={onNodeClick}
            onNodeDragEnd={(node: GraphNode) => {
                node.fx = node.x;
                node.fy = node.y;
            }}
            width={containerRef.current?.clientWidth}
            height={containerRef.current?.clientHeight}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.005}
            d3AlphaDecay={0.1}
            d3VelocityDecay={0.4}
            linkWidth={2}
            linkCurvature={0.25}
        />
    );
};
