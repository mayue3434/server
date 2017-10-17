'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('users');
const passport = require('passport');

/* GET users listing. */
router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login'
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true,
    successFlash: '登录成功！'
}));


router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register'
    });
});

router.post("/register", async (req, res) => {
    if (req.body['password-repeat'] != req.body['password']) {
        req.flash('error', '两次输入的口令不一致');
        return res.redirect('/register');
    }

    const username = req.body.username;
    const password = req.body.password;
    // const md5 = crypto.createHash('md5');
    // const password = md5.update(req.body.password).digest('base64');

    const existingUser = await User.findOne({username});
    if (existingUser) {
        req.flash('error', 'Username already exists.');
        return res.redirect('/register');
    }

    const user = await new User({username, password}).save();
    req.login(user, err => {
        if (err) {
            return next(err);
        }
        req.flash('success', '注册成功');
        return res.redirect('/');
    });
});

router.get("/logout",function(req,res) {
    req.logout();
    req.flash('success', '登出成功');
    res.redirect('/');
});

module.exports = router;
