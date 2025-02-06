
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PowerDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onPowerAction: (action: 'start' | 'stop' | 'restart') => void;
}

export const PowerDialog = ({
    isOpen,
    onOpenChange,
    onPowerAction,
}: PowerDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Power Actions</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-2">
                    <Button onClick={() => onPowerAction('start')}>
                        Start
                    </Button>
                    <Button onClick={() => onPowerAction('stop')}>
                        Stop
                    </Button>
                    <Button onClick={() => onPowerAction('restart')}>
                        Restart
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
