import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Node } from "@/types/network";
import { useState } from "react";

interface ManageNodeDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    node: Node | null;
}

export const ManageNodeDialog = ({
    isOpen,
    onOpenChange,
    node,
}: ManageNodeDialogProps) => {
    const [autoScan, setAutoScan] = useState(false);
    const [monitoringInterval, setMonitoringInterval] = useState("5");
    const [customScript, setCustomScript] = useState("");

    if (!node) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Manage Node: {node.name}</DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="monitoring" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                        <TabsTrigger value="automation">Automation</TabsTrigger>
                        <TabsTrigger value="scripts">Scripts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="monitoring" className="space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Monitoring Interval (minutes)</Label>
                                <Input 
                                    type="number" 
                                    value={monitoringInterval}
                                    onChange={(e) => setMonitoringInterval(e.target.value)}
                                    className="w-20"
                                    min="1"
                                    max="60"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Auto-scan network</Label>
                                <Switch 
                                    checked={autoScan}
                                    onCheckedChange={setAutoScan}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="automation" className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Alert Conditions</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" className="justify-start">
                                        CPU Usage &gt; 90%
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        Memory Usage &gt; 80%
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        Network Latency &gt; 100ms
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        + Add Condition
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Automated Actions</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" className="justify-start">
                                        Restart Service
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        Send Alert
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        Run Backup
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        + Add Action
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="scripts" className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Custom Scripts</Label>
                                <textarea
                                    value={customScript}
                                    onChange={(e) => setCustomScript(e.target.value)}
                                    className="w-full h-32 p-2 border rounded-md"
                                    placeholder="Enter custom script..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline">Load Template</Button>
                                <Button variant="outline">Save Script</Button>
                            </div>
                            <div className="space-y-2">
                                <Label>Scheduled Scripts</Label>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start">
                                        Daily Maintenance (00:00)
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        Weekly Backup (Sun 02:00)
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        + Schedule New Script
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};