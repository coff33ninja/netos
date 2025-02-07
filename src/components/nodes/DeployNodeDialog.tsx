"use client"

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { NodeConfig } from "@/types/network";
import { BasicConfig } from "./DeploymentSteps/BasicConfig";
import { NetworkConfig } from "./DeploymentSteps/NetworkConfig";
import { SecurityConfig } from "./DeploymentSteps/SecurityConfig";
import { MonitoringConfig } from "./DeploymentSteps/MonitoringConfig";
import { ResourceConfig } from "./DeploymentSteps/ResourceConfig";
import { DeploymentScript } from "./DeploymentSteps/DeploymentScript";

interface DeployNodeDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onDeploy?: (node: NodeConfig) => void;
}

interface DeploymentConfig {
    // Basic Configuration
    name: string;
    type: "Primary" | "Secondary" | "Backup";
    location: string;
    port: string;
    primaryNodeUrl?: string;

    // Network Configuration
    networkInterface: string;
    subnetMask: string;
    gateway: string;
    dns: string[];
    useVPN: boolean;
    vpnConfig?: {
        provider: string;
        authKey: string;
        region: string;
    };

    // Security Configuration
    sslCertificate: {
        type: "self-signed" | "lets-encrypt" | "custom";
        domain?: string;
        email?: string;
        customCertPath?: string;
        customKeyPath?: string;
    };
    firewallRules: {
        inbound: Array<{
            port: number;
            protocol: "tcp" | "udp";
            source: string;
            description: string;
        }>;
        outbound: Array<{
            port: number;
            protocol: "tcp" | "udp";
            destination: string;
            description: string;
        }>;
    };
    authentication: {
        method: "jwt" | "oauth2" | "api-key";
        config: Record<string, any>;
    };

    // Monitoring Configuration
    monitoring: {
        enabled: boolean;
        metrics: {
            cpu: boolean;
            memory: boolean;
            disk: boolean;
            network: boolean;
            custom: string[];
        };
        alerting: {
            email?: string;
            slack?: string;
            webhook?: string;
            thresholds: {
                cpu: number;
                memory: number;
                disk: number;
                network: number;
            };
        };
        retention: {
            metricsRetentionDays: number;
            logsRetentionDays: number;
        };
    };

    // Resource Configuration
    resources: {
        cpu: {
            limit: number;
            request: number;
        };
        memory: {
            limit: number;
            request: number;
        };
        storage: {
            size: number;
            class: string;
        };
        autoScaling: {
            enabled: boolean;
            minReplicas: number;
            maxReplicas: number;
            targetCPUUtilization: number;
        };
    };
}

const defaultConfig: DeploymentConfig = {
    name: "",
    type: "Secondary",
    location: "",
    port: "3001",
    networkInterface: "eth0",
    subnetMask: "255.255.255.0",
    gateway: "",
    dns: ["8.8.8.8", "8.8.4.4"],
    useVPN: false,
    sslCertificate: {
        type: "self-signed"
    },
    firewallRules: {
        inbound: [],
        outbound: []
    },
    authentication: {
        method: "jwt",
        config: {}
    },
    monitoring: {
        enabled: true,
        metrics: {
            cpu: true,
            memory: true,
            disk: true,
            network: true,
            custom: []
        },
        alerting: {
            thresholds: {
                cpu: 80,
                memory: 80,
                disk: 80,
                network: 80
            }
        },
        retention: {
            metricsRetentionDays: 30,
            logsRetentionDays: 7
        }
    },
    resources: {
        cpu: {
            limit: 1,
            request: 0.5
        },
        memory: {
            limit: 1024,
            request: 512
        },
        storage: {
            size: 10,
            class: "standard"
        },
        autoScaling: {
            enabled: false,
            minReplicas: 1,
            maxReplicas: 3,
            targetCPUUtilization: 80
        }
    }
};

export function DeployNodeDialog({
    isOpen,
    onOpenChange,
    onDeploy,
}: DeployNodeDialogProps) {
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState<DeploymentConfig>(defaultConfig);
    const [deploymentScript, setDeploymentScript] = useState<string | null>(null);

    const updateConfig = (newConfig: Partial<DeploymentConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    };

    const validateBasicConfig = () => {
        if (!config.name || !config.port) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return false;
        }
        if (config.type !== "Primary" && !config.primaryNodeUrl) {
            toast({
                title: "Validation Error",
                description: "Primary Node URL is required for Secondary/Backup nodes",
                variant: "destructive",
            });
            return false;
        }
        return true;
    };

    const validateNetworkConfig = () => {
        if (!config.networkInterface || !config.subnetMask || !config.gateway) {
            toast({
                title: "Validation Error",
                description: "Please fill in all network configuration fields",
                variant: "destructive",
            });
            return false;
        }
        if (config.useVPN && !config.vpnConfig?.authKey) {
            toast({
                title: "Validation Error",
                description: "VPN authentication key is required when VPN is enabled",
                variant: "destructive",
            });
            return false;
        }
        return true;
    };

    const validateSecurityConfig = () => {
        if (config.sslCertificate.type === "lets-encrypt" && (!config.sslCertificate.domain || !config.sslCertificate.email)) {
            toast({
                title: "Validation Error",
                description: "Domain and email are required for Let's Encrypt certificates",
                variant: "destructive",
            });
            return false;
        }
        if (config.sslCertificate.type === "custom" && (!config.sslCertificate.customCertPath || !config.sslCertificate.customKeyPath)) {
            toast({
                title: "Validation Error",
                description: "Certificate and key paths are required for custom certificates",
                variant: "destructive",
            });
            return false;
        }
        return true;
    };

    const validateStep = () => {
        switch (step) {
            case 1:
                return validateBasicConfig();
            case 2:
                return validateNetworkConfig();
            case 3:
                return validateSecurityConfig();
            default:
                return true;
        }
    };

    const handleNext = async () => {
        if (!validateStep()) return;

        if (step === 5) {
            try {
                setLoading(true);
                // Convert the configuration into a NodeConfig object
                const nodeConfig: NodeConfig = {
                    id: crypto.randomUUID(),
                    name: config.name,
                    type: config.type,
                    status: "offline",
                    location: config.location,
                    port: parseInt(config.port),
                    primaryNodeUrl: config.type !== "Primary" ? config.primaryNodeUrl : undefined,
                    devices: [],
                };

                // Generate deployment script (this would be your actual deployment logic)
                const script = `#!/bin/bash
# Deployment script for ${config.name}
# Generated at ${new Date().toISOString()}

# Basic Configuration
export NODE_NAME="${config.name}"
export NODE_TYPE="${config.type}"
export NODE_PORT="${config.port}"
${config.primaryNodeUrl ? `export PRIMARY_NODE_URL="${config.primaryNodeUrl}"` : ''}

# Network Configuration
export NETWORK_INTERFACE="${config.networkInterface}"
export SUBNET_MASK="${config.subnetMask}"
export GATEWAY="${config.gateway}"
export DNS_SERVERS="${config.dns.join(',')}"

# Security Configuration
export SSL_CERT_TYPE="${config.sslCertificate.type}"
${config.sslCertificate.domain ? `export SSL_DOMAIN="${config.sslCertificate.domain}"` : ''}

# Monitoring Configuration
export MONITORING_ENABLED="${config.monitoring.enabled}"
export METRICS_RETENTION_DAYS="${config.monitoring.retention.metricsRetentionDays}"

# Resource Configuration
export CPU_LIMIT="${config.resources.cpu.limit}"
export MEMORY_LIMIT="${config.resources.memory.limit}Mi"
export STORAGE_SIZE="${config.resources.storage.size}Gi"

# Start deployment
echo "Starting deployment of ${config.name}..."
`;

                setDeploymentScript(script);
                onDeploy?.(nodeConfig);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to generate deployment script",
                    variant: "destructive",
                });
                return;
            } finally {
                setLoading(false);
            }
        }
        
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <BasicConfig config={config} onConfigChange={updateConfig} />;
            case 2:
                return <NetworkConfig config={config} onConfigChange={updateConfig} />;
            case 3:
                return <SecurityConfig config={config} onConfigChange={updateConfig} />;
            case 4:
                return <MonitoringConfig config={config} onConfigChange={updateConfig} />;
            case 5:
                return <ResourceConfig config={config} onConfigChange={updateConfig} />;
            case 6:
                return deploymentScript && <DeploymentScript script={deploymentScript} />;
            default:
                return null;
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return "Basic Configuration";
            case 2: return "Network Configuration";
            case 3: return "Security Configuration";
            case 4: return "Monitoring Configuration";
            case 5: return "Resource Configuration";
            case 6: return "Deployment Script";
            default: return "";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Deploy New Node - {getStepTitle()}</DialogTitle>
                    <DialogDescription>
                        Step {step} of 6
                    </DialogDescription>
                </DialogHeader>

                {renderStep()}

                <DialogFooter>
                    {step > 1 && (
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={loading}
                        >
                            Back
                        </Button>
                    )}
                    {step < 6 ? (
                        <Button onClick={handleNext} disabled={loading}>
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Next
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}