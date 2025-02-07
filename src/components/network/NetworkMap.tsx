import { useEffect, useState, useRef, useMemo } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/services/api';
import type { Device } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { 
    RouterIcon,
    SwitchIcon,
    ServerIcon,
    PhoneIcon,
    PCIcon,
    RaspberryPiIcon,
    LaptopIcon,
    TabletIcon,
    PrinterIcon,
    CameraIcon,
    AccessPointIcon 
} from '@/components/icons';

interface IconDictionaryType {
    [key: string]: JSX.Element;
}

const iconDictionary: IconDictionaryType = {
    router: <RouterIcon />,
    switch: <SwitchIcon />,
    server: <ServerIcon />,
    phone: <PhoneIcon />,
    pc: <PCIcon />,
    'raspberry-pi': <RaspberryPiIcon />, // Using kebab-case for consistency
    laptop: <LaptopIcon />,
    tablet: <TabletIcon />,
    printer: <PrinterIcon />,
    camera: <CameraIcon />,
    'access-point': <AccessPointIcon /> // Using kebab-case for consistency
};

interface NetworkMapProps {
    networkDevices?: Device[];
    onDeviceSelect?: (device: Device | null) => void;
    selectedDevice?: Device | null;
}

interface GraphNode {
    id: string;
    name: string;
    type: string;
    status: string;
    val: number;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
    location?: { lat: number; lng: number };
}

interface GraphLink {
    source: string;
    target: string;
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    zIndex: 0, // Ensure map stays behind the force graph
};

const defaultCenter = {
    lat: 0,
    lng: 0,
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [{ featureType: "all", elementType: "all", stylers: [{ saturation: -100 }] }]
};

export const NetworkMap = ({ networkDevices, onDeviceSelect, selectedDevice }: NetworkMapProps) => {
    const graphRef = useRef<any>();
    const { toast } = useToast();
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [mapsApiKey, setMapsApiKey] = useState("");
    const [mapError, setMapError] = useState<string | null>(null);
    const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setMapDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        const savedApiKey = localStorage.getItem('VITE_GOOGLE_MAPS_API_KEY');
        if (savedApiKey) {
            setMapsApiKey(savedApiKey);
        } else {
            setMapError('Google Maps API key not found. Please configure it in settings.');
        }
    }, []);

    const fetchDevices = async () => {
        try {
            if (networkDevices) {
                setDevices(networkDevices);
            } else {
                const data = await api.getAllDevices();
                setDevices(data);
            }
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
        if (networkDevices) {
            setDevices(networkDevices);
            setLoading(false);
        } else {
            fetchDevices();
            const interval = setInterval(fetchDevices, 30000);
            return () => clearInterval(interval);
        }
    }, [networkDevices]);

    const graphData = useMemo<GraphData>(() => {
        const nodes: GraphNode[] = devices.map(device => ({
            id: device.id,
            name: device.name,
            type: device.type,
            status: device.status,
            val: 1,
            // Adding mock location data - in real implementation this would come from the device
            location: {
                lat: Math.random() * 180 - 90,
                lng: Math.random() * 360 - 180
            }
        }));

        const links: GraphLink[] = [];
        if (devices.length > 0) {
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
        if (node.status === 'offline') return '#ef4444';
        switch (node.type.toLowerCase()) {
            case 'router':
                return '#3b82f6';
            case 'switch':
                return '#10b981';
            case 'server':
                return '#8b5cf6';
            default:
                return '#6b7280';
        }
    };

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
        <div ref={containerRef} className="h-full w-full relative">
            {loading ? (
                <div className="flex justify-center items-center h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <>
                    {mapError ? (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500">
                            {mapError}
                        </div>
                    ) : mapsApiKey ? (
                        <LoadScript
                            googleMapsApiKey={mapsApiKey}
                            onError={handleMapError}
                            onLoad={() => console.log('Google Maps Script loaded')}
                        >
                            <GoogleMap
                                mapContainerStyle={{
                                    ...mapContainerStyle,
                                    width: mapDimensions.width || '100%',
                                    height: mapDimensions.height || '100%'
                                }}
                                center={defaultCenter}
                                zoom={2}
                                options={mapOptions}
                                onLoad={handleMapLoad}
                            >
                                {/* Map content can go here */}
                            </GoogleMap>
                        </LoadScript>
                    ) : null}
                    <div className="absolute inset-0">
                        <ForceGraph2D
                            ref={graphRef}
                            graphData={graphData}
                            nodeLabel="name"
                            nodeColor={getNodeColor}
                            linkColor={() => '#e5e7eb'}
                            nodeCanvasObject={(node: any, ctx, globalScale) => {
                                constrainNode(node);
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
                            cooldownTicks={50}
                            onEngineStop={() => {
                                graphRef.current.zoomToFit(400, 50);
                            }}
                            onNodeClick={(node: any) => {
                                const device = devices.find(d => d.id === node.id);
                                if (device && onDeviceSelect) {
                                    onDeviceSelect(device);
                                }
                            }}
                            onNodeDragEnd={(node: GraphNode) => {
                                node.fx = node.x;
                                node.fy = node.y;
                            }}
                            width={containerRef.current?.clientWidth}
                            height={containerRef.current?.clientHeight}
                            d3AlphaDecay={0.1}
                            d3VelocityDecay={0.4}
                        />
                    </div>
                </>
            )}
        </div>
    );
};
