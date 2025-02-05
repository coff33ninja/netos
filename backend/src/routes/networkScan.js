import express from 'express';
import { initializeDatabase } from '../database/db.js';
import { scanNetwork } from '../services/networkScanner.js';

const router = express.Router();
const db = initializeDatabase();

// Start a new network scan
router.post('/', async (req, res) => {
    try {
        const { start_ip, end_ip } = req.body;
        
        // Validate IP addresses
        if (!isValidIp(start_ip) || !isValidIp(end_ip)) {
            return res.status(400).json({ error: 'Invalid IP address format' });
        }

        // Start scan in background
        const scanId = await scanNetwork(start_ip, end_ip);
        const scan = db.findNetworkScanById(scanId);
        
        res.status(201).json(scan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get scan status
router.get('/:id', (req, res) => {
    try {
        const scan = db.findNetworkScanById(parseInt(req.params.id));
        if (!scan) {
            return res.status(404).json({ error: 'Network scan not found' });
        }
        res.json(scan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get latest scans
router.get('/', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const scans = db.getLatestNetworkScans(limit);
        res.json(scans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function isValidIp(ip) {
    const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!pattern.test(ip)) return false;
    
    const parts = ip.split('.');
    return parts.every(part => {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
    });
}

export const networkScanRouter = router;