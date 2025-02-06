
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Node } from "@/types/network";

interface ConsoleDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedNode: Node | null;
    consoleOutput: string[];
    onCommand: (command: string) => void;
}

export const ConsoleDialog = ({
    isOpen,
    onOpenChange,
    selectedNode,
    consoleOutput,
    onCommand,
}: ConsoleDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Console - {selectedNode?.name}</DialogTitle>
                </DialogHeader>
                <div className="bg-black text-green-500 p-4 rounded-md font-mono text-sm h-[300px] overflow-y-auto">
                    {consoleOutput.map((line, index) => (
                        <div key={index}>{line}</div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input 
                        placeholder="Enter command..."
                        className="font-mono"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onCommand(e.currentTarget.value);
                                e.currentTarget.value = '';
                            }
                        }}
                    />
                    <Button variant="secondary">Send</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
