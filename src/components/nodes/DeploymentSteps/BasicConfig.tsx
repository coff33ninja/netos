import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface BasicConfigProps {
    config: any;
    onConfigChange: (config: any) => void;
}

export function BasicConfig({ config, onConfigChange }: BasicConfigProps) {
    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                    Node Name
                </Label>
                <Input
                    id="name"
                    value={config.name}
                    onChange={(e) =>
                        onConfigChange({ name: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="my-node-01"
                />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                    Node Type
                </Label>
                <Select
                    value={config.type}
                    onValueChange={(value) =>
                        onConfigChange({ type: value })
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
                    value={config.location}
                    onChange={(e) =>
                        onConfigChange({ location: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="us-east-1"
                />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="port" className="text-right">
                    Port
                </Label>
                <Input
                    id="port"
                    type="number"
                    value={config.port}
                    onChange={(e) =>
                        onConfigChange({ port: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="3001"
                />
            </div>

            {config.type !== "Primary" && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="primaryNodeUrl" className="text-right">
                        Primary Node URL
                    </Label>
                    <Input
                        id="primaryNodeUrl"
                        value={config.primaryNodeUrl}
                        onChange={(e) =>
                            onConfigChange({ primaryNodeUrl: e.target.value })
                        }
                        className="col-span-3"
                        placeholder="https://primary-node:3001"
                    />
                </div>
            )}
        </div>
    );
}