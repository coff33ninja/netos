import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { NodeConfig } from "@/types/network";

interface EditNodeDialogProps {
    node: NodeConfig | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSave?: (node: NodeConfig) => void;
}

export function EditNodeDialog({
    node,
    isOpen,
    onOpenChange,
    onSave,
}: EditNodeDialogProps) {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        type: "Secondary",
        location: "",
        port: "",
        primaryNodeUrl: "",
    });

    useEffect(() => {
        if (node) {
            setFormData({
                name: node.name,
                type: node.type,
                location: node.location,
                port: node.port.toString(),
                primaryNodeUrl: node.primaryNodeUrl || "",
            });
        }
    }, [node]);

    const handleSave = () => {
        if (!node) return;

        if (!formData.name) {
            toast({
                title: "Validation Error",
                description: "Node name is required",
                variant: "destructive",
            });
            return;
        }

        if (formData.type !== "Primary" && !formData.primaryNodeUrl) {
            toast({
                title: "Validation Error",
                description: "Primary Node URL is required for Secondary/Backup nodes",
                variant: "destructive",
            });
            return;
        }

        const updatedNode: NodeConfig = {
            ...node,
            name: formData.name,
            type: formData.type as "Primary" | "Secondary" | "Backup",
            location: formData.location,
            port: parseInt(formData.port),
            primaryNodeUrl: formData.type !== "Primary" ? formData.primaryNodeUrl : undefined,
        };

        onSave?.(updatedNode);
        onOpenChange(false);
    };

    if (!node) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Node</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Node Name
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Node Type
                        </Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) =>
                                setFormData({ ...formData, type: value })
                            }
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Primary">Primary</SelectItem>
                                <SelectItem value="Secondary">Secondary</SelectItem>
                                <SelectItem value="Backup">Backup</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">
                            Location
                        </Label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) =>
                                setFormData({ ...formData, location: e.target.value })
                            }
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="port" className="text-right">
                            Port
                        </Label>
                        <Input
                            id="port"
                            type="number"
                            value={formData.port}
                            onChange={(e) =>
                                setFormData({ ...formData, port: e.target.value })
                            }
                            className="col-span-3"
                        />
                    </div>

                    {formData.type !== "Primary" && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="primaryNodeUrl" className="text-right">
                                Primary Node URL
                            </Label>
                            <Input
                                id="primaryNodeUrl"
                                value={formData.primaryNodeUrl}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        primaryNodeUrl: e.target.value,
                                    })
                                }
                                placeholder="https://primary-node:3001"
                                className="col-span-3"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}