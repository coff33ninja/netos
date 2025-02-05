import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/test', (req, res) => {
    res.json({ 
        status: 'ok',
        message: 'API is working'
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Test server running on http://localhost:${port}`);
});