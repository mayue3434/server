var express = require('express');

const keys = require('./config/keys');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    },
    (a,b,c,d) => {
        console.log(a);
        console.log(b)
        console.log(c)
        console.log(d)
    }
    )
);

var app = express();

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
    // scope: ['https://www.googleapis.com/auth/plus.login']
}));

app.get('/auth/google/callback', passport.authenticate('google'));

app.listen(5000);