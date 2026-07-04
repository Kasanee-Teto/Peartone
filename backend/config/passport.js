import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

console.log("--> Passport Config Loading. Client ID Present:", !!process.env.GOOGLE_CLIENT_ID);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,      
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
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