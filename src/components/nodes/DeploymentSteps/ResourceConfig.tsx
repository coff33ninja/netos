import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ResourceConfigProps {
    config: any;
    onConfigChange: (config: any) => void;
}

export function ResourceConfig({ config, onConfigChange }: ResourceConfigProps) {
    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cpuLimit" className="text-right">
                    CPU Limit
                </Label>
                <Input
                    id="cpuLimit"
                    type="number"
                    value={config.resources?.cpu?.limit}
                    onChange={(e) =>
                        onConfigChange({
                            resources: {
                                ...config.resources,
                                cpu: {
                                    ...config.resources?.cpu,
                                    limit: parseFloat(e.target.value),
                                },
                            },
                        })
                    }
                    className="col-span-3"
                    placeholder="CPU cores (e.g., 1)"
                />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cpuRequest" className="text-right">
                    CPU Request
                </Label>
                <Input
                    id="cpuRequest"
                    type="number"
                    value={config.resources?.cpu?.request}
                    onChange={(e) =>
                        onConfigChange({
                            resources: {
                                ...config.resources,
                                cpu: {
                                    ...config.resources?.cpu,
                                    request: parseFloat(e.target.value),
                                },
                            },
                        })
                    }
                    className="col-span-3"
                    placeholder="CPU cores (e.g., 0.5)"
                />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="memoryLimit" className="text-right">
                    Memory Limit
                </Label>
                <Input
                    id="memoryLimit"
                    type="number"
                    value={config.resources?.memory?.limit}
                    onChange={(e) =>
                        onConfigChange({
                            resources: {
                                ...config.resources,
                                memory: {
                                    ...config.resources?.memory,
                                    limit: parseInt(e.target.value),
                                },
                            },
                        })
                    }
                    className="col-span-3"
                    placeholder="Memory in MB (e.g., 1024)"
                />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="memoryRequest" className="text-right">
                    Memory Request
                </Label>
                <Input
                    id="memoryRequest"
                    type="number"
                    value={config.resources?.memory?.request}
                    onChange={(e) =>
                        onConfigChange({
                            resources: {
                                ...config.resources,
                                memory: {
                                    ...config.resources?.memory,
                                    request: parseInt(e.target.value),
                                },
                            },
                        })
                    }
                    className="col-span-3"
                    placeholder="Memory in MB (e.g., 512)"
                />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="storageSize" className="text-right">
                    Storage Size
                </Label>
                <Input
                    id="storageSize"
                    type="number"
                    value={config.resources?.storage?.size}
                    onChange={(e) =>
                        onConfigChange({
                            resources: {
                                ...config.resources,
                                storage: {
                                    ...config.resources?.storage,
                                    size: parseInt(e.target.value),
                                },
                            },
                        })
                    }
                    className="col-span-3"
                    placeholder="Storage in GB (e.g., 10)"
                />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="storageClass" className="text-right">
                    Storage Class
                </Label>
                <Select
                    value={config.resources?.storage?.class}
                    onValueChange={(value) =>
                        onConfigChange({
                            resources: {
                                ...config.resources,
                                storage: {
                                    ...config.resources?.storage,
                                    class: value,
                                },
                            },
                        })
                    }
                >
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select storage class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="fast">Fast</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="autoScaling" className="text-right">
                    Auto Scaling
                </Label>
                <div className="col-span-3 flex items-center space-x-4">
                    <Switch
                        id="autoScaling"
                        checked={config.resources?.autoScaling?.enabled}
                        onCheckedChange={(checked) =>
                            onConfigChange({
                                resources: {
                                    ...config.resources,
                                    autoScaling: {
                                        ...config.resources?.autoScaling,
                                        enabled: checked,
                                    },
                                },
                            })
                        }
                    />
                    <Label htmlFor="autoScaling">Enable Auto Scaling</Label>
                </div>
            </div>

            {config.resources?.autoScaling?.enabled && (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="minReplicas" className="text-right">
                            Min Replicas
                        </Label>
                        <Input
                            id="minReplicas"
                            type="number"
                            value={config.resources?.autoScaling?.minReplicas}
                            onChange={(e) =>
                                onConfigChange({
                                    resources: {
                                        ...config.resources,
                                        autoScaling: {
                                            ...config.resources?.autoScaling,
                                            minReplicas: parseInt(e.target.value),
                                        },
                                    },
                                })
                            }
                            className="col-span-3"
                            placeholder="Minimum number of replicas"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="maxReplicas" className="text-right">
                            Max Replicas
                        </Label>
                        <Input
                            id="maxReplicas"
                            type="number"
                            value={config.resources?.autoScaling?.maxReplicas}
                            onChange={(e) =>
                                onConfigChange({
                                    resources: {
                                        ...config.resources,
                                        autoScaling: {
                                            ...config.resources?.autoScaling,
                                            maxReplicas: parseInt(e.target.value),
                                        },
                                    },
                                })
                            }
                            className="col-span-3"
                            placeholder="Maximum number of replicas"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="targetCPU" className="text-right">
                            Target CPU %
                        </Label>
                        <Input
                            id="targetCPU"
                            type="number"
                            value={config.resources?.autoScaling?.targetCPUUtilization}
                            onChange={(e) =>
                                onConfigChange({
                                    resources: {
                                        ...config.resources,
                                        autoScaling: {
                                            ...config.resources?.autoScaling,
                                            targetCPUUtilization: parseInt(e.target.value),
                                        },
                                    },
                                })
                            }
                            className="col-span-3"
                            placeholder="Target CPU utilization percentage"
                        />
                    </div>
                </>
            )}
        </div>
    );
}