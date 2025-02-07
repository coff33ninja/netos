import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { program } from 'commander';
import * as inquirer from 'inquirer';

interface SetupConfig {
    nodeType: 'Primary' | 'Secondary' | 'Backup';
    nodeName: string;
    port: number;
    primaryNodeUrl?: string;
    location?: string;
    autoStart: boolean;
    tailscaleAuthKey?: string;
}

async function setupTailscale(authKey?: string) {
    try {
        const platform = os.platform();
        console.log('Setting up Tailscale...');

        if (platform === 'win32') {
            // Windows installation
            execSync('winget install tailscale.tailscale');
        } else if (platform === 'linux') {
            // Linux installation
            execSync('curl -fsSL https://tailscale.com/install.sh | sh');
        } else if (platform === 'darwin') {
            // macOS installation
            execSync('brew install tailscale');
        }

        if (authKey) {
            console.log('Authenticating with Tailscale...');
            execSync(`tailscale up --authkey=${authKey}`);
        } else {
            console.log('Please authenticate Tailscale manually using: tailscale up');
        }

        console.log('Tailscale setup complete');
    } catch (error) {
        console.error('Failed to setup Tailscale:', error);
        throw error;
    }
}

async function setupSystemService(config: SetupConfig) {
    const platform = os.platform();
    const serviceName = 'netos-node';
    const workingDir = process.cwd();
    
    try {
        if (platform === 'linux') {
            // Create systemd service
            const serviceContent = `
[Unit]
Description=NetOS Node Service
After=network.target

[Service]
Type=simple
User=${process.env.USER}
WorkingDirectory=${workingDir}
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production
Environment=PORT=${config.port}

[Install]
WantedBy=multi-user.target
`;
            fs.writeFileSync('/etc/systemd/system/netos-node.service', serviceContent);
            execSync('systemctl daemon-reload');
            execSync('systemctl enable netos-node');
            execSync('systemctl start netos-node');
        } else if (platform === 'win32') {
            // Create Windows service using node-windows
            execSync('npm install -g node-windows');
            const serviceScript = `
const Service = require('node-windows').Service;
const svc = new Service({
    name: '${serviceName}',
    description: 'NetOS Node Service',
    script: '${path.join(workingDir, 'dist', 'index.js')}',
    env: [
        {
            name: "PORT",
            value: ${config.port}
        },
        {
            name: "NODE_ENV",
            value: "production"
        }
    ]
});
svc.on('install', () => svc.start());
svc.install();
`;
            fs.writeFileSync('install-service.js', serviceScript);
            execSync('node install-service.js');
        }
        console.log('System service setup complete');
    } catch (error) {
        console.error('Failed to setup system service:', error);
        throw error;
    }
}

async function promptConfig(): Promise<SetupConfig> {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'nodeType',
            message: 'Select node type:',
            choices: ['Primary', 'Secondary', 'Backup']
        },
        {
            type: 'input',
            name: 'nodeName',
            message: 'Enter node name:',
            default: os.hostname()
        },
        {
            type: 'number',
            name: 'port',
            message: 'Enter port number:',
            default: 3001
        },
        {
            type: 'input',
            name: 'location',
            message: 'Enter node location (optional):',
        },
        {
            type: 'confirm',
            name: 'autoStart',
            message: 'Enable auto-start on boot?',
            default: true
        },
        {
            type: 'input',
            name: 'tailscaleAuthKey',
            message: 'Enter Tailscale auth key (optional):',
        }
    ]);

    if (answers.nodeType !== 'Primary') {
        const primaryUrl = await inquirer.prompt([
            {
                type: 'input',
                name: 'primaryNodeUrl',
                message: 'Enter primary node URL:',
                validate: (input: string) => {
                    return input.startsWith('http://') || input.startsWith('https://') 
                        ? true 
                        : 'URL must start with http:// or https://';
                }
            }
        ]);
        answers.primaryNodeUrl = primaryUrl.primaryNodeUrl;
    }

    return answers as SetupConfig;
}

async function main() {
    try {
        console.log('Starting NetOS Node Setup...');
        
        // Get configuration
        const config = await promptConfig();
        
        // Save configuration
        const configPath = path.join(process.cwd(), 'config.json');
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        
        // Install dependencies
        console.log('Installing dependencies...');
        execSync('npm install', { stdio: 'inherit' });
        
        // Build TypeScript
        console.log('Building TypeScript...');
        execSync('npm run build', { stdio: 'inherit' });
        
        // Setup Tailscale
        if (config.tailscaleAuthKey) {
            await setupTailscale(config.tailscaleAuthKey);
        }
        
        // Setup system service if auto-start is enabled
        if (config.autoStart) {
            await setupSystemService(config);
        }
        
        console.log('Setup complete! The node service is ready.');
        if (config.autoStart) {
            console.log('The service will start automatically on system boot.');
        } else {
            console.log('Start the service manually using: npm start');
        }
    } catch (error) {
        console.error('Setup failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}