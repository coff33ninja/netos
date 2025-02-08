
import { NetworkMap } from "@/components/network/NetworkMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import type { Device } from "@/types/api";
import { api } from "@/services/api";

export default function NetworkTopologyPage() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

    useEffect(() => {
        const getDevices = async () => {
            const fetchedDevices = await api.fetchDevices();
            setDevices(fetchedDevices);
        };
        getDevices();
    }, []);

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
