
import { NetworkMap } from "@/components/network/NetworkMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import type { Device } from "@/types/api";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function NetworkTopologyPage() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const getDevices = async () => {
            try {
                setLoading(true);
                const fetchedDevices = await api.fetchDevices();
                setDevices(fetchedDevices);
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

    const sortedDevices = devices.sort((a, b) => a.type.localeCompare(b.type));

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Network Topology</h1>
            </div>

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

            {selectedDevice && (
                <Card>
                    <CardHeader className="border-b">
                        <CardTitle>Device Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground">Name</div>
                                <div>{selectedDevice.name}</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground">Status</div>
                                <div>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            selectedDevice.status === "online"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {selectedDevice.status}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground">IP Address</div>
                                <div>{selectedDevice.ip}</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground">Manufacturer</div>
                                <div>{selectedDevice.manufacturer}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
