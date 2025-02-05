import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { serverConfig } from './server.config.js';
import { dbOperations } from '../database.js';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: serverConfig.jwtSecret
};

export function setupPassport(passport) {
  passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
      try {
        const user = dbOperations.getUserById.get(jwtPayload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
}