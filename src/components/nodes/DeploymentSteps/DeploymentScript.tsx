import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DeploymentScriptProps {
    script: string;
}

export function DeploymentScript({ script }: DeploymentScriptProps) {
    const { toast } = useToast();

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(script);
            toast({
                title: "Copied!",
                description: "Deployment script copied to clipboard",
            });
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to copy script to clipboard",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="grid gap-4 py-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Deployment Script</h3>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                </Button>
            </div>
            <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">{script}</code>
            </pre>
        </div>
    );
}