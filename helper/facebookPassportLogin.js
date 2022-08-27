require("dotenv").config();
const passport = require("passport");
const facebookStrategy = require("passport-facebook").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  return done(null, id);
});

// Facebook Startegy
passport.use(
  new facebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENTID,
      clientSecret: process.env.FACEBOOK_CLIENTSECRET,
      callbackURL:
        "http://localhost:8000/api/auth/facebook/callback" /* When Fb authentication is Successfully */,
    }, // facebook will send back the token and profile, Done is a Callback Function
    function (token, refreshToken, profile, done) {
      console.log(profile);

      return done(null, profile);
    }
  )
);
