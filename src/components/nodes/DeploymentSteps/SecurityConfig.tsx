import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface SecurityConfigProps {
    config: any;
    onConfigChange: (config: any) => void;
}

export function SecurityConfig({ config, onConfigChange }: SecurityConfigProps) {
    const addInboundRule = () => {
        const newRules = [
            ...(config.firewallRules?.inbound || []),
            { port: "", protocol: "tcp", source: "", description: "" },
        ];
        onConfigChange({
            firewallRules: { ...config.firewallRules, inbound: newRules },
        });
    };

    const addOutboundRule = () => {
        const newRules = [
            ...(config.firewallRules?.outbound || []),
            { port: "", protocol: "tcp", destination: "", description: "" },
        ];
        onConfigChange({
            firewallRules: { ...config.firewallRules, outbound: newRules },
        });
    };

    const removeInboundRule = (index: number) => {
        const newRules = config.firewallRules.inbound.filter((_: any, i: number) => i !== index);
        onConfigChange({
            firewallRules: { ...config.firewallRules, inbound: newRules },
        });
    };

    const removeOutboundRule = (index: number) => {
        const newRules = config.firewallRules.outbound.filter((_: any, i: number) => i !== index);
        onConfigChange({
            firewallRules: { ...config.firewallRules, outbound: newRules },
        });
    };

    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sslType" className="text-right">
                    SSL Certificate
                </Label>
                <Select
                    value={config.sslCertificate?.type}
                    onValueChange={(value) =>
                        onConfigChange({
                            sslCertificate: { ...config.sslCertificate, type: value },
                        })
                    }
                >
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select certificate type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="self-signed">Self-signed</SelectItem>
                        <SelectItem value="lets-encrypt">Let's Encrypt</SelectItem>
                        <SelectItem value="custom">Custom Certificate</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {config.sslCertificate?.type === "lets-encrypt" && (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="domain" className="text-right">
                            Domain
                        </Label>
                        <Input
                            id="domain"
                            value={config.sslCertificate?.domain}
                            onChange={(e) =>
                                onConfigChange({
                                    sslCertificate: {
                                        ...config.sslCertificate,
                                        domain: e.target.value,
                                    },
                                })
                            }
                            className="col-span-3"
                            placeholder="example.com"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={config.sslCertificate?.email}
                            onChange={(e) =>
                                onConfigChange({
                                    sslCertificate: {
                                        ...config.sslCertificate,
                                        email: e.target.value,
                                    },
                                })
                            }
                            className="col-span-3"
                            placeholder="admin@example.com"
                        />
                    </div>
                </>
            )}

            {config.sslCertificate?.type === "custom" && (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="certPath" className="text-right">
                            Certificate Path
                        </Label>
                        <Input
                            id="certPath"
                            value={config.sslCertificate?.customCertPath}
                            onChange={(e) =>
                                onConfigChange({
                                    sslCertificate: {
                                        ...config.sslCertificate,
                                        customCertPath: e.target.value,
                                    },
                                })
                            }
                            className="col-span-3"
                            placeholder="/path/to/certificate.crt"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="keyPath" className="text-right">
                            Key Path
                        </Label>
                        <Input
                            id="keyPath"
                            value={config.sslCertificate?.customKeyPath}
                            onChange={(e) =>
                                onConfigChange({
                                    sslCertificate: {
                                        ...config.sslCertificate,
                                        customKeyPath: e.target.value,
                                    },
                                })
                            }
                            className="col-span-3"
                            placeholder="/path/to/private.key"
                        />
                    </div>
                </>
            )}

            <div className="grid grid-cols-4 items-center gap-4 mt-6">
                <Label className="text-right col-span-4 font-semibold">
                    Inbound Firewall Rules
                </Label>
            </div>

            {config.firewallRules?.inbound?.map((rule: any, index: number) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <Input
                        value={rule.port}
                        onChange={(e) => {
                            const newRules = [...config.firewallRules.inbound];
                            newRules[index] = { ...rule, port: e.target.value };
                            onConfigChange({
                                firewallRules: { ...config.firewallRules, inbound: newRules },
                            });
                        }}
                        className="col-span-2"
                        placeholder="Port"
                    />
                    <Select
                        value={rule.protocol}
                        onValueChange={(value) => {
                            const newRules = [...config.firewallRules.inbound];
                            newRules[index] = { ...rule, protocol: value };
                            onConfigChange({
                                firewallRules: { ...config.firewallRules, inbound: newRules },
                            });
                        }}
                    >
                        <SelectTrigger className="col-span-2">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tcp">TCP</SelectItem>
                            <SelectItem value="udp">UDP</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        value={rule.source}
                        onChange={(e) => {
                            const newRules = [...config.firewallRules.inbound];
                            newRules[index] = { ...rule, source: e.target.value };
                            onConfigChange({
                                firewallRules: { ...config.firewallRules, inbound: newRules },
                            });
                        }}
                        className="col-span-3"
                        placeholder="Source"
                    />
                    <Input
                        value={rule.description}
                        onChange={(e) => {
                            const newRules = [...config.firewallRules.inbound];
                            newRules[index] = { ...rule, description: e.target.value };
                            onConfigChange({
                                firewallRules: { ...config.firewallRules, inbound: newRules },
                            });
                        }}
                        className="col-span-4"
                        placeholder="Description"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInboundRule(index)}
                        className="col-span-1"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}

            <Button
                variant="outline"
                size="sm"
                onClick={addInboundRule}
                className="mt-2"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Inbound Rule
            </Button>

            <div className="grid grid-cols-4 items-center gap-4 mt-6">
                <Label className="text-right col-span-4 font-semibold">
                    Outbound Firewall Rules
                </Label>
            </div>

            {config.firewallRules?.outbound?.map((rule: any, index: number) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <Input
                        value={rule.port}
                        onChange={(e) => {
                            const newRules = [...config.firewallRules.outbound];
                            newRules[index] = { ...rule, port: e.target.value };
                            onConfigChange({
                                firewallRules: { ...config.firewallRules, outbound: newRules },
                            });
                        }}
                        className="col-span-2"
                        placeholder="Port"
                    />
                    <Select
                        value={rule.protocol}
                        onValueChange={(value) => {
                            const newRules = [...config.firewallRules.outbound];
                            newRules[index] = { ...rule, protocol: value };
                            onConfigChange({
                                firewallRules: { ...config.firewallRules, outbound: newRules },
                            });
                        }}
                    >
                        <SelectTrigger className="col-span-2">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tcp">TCP</SelectItem>
                            <SelectItem value="udp">UDP</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        value={rule.destination}
                        onChange={(e) => {
                            const newRules = [...config.firewallRules.outbound];
                            newRules[index] = { ...rule, destination: e.target.value };
                            onConfigChange({
                                firewallRules: { ...config.firewallRules, outbound: newRules },
                            });
                        }}
                        className="col-span-3"
                        placeholder="Destination"
                    />
                    <Input
                        value={rule.description}
                        onChange={(e) => {
                            const newRules = [...config.firewallRules.outbound];
                            newRules[index] = { ...rule, description: e.target.value };
                            onConfigChange({
                                firewallRules: { ...config.firewallRules, outbound: newRules },
                            });
                        }}
                        className="col-span-4"
                        placeholder="Description"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOutboundRule(index)}
                        className="col-span-1"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}

            <Button
                variant="outline"
                size="sm"
                onClick={addOutboundRule}
                className="mt-2"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Outbound Rule
            </Button>
        </div>
    );
}