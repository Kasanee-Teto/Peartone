import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

console.log("--> Passport Config Loading. Client ID Present:", !!process.env.GOOGLE_CLIENT_ID);

const clientID = process.env.GOOGLE_CLIENT_ID || "dummy-google-client-id-for-startup";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "dummy-google-client-secret";
const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

passport.use(new GoogleStrategy({
    clientID: clientID,      
    clientSecret: clientSecret, 
    callbackURL: `${backendUrl}/api/auth/google/callback`,
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("Google User Profile Data:", profile);
      return done(null, profile);
    } catch (err) {
      return done(err, null);
    }
}));