'use strict';
const express = require('express');
const router = express.Router();
const passport = require('../services/passport');

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureFlash: true,
        successFlash: '登录成功！'
    }),
    (req, res) => {
        res.redirect('/');
    }
);

module.exports = router;