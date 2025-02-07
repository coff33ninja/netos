import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    MoreVertical,
    Edit,
    Trash2,
    Terminal,
    Activity,
    Power,
    Network,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { NodeConfig } from "@/types/network";

interface NodeActionsProps {
    node: NodeConfig;
    onEdit: (node: NodeConfig) => void;
    onDelete: (node: NodeConfig) => void;
    onConsole: (node: NodeConfig) => void;
    onNetworkInfo: (node: NodeConfig) => void;
    onPowerAction: (node: NodeConfig) => void;
    onTestConnection: (node: NodeConfig) => void;
}

export function NodeActions({
    node,
    onEdit,
    onDelete,
    onConsole,
    onNetworkInfo,
    onPowerAction,
    onTestConnection,
}: NodeActionsProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(node)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Node
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onConsole(node)}>
                        <Terminal className="mr-2 h-4 w-4" />
                        Console
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onTestConnection(node)}>
                        <Activity className="mr-2 h-4 w-4" />
                        Test Connection
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNetworkInfo(node)}>
                        <Network className="mr-2 h-4 w-4" />
                        Network Info
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPowerAction(node)}>
                        <Power className="mr-2 h-4 w-4" />
                        Power Actions
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Node
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Node</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {node.name}? This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => onDelete(node)}
                            className="bg-red-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}