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

### Frontend Setup
1. From project root:
   ```bash
   npm install
   ```

2. Install additional dependencies:
   ```bash
   npm install react-force-graph
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Frontend runs on port 5173 by default.

## Project Structure