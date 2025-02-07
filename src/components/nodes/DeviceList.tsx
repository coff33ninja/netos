import { Device } from "@/types/network";
import { Badge } from "@/components/ui/badge";

interface DeviceListProps {
    devices: Device[];
}

export function DeviceList({ devices }: DeviceListProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {devices.map((device) => (
                <Badge
                    key={device.id}
                    variant="secondary"
                    className="text-xs"
                    title={`Type: ${device.type}\nStatus: ${device.status}`}
                >
                    {device.name}
                </Badge>
            ))}
        </div>
    );
}