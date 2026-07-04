import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

console.log("--> Passport Config Loading. Client ID Present:", !!process.env.GOOGLE_CLIENT_ID);

const PORT = process.env.PORT || 3000;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,      
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    callbackURL: `http://localhost:${PORT}/api/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("Google User Profile Data:", profile);
      return done(null, profile);
    } catch (err) {
      return done(err, null);
    }
}));