export interface NodeDeploymentConfig {
    // Basic Node Configuration
    nodeType: 'Primary' | 'Secondary' | 'Backup';
    nodeName: string;
    nodeId?: string;
    port: number;
    location?: string;
    
    // Network Configuration
    primaryNodeUrl?: string;
    tailscaleAuthKey?: string;
    tailscaleHostname?: string;
    
    // System Configuration
    autoStart: boolean;
    installPath?: string;
    logPath?: string;
    
    // Security Configuration
    apiKey?: string;
    tlsCert?: string;
    tlsKey?: string;
    
    // Resource Limits
    resources?: {
        maxCpuPercent?: number;
        maxMemoryMb?: number;
        maxDiskGb?: number;
    };
    
    // Monitoring Configuration
    monitoring?: {
        enabled: boolean;
        metricsPort?: number;
        alertEmail?: string;
    };
    
    // Device Management
    devices?: {
        allowAutoDiscovery: boolean;
        scanInterval?: number;
        maxDevices?: number;
    };
}

export interface DeploymentStatus {
    step: string;
    progress: number;
    details: string;
    error?: string;
}

export type DeploymentStep = 
    | 'init'
    | 'dependencies'
    | 'tailscale'
    | 'service'
    | 'configuration'
    | 'security'
    | 'monitoring'
    | 'complete';

export interface DeploymentScript {
    os: 'windows' | 'linux' | 'macos';
    commands: string[];
    configPath: string;
    serviceConfig: string;
}