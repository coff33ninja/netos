import Database from 'better-sqlite3';
import { DeviceInfo, ScanResult } from '../types/network';

const db = new Database('network_topology.db');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    ip TEXT NOT NULL,
    mac TEXT,
    type TEXT,
    status TEXT,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id INTEGER,
    port_number INTEGER,
    service TEXT,
    status TEXT,
    last_checked DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id)
  );

  CREATE TABLE IF NOT EXISTS scan_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scan_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    devices_found INTEGER,
    scan_duration INTEGER,
    status TEXT
  );
`);

// Prepare statements for better performance
const insertDevice = db.prepare(`
  INSERT INTO devices (name, ip, mac, type, status)
  VALUES (@name, @ip, @mac, @type, @status)
`);

const updateDevice = db.prepare(`
  UPDATE devices 
  SET name = @name, mac = @mac, type = @type, status = @status, last_seen = CURRENT_TIMESTAMP
  WHERE ip = @ip
`);

const insertPort = db.prepare(`
  INSERT INTO ports (device_id, port_number, service, status)
  VALUES (@deviceId, @portNumber, @service, @status)
`);

export const saveDeviceScan = (device: DeviceInfo) => {
  const transaction = db.transaction((device: DeviceInfo) => {
    // Try to update existing device
    const updateResult = updateDevice.run(device);
    
    // If device doesn't exist, insert it
    if (updateResult.changes === 0) {
      const result = insertDevice.run(device);
      const deviceId = result.lastInsertRowid;

      // Insert ports for new device
      device.ports?.forEach(port => {
        insertPort.run({
          deviceId,
          portNumber: port,
          service: 'unknown',
          status: 'open'
        });
      });
    }
  });

  try {
    transaction(device);
    return true;
  } catch (error) {
    console.error('Error saving device scan:', error);
    return false;
  }
};

export const getDevices = () => {
  const stmt = db.prepare(`
    SELECT d.*, GROUP_CONCAT(p.port_number) as ports
    FROM devices d
    LEFT JOIN ports p ON d.id = p.device_id
    GROUP BY d.id
  `);
  
  return stmt.all().map(device => ({
    ...device,
    ports: device.ports ? device.ports.split(',').map(Number) : []
  }));
};

export const getScanHistory = () => {
  return db.prepare('SELECT * FROM scan_history ORDER BY scan_time DESC LIMIT 100').all();
};

export const recordScan = (result: ScanResult) => {
  const stmt = db.prepare(`
    INSERT INTO scan_history (devices_found, scan_duration, status)
    VALUES (@devicesFound, @duration, @status)
  `);
  
  return stmt.run(result);
};