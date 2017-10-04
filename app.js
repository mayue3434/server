var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const mongoose = require('mongoose');
require('./models/User');
const User = mongoose.model('users');
mongoose.connect('mongodb://localhost/fullstack');

const cookieSession = require('cookie-session');
const keys = require('./config/keys');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
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
                const user = new User({googleID: profile.id}).save();
                done(null, user);
            }
        })
);

//520217564494-kkekku760v7v793h031gglv0ht9aofmg.apps.googleusercontent.com
//gW-pYAuDyxG2YuOM_Xa14PcE

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(
    cookieSession({
        maxAge: 30 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
        res.redirect('/api/current_user');
    }
);
app.get('/api/current_user', (req, res) => {
    res.send(req.user);
});

app.get('/api/logout', (req, res) => {
    req.logout();
    res.send(req.user);
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    console.log('Ryan');
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
