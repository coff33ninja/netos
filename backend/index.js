import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { serverConfig } from './config/server.config.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Configure JWT strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: serverConfig.jwtSecret
};

passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
    // This is where you would typically look up the user in your database
    return done(null, jwt_payload);
}));

// Basic routes
app.get('/', (req, res) => {
    res.json({ message: 'Backend API is running' });
});

app.get('/api/protected',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({
            message: 'You have access to protected endpoint',
            user: req.user
        });
    }
);

// Start server
const port = serverConfig.port;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});