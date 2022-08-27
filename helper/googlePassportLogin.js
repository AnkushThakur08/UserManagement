require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  return done(null, id);
});

// Google Startegy
passport.use(
  new GoogleStrategy(
    {
      // This will ask the token From Google
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET,
      callbackURL:
        "http://localhost:8000/api/google/callback" /* In this url google will attach the token and based on that token we will ask information  */,
      // profileFields: ["id", "displayName", "email"],
    },
    (token, refreshToken, profile, next) => {
      // Based on the token which google provided, we will ask Information
      console.log("PROFILE", profile);
      

      next();
      // return done(null, profile);
    }
  )
);

