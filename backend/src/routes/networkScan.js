import express from 'express';
import { initializeDatabase } from '../database/db.js';
import { scanNetwork } from '../services/networkScanner.js';

const router = express.Router();

// Start a new network scan
router.post('/', async (req, res) => {
    try {
        const db = await initializeDatabase();
        const { start_ip, end_ip } = req.body;
        
        // Validate IP addresses
        if (!isValidIp(start_ip) || !isValidIp(end_ip)) {
            return res.status(400).json({ error: 'Invalid IP address format' });
        }

        // Create initial scan record
        const scanId = db.createNetworkScan({
            start_ip,
            end_ip,
            status: 'pending',
            timestamp: new Date().toISOString()
        });

        // Start scan in background
        scanNetwork(start_ip, end_ip, scanId, db).catch(error => {
            console.error('Network scan failed:', error);
            db.updateNetworkScan(scanId, { 
                status: 'failed',
                error: error.message
            });
        });

        const scan = db.findNetworkScanById(scanId);
        res.status(201).json(scan);
    } catch (error) {
        console.error('Error starting network scan:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get scan status
router.get('/:id', async (req, res) => {
    try {
        const db = await initializeDatabase();
        const scan = db.findNetworkScanById(parseInt(req.params.id));
        if (!scan) {
            return res.status(404).json({ error: 'Network scan not found' });
        }
        res.json(scan);
    } catch (error) {
        console.error('Error getting scan status:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get latest scans
router.get('/', async (req, res) => {
    try {
        const db = await initializeDatabase();
        const limit = parseInt(req.query.limit) || 10;
        const scans = db.getLatestNetworkScans(limit);
        res.json(scans);
    } catch (error) {
        console.error('Error getting latest scans:', error);
        res.status(500).json({ error: error.message });
    }
});

function isValidIp(ip) {
    if (!ip) return false;
    
    const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!pattern.test(ip)) return false;
    
    const parts = ip.split('.');
    return parts.every(part => {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
    });
}

export const networkScanRouter = router;