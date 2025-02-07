# Network Topology Scanner

A real-time network topology visualization and management tool built with React, Node.js, and WebSocket.

## Features

### 1. Real-time Network Monitoring
- Live device status updates via WebSocket
- Automatic device discovery
- Connection status monitoring
- Network scan progress tracking

### 2. Interactive Network Map
- Force-directed graph visualization
- Color-coded device types
- Interactive node selection
- Animated network connections
- Auto-layout with physics simulation

### 3. Advanced Device Management
- Detailed device information
- Search and filtering capabilities
- Sortable device lists
- Device configuration
- Status history

### 4. Device Details
- Basic information (name, type, status)
- Network details (IP, MAC, ports)
- Monitoring tools
- Configuration options
- Connection history

## Technology Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- shadcn/ui components
- react-force-graph
- WebSocket client

### Backend
- Node.js
- Express
- WebSocket server
- Network scanning utilities

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Git
- Network access for scanning

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   This will install:
   - Express and CORS for the API server
   - WebSocket (ws) for real-time communication
   - Jest and Nodemon for development

3. Install additional packages:
   ```bash
   npm install ws express cors
   ```

3. Create configuration:
   ```bash
   # Create config.js manually with the following content:

   export const serverConfig = {
       port: process.env.PORT || 3001,
       jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
       corsOrigin: process.env.CORS_ORIGIN || '*',
       environment: process.env.NODE_ENV || 'development',
       dbPath: './database.db'
   };

   export const dbConfig = {
       path: './database.db',
       migrations: './src/database/migrations',
       seeders: './src/database/seeders'
   };
   ```

4. Start the server:
   ```bash
   # For development with auto-reload:
   npm run dev

   # For production:
   npm start
   ```
   Server runs on port 3001 by default.

### Frontend Setup
1. From project root:
   ```bash
   npm install
   ```
   This will install all required dependencies including:
   - Vite and React dependencies
   - TypeScript support
   - Tailwind CSS and its dependencies
   - React Force Graph
   - UI components from shadcn/ui

2. Install additional dependencies:
   ```bash
   npm install react-force-graph
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Frontend runs on port 8080 by default (configured in vite.config.ts).

## Node Management Setup

### Overview

This project includes a comprehensive node management system that allows you to deploy, edit, and manage nodes in your network. The deployment process is designed to be user-friendly and supports both Windows and Linux environments.

### Node Deployment

#### Deploying a New Node

1. **Open the Nodes Page**: Navigate to the Nodes page in the application.
2. **Click on "Deploy Node"**: This will open the deployment dialog.
3. **Fill in the Configuration**:
   - **Node Name**: Enter a unique name for the node.
   - **Node Type**: Select the type of node (Primary, Secondary, Backup).
   - **Location**: Optionally specify the location of the node.
   - **Port**: Specify the port number for the node.
   - **Primary Node URL**: If the node type is Secondary or Backup, provide the URL of the primary node.

4. **Network Configuration**:
   - **Network Interface**: Specify the network interface to use (e.g., eth0).
   - **Subnet Mask**: Enter the subnet mask (e.g., 255.255.255.0).
   - **Gateway**: Provide the gateway address.
   - **DNS Servers**: Enter DNS servers, separated by commas.
   - **Use VPN**: Enable or disable VPN usage. If enabled, provide the VPN provider and authentication key.

5. **Security Configuration**:
   - **SSL Certificate**: Choose the type of SSL certificate (self-signed, Let's Encrypt, custom).
   - **Inbound/Outbound Firewall Rules**: Configure firewall rules for the node.

6. **Monitoring Configuration**:
   - **Enable Monitoring**: Toggle monitoring on or off.
   - **Metrics Port**: Specify the port for metrics collection.
   - **Alert Email**: Enter an email address for alerts.

7. **Resource Configuration**:
   - **CPU and Memory Limits**: Set limits and requests for CPU and memory.
   - **Storage Size**: Specify the storage size for the node.
   - **Auto Scaling**: Enable or disable auto-scaling for the node.

8. **Review and Generate Deployment Script**: After filling in all the required fields, review the configuration and click "Next" to generate the deployment script.

9. **Copy or Download the Script**: You can copy the generated script to your clipboard or download it as a file.

10. **Run the Script on the Target Machine**: Execute the script on the target machine to deploy the node. Ensure you run it with administrator/root privileges.

### Editing an Existing Node

1. **Open the Nodes Page**: Navigate to the Nodes page.
2. **Select a Node**: Click on the edit icon next to the node you want to modify.
3. **Update the Node Configuration**: Make the necessary changes to the node's configuration.
4. **Save Changes**: Click "Save Changes" to apply the updates.

### Deleting a Node

1. **Open the Nodes Page**: Navigate to the Nodes page.
2. **Select a Node**: Click on the delete icon next to the node you want to remove.
3. **Confirm Deletion**: A confirmation dialog will appear. Confirm the deletion to remove the node.

## Security Considerations

- Ensure that Tailscale is configured correctly for secure networking.
- Use HTTPS for API communication.
- Implement proper authentication and authorization for sensitive operations.

## Conclusion

This node management system provides a robust solution for managing nodes in your network. The deployment process is streamlined for ease of use, and the UI components are designed to be intuitive and responsive.

For any issues or feature requests, please open an issue in the repository.
