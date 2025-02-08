
import { NetworkMap } from "@/components/network/NetworkMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import type { Device } from "@/types/api";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { DeviceGroupManager } from "@/components/network/DeviceGroupManager";
import { EnhancedDeviceDetails } from "@/components/network/EnhancedDeviceDetails";
import { DeviceGroup, EnhancedDevice } from "@/types/performance";

export default function NetworkTopologyPage() {
    const [devices, setDevices] = useState<EnhancedDevice[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<EnhancedDevice | null>(null);
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState<DeviceGroup[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const getDevices = async () => {
            try {
                setLoading(true);
                const fetchedDevices = await api.fetchDevices();
                // Transform to enhanced devices
                const enhancedDevices = fetchedDevices.map(device => ({
                    ...device,
                    tags: [],
                    performance: [],
                    history: []
                }));
                setDevices(enhancedDevices);
            } catch (error) {
                console.error('Error fetching devices:', error);
                toast({
                    title: "Error",
                    description: "Failed to fetch network devices",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        
        getDevices();
        
        // Fetch devices every 30 seconds
        const interval = setInterval(getDevices, 30000);
        return () => clearInterval(interval);
    }, [toast]);

    // Simulate performance data generation
    useEffect(() => {
        const generatePerformanceData = () => {
            setDevices(prevDevices => 
                prevDevices.map(device => ({
                    ...device,
                    performance: [
                        ...device.performance,
                        {
                            deviceId: device.id,
                            timestamp: new Date().toISOString(),
                            latency: Math.random() * 100,
                            packetLoss: Math.random() * 5,
                            bandwidth: Math.random() * 1000
                        }
                    ].slice(-20), // Keep last 20 readings
                }))
            );
        };

        const interval = setInterval(generatePerformanceData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleCreateGroup = (groupData: Omit<DeviceGroup, 'id'>) => {
        const newGroup: DeviceGroup = {
            ...groupData,
            id: `group-${Date.now()}`
        };
        setGroups(prev => [...prev, newGroup]);
    };

    const handleDeleteGroup = (groupId: string) => {
        setGroups(prev => prev.filter(g => g.id !== groupId));
        // Remove group from devices
        setDevices(prev => 
            prev.map(device => ({
                ...device,
                group: device.group === groupId ? undefined : device.group
            }))
        );
    };

    const handleAddDeviceToGroup = (groupId: string, deviceId: string) => {
        setGroups(prev => 
            prev.map(group => 
                group.id === groupId
                    ? { ...group, deviceIds: [...group.deviceIds, deviceId] }
                    : group
            )
        );
        setDevices(prev =>
            prev.map(device =>
                device.id === deviceId
                    ? { ...device, group: groupId }
                    : device
            )
        );
    };

    const sortedDevices = devices.sort((a, b) => a.type.localeCompare(b.type));

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Network Topology</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-[300px,1fr]">
                <DeviceGroupManager
                    groups={groups}
                    onCreateGroup={handleCreateGroup}
                    onDeleteGroup={handleDeleteGroup}
                    onAddDeviceToGroup={handleAddDeviceToGroup}
                />

                <Card className="h-[800px]">
                    <CardHeader className="border-b">
                        <CardTitle>Interactive Network Map</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-full">
                            <NetworkMap
                                networkDevices={sortedDevices}
                                onDeviceSelect={setSelectedDevice}
                                selectedDevice={selectedDevice}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {selectedDevice && (
                <EnhancedDeviceDetails device={selectedDevice} />
            )}
        </div>
    );
}
