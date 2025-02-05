# Oasis Topology Scanner

A network topology scanning and visualization tool.

## Project Structure

The project consists of two main parts:
- `frontend/`: React-based UI built with Vite, TypeScript, and shadcn-ui
- `backend/`: Node.js API server with network scanning capabilities

## Backend Setup

### Prerequisites
- Node.js 18+ and npm
- Network access for scanning functionality

### Installation

```sh
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### API Endpoints

#### Users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

#### Devices
- `POST /api/devices` - Add a new device
- `GET /api/devices` - List all devices
- `GET /api/devices/:id` - Get device by ID
- `PUT /api/devices/:id` - Update device

#### Network Scanning
- `POST /api/network-scan` - Start a new network scan
- `GET /api/network-scan/:id` - Get scan status
- `GET /api/network-scan` - Get latest scans

### Example Usage

```powershell
# Create a user
Invoke-WebRequest -Method Post -Uri "http://localhost:3001/api/users" -Body '{"username":"admin","password":"secure123","name":"Admin User","email":"admin@example.com"}' -ContentType "application/json"

# Start a network scan
Invoke-WebRequest -Method Post -Uri "http://localhost:3001/api/network-scan" -Body '{"start_ip":"192.168.1.1","end_ip":"192.168.1.254"}' -ContentType "application/json"

# List all devices
Invoke-WebRequest -Uri "http://localhost:3001/api/devices"
```

## Frontend Setup

```sh
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Technologies Used

Backend:
- Node.js
- Express
- Network scanning tools
- In-memory database with persistence

Frontend:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Development

1. Start the backend server (port 3001)
2. Start the frontend development server
3. Access the application at http://localhost:5173

## Deployment

For deployment instructions, see [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)