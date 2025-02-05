import express from 'express';
import { initializeDatabase } from '../database/db.js';

const router = express.Router();
const db = initializeDatabase();

// Start a new network scan
router.post('/', (req, res) => {
    try {
        const { start_ip, end_ip } = req.body;
        
        // Create network scan
        const scanId = db.createNetworkScan({ 
            start_ip, 
            end_ip,
            status: 'in_progress',
            devices_found: 0
        });
        
        // In a real application, you would start the actual network scan here
        // For now, we'll just simulate it by updating the scan after a delay
        setTimeout(() => {
            db.updateNetworkScan(scanId, {
                status: 'completed',
                devices_found: Math.floor(Math.random() * 10) + 1,
                completed_at: new Date().toISOString()
            });
        }, 5000);

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

export const networkScanRouter = router;