const express = require('express');
const path = require('path');

// var favicon = require('serve-favicon');
const logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const keys = require('./config/keys');
const mongoose = require('mongoose');
require('./models/User');
const passport = require('./services/passport');
mongoose.connect(keys.mongoURI);

const cookieSession = require('cookie-session');
const partials = require('express-partials');
const flash = require('connect-flash');

const index = require('./routes/index');
const user = require('./routes/user');
const auth = require('./routes/auth');
const api = require('./routes/api');

const app = express();

app.use(
    cookieSession({
        maxAge: 30 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(function(req, res, next){
    console.log("app.usr local");
    console.log(req.session);
    const passport = req.session.passport;
    res.locals.user = passport && passport.user || null;
    res.locals.post = req.session.post;
    const error = req.flash('error');
    res.locals.error = error.length ? error : null;

    const success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();
});

app.use('/', index);
app.use('/user', user);
app.use('/auth', auth);
// app.use('/api', api);

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
