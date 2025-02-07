import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { nodeScanService } from "@/services/nodeScanService";
import { useToast } from "@/hooks/use-toast";
import { Node } from "@/types/network";

interface ScanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  node: Node;
}

export function ScanDialog({ isOpen, onOpenChange, node }: ScanDialogProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanRange, setScanRange] = useState("");
  const { toast } = useToast();

  const handleStartScan = async () => {
    try {
      setIsScanning(true);
      const scanId = await nodeScanService.startScan({
        nodeId: node.id,
        scanRange: scanRange || undefined
      });

      toast({
        title: "Scan Started",
        description: `Network scan initiated from node ${node.name}`,
      });

      // Close dialog after starting scan
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Failed to start network scan",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Network Scan</DialogTitle>
          <DialogDescription>
            Start a network scan from node {node.name} to discover devices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="scanRange" className="col-span-4">
              Scan Range (optional)
            </Label>
            <Input
              id="scanRange"
              placeholder="192.168.1.0/24"
              className="col-span-4"
              value={scanRange}
              onChange={(e) => setScanRange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleStartScan}
            disabled={isScanning}
          >
            {isScanning ? "Starting Scan..." : "Start Scan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}