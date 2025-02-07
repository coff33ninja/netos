
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Zap, Shield, Settings, Server } from "lucide-react";

interface Suggestion {
    id: string;
    title: string;
    description: string;
    type: 'security' | 'performance' | 'configuration' | 'connectivity';
    priority: 'high' | 'medium' | 'low';
    action: string;
}

const suggestions: Suggestion[] = [
    {
        id: '1',
        title: 'Enable Node Authentication',
        description: 'Secure your node communication by enabling authentication between nodes and the main server.',
        type: 'security',
        priority: 'high',
        action: 'Configure Now'
    },
    {
        id: '2',
        title: 'Optimize Network Scanning',
        description: 'Current scan interval may impact performance. Consider adjusting the frequency.',
        type: 'performance',
        priority: 'medium',
        action: 'Review Settings'
    },
    {
        id: '3',
        title: 'Update Node Configuration',
        description: 'Some nodes are using default configurations. Customize settings for better performance.',
        type: 'configuration',
        priority: 'low',
        action: 'Update Config'
    },
    {
        id: '4',
        title: 'Setup Main Server Connection',
        description: 'Configure automatic data forwarding to the main server for centralized management.',
        type: 'connectivity',
        priority: 'high',
        action: 'Connect Now'
    }
];

const getTypeIcon = (type: Suggestion['type']) => {
    switch (type) {
        case 'security':
            return <Shield className="h-4 w-4" />;
        case 'performance':
            return <Zap className="h-4 w-4" />;
        case 'configuration':
            return <Settings className="h-4 w-4" />;
        case 'connectivity':
            return <Server className="h-4 w-4" />;
    }
};

const getPriorityColor = (priority: Suggestion['priority']) => {
    switch (priority) {
        case 'high':
            return 'bg-red-500';
        case 'medium':
            return 'bg-yellow-500';
        case 'low':
            return 'bg-green-500';
    }
};

export const SuggestionsPanel = () => {
    const { toast } = useToast();

    const handleAction = (suggestion: Suggestion) => {
        toast({
            title: "Action Triggered",
            description: `Starting: ${suggestion.title}`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold">Suggested Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                {suggestions.map((suggestion) => (
                    <div
                        key={suggestion.id}
                        className="flex items-start space-x-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                            {getTypeIcon(suggestion.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className="font-medium">{suggestion.title}</p>
                                <Badge variant="secondary" className={`${getPriorityColor(suggestion.priority)} text-white`}>
                                    {suggestion.priority}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {suggestion.description}
                            </p>
                            <Button
                                variant="ghost"
                                className="text-sm"
                                onClick={() => handleAction(suggestion)}
                            >
                                {suggestion.action}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
