import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const app = express();

// Configure CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Basic JWT setup
const jwtSecret = 'your-secret-key';
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
};

// Configure passport
passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
    // This is where you would typically look up the user in your database
    return done(null, jwt_payload);
}));

app.use(passport.initialize());

// Test routes
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Public API is working',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/test/protected', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ 
            message: 'Protected API is working',
            user: req.user,
            timestamp: new Date().toISOString()
        });
    }
);

app.post('/api/auth/login', (req, res) => {
    // This is a test endpoint - in production, you'd verify credentials
    const token = jwt.sign(
        { 
            id: 1, 
            username: 'test',
            timestamp: new Date().toISOString()
        }, 
        jwtSecret, 
        { expiresIn: '1h' }
    );
    res.json({ token });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: err.message
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Test server running on http://localhost:${port}`);
    console.log('\nTest endpoints:');
    console.log('1. Public endpoint:');
    console.log('   GET http://localhost:3000/api/test');
    console.log('\n2. Get test token:');
    console.log('   POST http://localhost:3000/api/auth/login');
    console.log('\n3. Protected endpoint (use token from step 2):');
    console.log('   GET http://localhost:3000/api/test/protected');
    console.log('   Header: Authorization: Bearer <token>');
});