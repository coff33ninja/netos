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

3. Install additional packages:
   ```bash
   npm install ws express cors
   ```

4. Create configuration (if not exists):
   ```bash
   cp config.example.js config.js
   ```
   Edit `config.js` with your network settings.

5. Start the server:
   ```bash
   npm start
   ```
   Server runs on port 3001 by default.

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