import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { execSync } from 'child_process';
import { NodeDeploymentConfig, DeploymentStatus, DeploymentScript } from '../../src/types/deployment';

export class DeploymentService {
    private status: DeploymentStatus = {
        step: 'init',
        progress: 0,
        details: 'Initializing deployment'
    };

    constructor(private config: NodeDeploymentConfig) {
        this.validateConfig();
    }

    private validateConfig() {
        if (!this.config.nodeName || !this.config.port) {
            throw new Error('Node name and port are required');
        }

        if (this.config.nodeType !== 'Primary' && !this.config.primaryNodeUrl) {
            throw new Error('Primary node URL is required for Secondary/Backup nodes');
        }

        // Generate node ID if not provided
        if (!this.config.nodeId) {
            this.config.nodeId = crypto.randomBytes(16).toString('hex');
        }
    }

    private updateStatus(step: string, progress: number, details: string) {
        this.status = { step, progress, details };
        // Emit status update event or save to log
        console.log(`Deployment status: ${step} - ${progress}% - ${details}`);
    }

    private async checkDependencies(): Promise<void> {
        this.updateStatus('dependencies', 10, 'Checking system dependencies');
        
        try {
            // Check Node.js
            execSync('node --version');
        } catch {
            throw new Error('Node.js is not installed');
        }

        try {
            // Check npm
            execSync('npm --version');
        } catch {
            throw new Error('npm is not installed');
        }

        // Check system-specific dependencies
        if (process.platform === 'linux') {
            try {
                execSync('systemctl --version');
            } catch {
                throw new Error('systemd is required for Linux deployment');
            }
        }
    }

    private async setupTailscale(): Promise<void> {
        this.updateStatus('tailscale', 30, 'Setting up Tailscale');

        if (!this.config.tailscaleAuthKey) {
            throw new Error('Tailscale auth key is required');
        }

        const platform = process.platform;
        
        try {
            if (platform === 'win32') {
                execSync('winget install tailscale.tailscale');
            } else if (platform === 'linux') {
                execSync('curl -fsSL https://tailscale.com/install.sh | sh');
            } else if (platform === 'darwin') {
                execSync('brew install tailscale');
            }

            // Configure Tailscale
            execSync(`tailscale up --authkey=${this.config.tailscaleAuthKey} --hostname=${this.config.nodeName}`);
            
            // Wait for Tailscale to be ready
            execSync('tailscale status', { timeout: 30000 });
        } catch (error) {
            throw new Error(`Failed to setup Tailscale: ${error}`);
        }
    }

    private async setupMonitoring(): Promise<void> {
        if (!this.config.monitoring?.enabled) return;

        this.updateStatus('monitoring', 60, 'Setting up monitoring');

        // Setup Prometheus Node Exporter
        if (process.platform === 'linux') {
            try {
                execSync('curl -LO https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz');
                execSync('tar xvfz node_exporter-1.7.0.linux-amd64.tar.gz');
                execSync('sudo mv node_exporter-1.7.0.linux-amd64/node_exporter /usr/local/bin/');
                execSync('rm -rf node_exporter-1.7.0.linux-amd64*');

                // Create systemd service for node_exporter
                const serviceContent = `
[Unit]
Description=Node Exporter
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/node_exporter
Restart=always

[Install]
WantedBy=multi-user.target
`;
                fs.writeFileSync('/etc/systemd/system/node_exporter.service', serviceContent);
                execSync('systemctl daemon-reload');
                execSync('systemctl enable node_exporter');
                execSync('systemctl start node_exporter');
            } catch (error) {
                throw new Error(`Failed to setup monitoring: ${error}`);
            }
        }
    }

    private async setupSecurity(): Promise<void> {
        this.updateStatus('security', 70, 'Configuring security');

        // Generate API key if not provided
        if (!this.config.apiKey) {
            this.config.apiKey = crypto.randomBytes(32).toString('hex');
        }

        // Generate TLS certificates if not provided
        if (!this.config.tlsCert || !this.config.tlsKey) {
            // In production, you should use proper CA-signed certificates
            // This is just for development/testing
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            });

            this.config.tlsKey = privateKey;
            this.config.tlsCert = publicKey;
        }

        // Save security configuration
        const securityConfig = {
            apiKey: this.config.apiKey,
            tlsCert: this.config.tlsCert,
            tlsKey: this.config.tlsKey
        };

        fs.writeFileSync(
            path.join(this.config.installPath || '', 'security.json'),
            JSON.stringify(securityConfig, null, 2)
        );
    }

    private generateServiceConfig(): string {
        const platform = process.platform;
        const workingDir = this.config.installPath || process.cwd();

        if (platform === 'linux') {
            return `
[Unit]
Description=NetOS Node Service - ${this.config.nodeName}
After=network.target

[Service]
Type=simple
User=${process.env.USER}
WorkingDirectory=${workingDir}
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production
Environment=PORT=${this.config.port}
Environment=NODE_NAME=${this.config.nodeName}
Environment=NODE_TYPE=${this.config.nodeType}
Environment=PRIMARY_URL=${this.config.primaryNodeUrl || ''}

[Install]
WantedBy=multi-user.target
`;
        } else if (platform === 'win32') {
            return `
{
    "name": "netos-node-${this.config.nodeName}",
    "script": "${path.join(workingDir, 'dist', 'index.js')}",
    "env": {
        "NODE_ENV": "production",
        "PORT": "${this.config.port}",
        "NODE_NAME": "${this.config.nodeName}",
        "NODE_TYPE": "${this.config.nodeType}",
        "PRIMARY_URL": "${this.config.primaryNodeUrl || ''}"
    }
}`;
        }

        throw new Error('Unsupported platform');
    }

    public generateDeploymentScript(): DeploymentScript {
        const platform = process.platform;
        const commands: string[] = [];
        const configPath = path.join(this.config.installPath || '', 'config.json');
        const serviceConfig = this.generateServiceConfig();

        if (platform === 'win32') {
            commands.push(
                '# Run in PowerShell as Administrator',
                'Set-ExecutionPolicy Bypass -Scope Process -Force',
                'winget install OpenJS.NodeJS',
                'npm install -g node-windows',
                'npm install',
                'npm run build',
                `$config = '${JSON.stringify(this.config, null, 2)}'`,
                `Set-Content -Path "${configPath}" -Value $config`,
                `$service = '${serviceConfig}'`,
                'Set-Content -Path "service-config.json" -Value $service',
                'node install-service.js'
            );

            return {
                os: 'windows',
                commands,
                configPath,
                serviceConfig
            };
        } else if (platform === 'linux') {
            commands.push(
                '#!/bin/bash',
                'curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -',
                'sudo apt-get install -y nodejs',
                'npm install',
                'npm run build',
                `echo '${JSON.stringify(this.config, null, 2)}' > "${configPath}"`,
                `echo '${serviceConfig}' > /etc/systemd/system/netos-node.service`,
                'systemctl daemon-reload',
                'systemctl enable netos-node',
                'systemctl start netos-node'
            );

            return {
                os: 'linux',
                commands,
                configPath,
                serviceConfig
            };
        }

        throw new Error('Unsupported platform');
    }

    public async deploy(): Promise<void> {
        try {
            // Check dependencies
            await this.checkDependencies();
            this.updateStatus('dependencies', 20, 'Dependencies verified');

            // Setup Tailscale
            await this.setupTailscale();
            this.updateStatus('tailscale', 40, 'Tailscale configured');

            // Generate and save configuration
            const configPath = path.join(this.config.installPath || '', 'config.json');
            fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
            this.updateStatus('configuration', 50, 'Configuration saved');

            // Setup security
            await this.setupSecurity();
            this.updateStatus('security', 80, 'Security configured');

            // Setup monitoring
            await this.setupMonitoring();
            this.updateStatus('monitoring', 90, 'Monitoring configured');

            // Setup service
            const serviceConfig = this.generateServiceConfig();
            if (process.platform === 'linux') {
                fs.writeFileSync('/etc/systemd/system/netos-node.service', serviceConfig);
                execSync('systemctl daemon-reload');
                execSync('systemctl enable netos-node');
                execSync('systemctl start netos-node');
            } else if (process.platform === 'win32') {
                fs.writeFileSync('service-config.json', serviceConfig);
                execSync('node install-service.js');
            }

            this.updateStatus('complete', 100, 'Deployment completed successfully');
        } catch (error) {
            this.status.error = error.message;
            throw error;
        }
    }

    public getStatus(): DeploymentStatus {
        return this.status;
    }
}