
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { NodeThresholds } from "@/types/network";

interface ConfigDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    thresholds: NodeThresholds;
    onThresholdChange: (type: keyof NodeThresholds, value: number) => void;
    onSave: () => void;
}

export const ConfigDialog = ({
    isOpen,
    onOpenChange,
    thresholds,
    onThresholdChange,
    onSave,
}: ConfigDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Node Configuration</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>CPU Threshold (%)</Label>
                        <Slider
                            value={[thresholds.cpu]}
                            onValueChange={(value) => onThresholdChange('cpu', value[0])}
                            max={100}
                            step={1}
                        />
                        <span className="text-sm text-muted-foreground">{thresholds.cpu}%</span>
                    </div>
                    <div className="space-y-2">
                        <Label>Memory Threshold (%)</Label>
                        <Slider
                            value={[thresholds.memory]}
                            onValueChange={(value) => onThresholdChange('memory', value[0])}
                            max={100}
                            step={1}
                        />
                        <span className="text-sm text-muted-foreground">{thresholds.memory}%</span>
                    </div>
                    <div className="space-y-2">
                        <Label>Disk Threshold (%)</Label>
                        <Slider
                            value={[thresholds.disk]}
                            onValueChange={(value) => onThresholdChange('disk', value[0])}
                            max={100}
                            step={1}
                        />
                        <span className="text-sm text-muted-foreground">{thresholds.disk}%</span>
                    </div>
                    <div className="space-y-2">
                        <Label>Network Threshold (%)</Label>
                        <Slider
                            value={[thresholds.network]}
                            onValueChange={(value) => onThresholdChange('network', value[0])}
                            max={100}
                            step={1}
                        />
                        <span className="text-sm text-muted-foreground">{thresholds.network}%</span>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={onSave}>
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
