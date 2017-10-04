'use strict';
const express = require('express');
const router = express.Router();
const passport = require('../services/passport');

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get(
    '/google/callback',
    passport.authenticate('google'),
    (req, res) => {
        res.redirect('/api/current_user');
    }
);

module.exports = router;