const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const bcrypt       = require('bcrypt') ;
const session      = require('express-session');  // ORDER MATTERS
const passport     = require('passport');         // SESSION THEN PASSPORT
const validator    = require('email-validator');
const cors         = require('cors');

require('dotenv').config();
// run all the code inside "passport-config.js"
require('./config/passport-config.js');

mongoose.connect('mongodb://localhost/cstest-api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Exam++';


app.use(session({
  secret:'exam++ asosoy asdk', // value doesn't matter, has to be different for every app
  resave:true,
  saveUninitialized:true
})); // parentheses for .use( and (session

// PASSPORT Middlewares
//    need to come after app.use(session({...}));
app.use(passport.initialize());
app.use(passport.session());
// ----------------------------------------------

app.use(cors({
  credentials:true,
  origin:['http://localhost:8081']
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);

const index = require('./routes/index');
app.use('/', index);

const authRoute = require('./routes/auth-route');
app.use('/auth', authRoute);

const studentRoute = require('./routes/student-route');
app.use('/student', studentRoute);

const teacherRoute = require('./routes/teacher-route');
app.use('/teacher', teacherRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
