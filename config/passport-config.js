const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const StudentModel = require('../models/student-model.js');
const TeacherModel = require('../models/teacher-model.js');

// save the users ID in the session (called when user logs in)
passport.serializeUser((user, next) => {
  // null in 1st arg mean no error
  next(null, user._id);
});

// retrieve the users info from the db with the id
// we got from the session
passport.deserializeUser((idFromSession, done) => {
   StudentModel.findById(idFromSession, (err, student) => {
     // error handling
     if(err) {
       done(err);
       return;
     }
     // if user exists in StudentModel
     if(student){
       done(null, student);
       return;
     }
     // otherwise check TeacherModel
      TeacherModel.findById(idFromSession, (err, teacher) => {
        // error handling
        if(err) {
          done(err);
          return;
        }
        done(null, teacher);
        return;
    });
  });
});

// email and password login Strategy
passport.use('student', new LocalStrategy(
  {
    usernameField:'email',  // sent through AJAX from Angular
    passwordField:'password' // sent through AJAX from Angular
  },
  (email, password, next) => {
    StudentModel.findOne(
      {email:email},
      (err, student) => {
        if (err) {
          next(err);
          return;
        }

        if (student === null) {
          next(null, false, {message:'Incorrect email'});
          return;
        }

        if(bcrypt.compareSync(password, student.password) === false) {
          next(null, false, {message:'Incorrect password'});
          return;
        }
        // if no errors, returns patient and logs in
        next(null, student);
      }
    );
  }
)
);

// DOCTOR email and password login Strategy
passport.use('teacher', new LocalStrategy(
  {
    usernameField:'email',  // sent through AJAX from Angular
    passwordField:'password' // sent through AJAX from Angular
    },
  (email, password, next) => {
    TeacherModel.findOne(
      {email:email},
      (err, teacher) => {
        if (err) {
          next(err);
          return;
        }

        if (teacher === null) {
          next(null, false, {message:'Incorrect email'});
          return;
        }

        if(bcrypt.compareSync(password, teacher.password) === false) {
          next(null, false, {message:'Incorrect password'});
          return;
        }
        // if no errors, returns patient and logs in
        next(null, teacher);
      }
    );
  }
)
);
