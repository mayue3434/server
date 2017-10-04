'use strict';
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

passport.serializeUser(async (user, done) => {
    user = await user;
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            const existingUser = await User.findOne({googleID: profile.id});
            if (existingUser) {
                done(null, existingUser);
            } else {
                const user = new User({googleID: profile.id, googleProfile: profile._json}).save();
                done(null, user);
            }
        })
);

module.exports = passport;