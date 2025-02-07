
import { NetworkMap } from "@/components/network/NetworkMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import type { Device } from "@/types/api";

// Enhanced template devices for complex network topology
const templateDevices: Device[] = [
    { 
        id: "gateway", 
        name: "Main Gateway", 
        type: "router", 
        status: "online",
        ip: "192.168.1.1",
        mac: "00:11:22:33:44:55",
        manufacturer: "Cisco",
        lastSeen: new Date().toISOString(),
        firstSeen: new Date().toISOString()
    },
    { 
        id: "switch1", 
        name: "Core Switch", 
        type: "switch", 
        status: "online",
        ip: "192.168.1.2",
        mac: "00:11:22:33:44:56",
        manufacturer: "Juniper",
        lastSeen: new Date().toISOString(),
        firstSeen: new Date().toISOString()
    },
    { 
        id: "server1", 
        name: "Application Server", 
        type: "server", 
        status: "online",
        ip: "192.168.1.3",
        mac: "00:11:22:33:44:57",
        manufacturer: "Dell",
        lastSeen: new Date().toISOString(),
        firstSeen: new Date().toISOString()
    },
    { 
        id: "router2", 
        name: "Distribution Router", 
        type: "router", 
        status: "online",
        ip: "192.168.1.4",
        mac: "00:11:22:33:44:58",
        manufacturer: "Cisco",
        lastSeen: new Date().toISOString(),
        firstSeen: new Date().toISOString()
    },
    { 
        id: "switch2", 
        name: "Access Switch", 
        type: "switch", 
        status: "online",
        ip: "192.168.1.5",
        mac: "00:11:22:33:44:59",
        manufacturer: "HP",
        lastSeen: new Date().toISOString(),
        firstSeen: new Date().toISOString()
    },
    { 
        id: "ap1", 
        name: "Wireless AP", 
        type: "access-point", 
        status: "online",
        ip: "192.168.1.6",
        mac: "00:11:22:33:44:60",
        manufacturer: "Ubiquiti",
        lastSeen: new Date().toISOString(),
        firstSeen: new Date().toISOString()
    }
];

export default function NetworkTopologyPage() {
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

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
                            networkDevices={templateDevices} 
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
