
import { NetworkMap } from "@/components/network/NetworkMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import type { Device } from "@/types/api";

// Template devices for network topology
const templateDevices: Device[] = [
    { 
        id: "d1", 
        name: "Router 1", 
        type: "router", 
        status: "online",
        ip: "192.168.1.1",
        mac: "00:11:22:33:44:55",
        manufacturer: "Cisco",
        lastSeen: new Date().toISOString(),
        firstSeen: new Date().toISOString()
    },
    { 
        id: "d2", 
        name: "Switch 1", 
        type: "switch", 
        status: "online",
        ip: "192.168.1.2",
        mac: "00:11:22:33:44:56",
        manufacturer: "Juniper",
        lastSeen: new Date().toISOString(),
        firstSeen: new Date().toISOString()
    },
    { 
        id: "d3", 
        name: "Server 1", 
        type: "server", 
        status: "online",
        ip: "192.168.1.3",
        mac: "00:11:22:33:44:57",
        manufacturer: "Dell",
        lastSeen: new Date().toISOString(),
        firstSeen: new Date().toISOString()
    },
    { 
        id: "d4", 
        name: "Router 2", 
        type: "router", 
        status: "offline",
        ip: "192.168.1.4",
        mac: "00:11:22:33:44:58",
        manufacturer: "Cisco",
        lastSeen: new Date().toISOString(),
        firstSeen: new Date().toISOString()
    },
];

export default function NetworkTopologyPage() {
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Network Overview</h1>
            </div>

            <Card className="h-[800px]">
                <CardHeader className="border-b">
                    <CardTitle>Network Topology</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="h-full">
                        <NetworkMap networkDevices={templateDevices} />
                    </div>
                </CardContent>
            </Card>

            {selectedDevice && (
                <Card>
                    <CardHeader className="border-b">
                        <CardTitle>Device Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid gap-4 md:grid-cols-3">
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
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
