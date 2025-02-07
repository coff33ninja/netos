import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface MonitoringConfigProps {
    config: any;
    onConfigChange: (config: any) => void;
}

export function MonitoringConfig({ config, onConfigChange }: MonitoringConfigProps) {
    const addCustomMetric = () => {
        const newMetrics = [...(config.monitoring?.metrics?.custom || []), ""];
        onConfigChange({
            monitoring: {
                ...config.monitoring,
                metrics: {
                    ...config.monitoring?.metrics,
                    custom: newMetrics,
                },
            },
        });
    };

    const removeCustomMetric = (index: number) => {
        const newMetrics = config.monitoring?.metrics?.custom?.filter(
            (_: any, i: number) => i !== index
        );
        onConfigChange({
            monitoring: {
                ...config.monitoring,
                metrics: {
                    ...config.monitoring?.metrics,
                    custom: newMetrics,
                },
            },
        });
    };

    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="monitoringEnabled" className="text-right">
                    Enable Monitoring
                </Label>
                <div className="col-span-3 flex items-center space-x-4">
                    <Switch
                        id="monitoringEnabled"
                        checked={config.monitoring?.enabled}
                        onCheckedChange={(checked) =>
                            onConfigChange({
                                monitoring: { ...config.monitoring, enabled: checked },
                            })
                        }
                    />
                    <Label htmlFor="monitoringEnabled">
                        Collect metrics and logs
                    </Label>
                </div>
            </div>

            {config.monitoring?.enabled && (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Basic Metrics</Label>
                        <div className="col-span-3 space-y-2">
                            <div className="flex items-center space-x-4">
                                <Switch
                                    id="cpuMetrics"
                                    checked={config.monitoring?.metrics?.cpu}
                                    onCheckedChange={(checked) =>
                                        onConfigChange({
                                            monitoring: {
                                                ...config.monitoring,
                                                metrics: {
                                                    ...config.monitoring?.metrics,
                                                    cpu: checked,
                                                },
                                            },
                                        })
                                    }
                                />
                                <Label htmlFor="cpuMetrics">CPU Usage</Label>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Switch
                                    id="memoryMetrics"
                                    checked={config.monitoring?.metrics?.memory}
                                    onCheckedChange={(checked) =>
                                        onConfigChange({
                                            monitoring: {
                                                ...config.monitoring,
                                                metrics: {
                                                    ...config.monitoring?.metrics,
                                                    memory: checked,
                                                },
                                            },
                                        })
                                    }
                                />
                                <Label htmlFor="memoryMetrics">Memory Usage</Label>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Switch
                                    id="diskMetrics"
                                    checked={config.monitoring?.metrics?.disk}
                                    onCheckedChange={(checked) =>
                                        onConfigChange({
                                            monitoring: {
                                                ...config.monitoring,
                                                metrics: {
                                                    ...config.monitoring?.metrics,
                                                    disk: checked,
                                                },
                                            },
                                        })
                                    }
                                />
                                <Label htmlFor="diskMetrics">Disk Usage</Label>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Switch
                                    id="networkMetrics"
                                    checked={config.monitoring?.metrics?.network}
                                    onCheckedChange={(checked) =>
                                        onConfigChange({
                                            monitoring: {
                                                ...config.monitoring,
                                                metrics: {
                                                    ...config.monitoring?.metrics,
                                                    network: checked,
                                                },
                                            },
                                        })
                                    }
                                />
                                <Label htmlFor="networkMetrics">Network Traffic</Label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Custom Metrics</Label>
                        <div className="col-span-3 space-y-2">
                            {config.monitoring?.metrics?.custom?.map(
                                (metric: string, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2"
                                    >
                                        <Input
                                            value={metric}
                                            onChange={(e) => {
                                                const newMetrics = [
                                                    ...config.monitoring.metrics.custom,
                                                ];
                                                newMetrics[index] = e.target.value;
                                                onConfigChange({
                                                    monitoring: {
                                                        ...config.monitoring,
                                                        metrics: {
                                                            ...config.monitoring.metrics,
                                                            custom: newMetrics,
                                                        },
                                                    },
                                                });
                                            }}
                                            placeholder="Metric name"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeCustomMetric(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={addCustomMetric}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Custom Metric
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="metricsRetention" className="text-right">
                            Metrics Retention
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="metricsRetention"
                                type="number"
                                value={config.monitoring?.retention?.metricsRetentionDays}
                                onChange={(e) =>
                                    onConfigChange({
                                        monitoring: {
                                            ...config.monitoring,
                                            retention: {
                                                ...config.monitoring?.retention,
                                                metricsRetentionDays: parseInt(e.target.value),
                                            },
                                        },
                                    })
                                }
                                placeholder="Days to keep metrics"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="logsRetention" className="text-right">
                            Logs Retention
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="logsRetention"
                                type="number"
                                value={config.monitoring?.retention?.logsRetentionDays}
                                onChange={(e) =>
                                    onConfigChange({
                                        monitoring: {
                                            ...config.monitoring,
                                            retention: {
                                                ...config.monitoring?.retention,
                                                logsRetentionDays: parseInt(e.target.value),
                                            },
                                        },
                                    })
                                }
                                placeholder="Days to keep logs"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}