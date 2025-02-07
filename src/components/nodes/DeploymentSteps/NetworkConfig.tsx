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

interface NetworkConfigProps {
    config: any;
    onConfigChange: (config: any) => void;
}

export function NetworkConfig({ config, onConfigChange }: NetworkConfigProps) {
    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="networkInterface" className="text-right">
                    Network Interface
                </Label>
                <Input
                    id="networkInterface"
                    value={config.networkInterface}
                    onChange={(e) =>
                        onConfigChange({ networkInterface: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="eth0"
                />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subnetMask" className="text-right">
                    Subnet Mask
                </Label>
                <Input
                    id="subnetMask"
                    value={config.subnetMask}
                    onChange={(e) =>
                        onConfigChange({ subnetMask: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="255.255.255.0"
                />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gateway" className="text-right">
                    Gateway
                </Label>
                <Input
                    id="gateway"
                    value={config.gateway}
                    onChange={(e) =>
                        onConfigChange({ gateway: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="192.168.1.1"
                />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dns" className="text-right">
                    DNS Servers
                </Label>
                <Input
                    id="dns"
                    value={config.dns.join(", ")}
                    onChange={(e) =>
                        onConfigChange({
                            dns: e.target.value.split(",").map((s) => s.trim()),
                        })
                    }
                    className="col-span-3"
                    placeholder="8.8.8.8, 8.8.4.4"
                />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="useVPN" className="text-right">
                    Use VPN
                </Label>
                <div className="col-span-3 flex items-center space-x-4">
                    <Switch
                        id="useVPN"
                        checked={config.useVPN}
                        onCheckedChange={(checked) =>
                            onConfigChange({ useVPN: checked })
                        }
                    />
                    <Label htmlFor="useVPN">Enable VPN Connection</Label>
                </div>
            </div>

            {config.useVPN && (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="vpnProvider" className="text-right">
                            VPN Provider
                        </Label>
                        <Select
                            value={config.vpnConfig?.provider}
                            onValueChange={(value) =>
                                onConfigChange({
                                    vpnConfig: {
                                        ...config.vpnConfig,
                                        provider: value,
                                    },
                                })
                            }
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select VPN provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="wireguard">WireGuard</SelectItem>
                                <SelectItem value="openvpn">OpenVPN</SelectItem>
                                <SelectItem value="tailscale">Tailscale</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="vpnAuthKey" className="text-right">
                            Auth Key
                        </Label>
                        <Input
                            id="vpnAuthKey"
                            type="password"
                            value={config.vpnConfig?.authKey}
                            onChange={(e) =>
                                onConfigChange({
                                    vpnConfig: {
                                        ...config.vpnConfig,
                                        authKey: e.target.value,
                                    },
                                })
                            }
                            className="col-span-3"
                            placeholder="Enter VPN authentication key"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="vpnRegion" className="text-right">
                            Region
                        </Label>
                        <Input
                            id="vpnRegion"
                            value={config.vpnConfig?.region}
                            onChange={(e) =>
                                onConfigChange({
                                    vpnConfig: {
                                        ...config.vpnConfig,
                                        region: e.target.value,
                                    },
                                })
                            }
                            className="col-span-3"
                            placeholder="us-east-1"
                        />
                    </div>
                </>
            )}
        </div>
    );
}