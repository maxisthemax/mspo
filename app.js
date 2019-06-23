const express = require('express');
const path = require('path');
var con = require('./db');
global.con = con;

var flash = require('express-flash');
var session = require('express-session');
var busboyBodyParser = require('busboy-body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./modals/users');



const { getHomePage } = require('./routes/index');
const { getAdminPage, saveUsers, createUser } = require('./routes/admin');
const { getLoginPage, postLoginPage, getLogout } = require('./routes/auth');
const { getCustomersPage, createCustomer, editCustomer, getEditCustomersPage,getCustomerDocPage,uploadCustomerDocuments } = require('./routes/customers');
const { getCompanyPage } = require('./routes/company');
// Create a new Express application.
var app = express();
app.use(busboyBodyParser({ multi: true }));
// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 7000;
app.set('port', port);



passport.use(new Strategy(
  function (username, password, cb) {
    db.users.findByUsername(username, function (err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.userpassword != password) { return cb(null, false); }
      else
        return cb(null, user);
    });
  }));
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, cb) {
  cb(null, user.userid);
});
passport.deserializeUser(function (id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// set the view engine to ejs
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/partials/')]); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
// app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use('/stylesheets/fontawesome', express.static(__dirname + '/node_modules/font-awesome/'));
// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function (req, res, next) {
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var requiresAdmin = function () {
  return [
    function (req, res, next) {
      if (req.user && req.user.administrator === 1)
        next();
      else {
        if (req.user) {
          errorFlash = req.flash('error', 'Hi ' + req.user.displayname + ', you do not have administrator rights!');
        }
        res.redirect('/');
      }
    }
  ]
};

/* home*/
app.get('/', ensureLoggedIn('/login'), getHomePage);
/* home*/

/* login & logout */
app.get('/login', getLoginPage);
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: 'Invalid Username Or Password' }),
  postLoginPage);
app.get('/logout', getLogout);
/* login & logout */

/* admin */
app.all('/admin/*', requiresAdmin());
app.get('/admin', requiresAdmin(), getAdminPage);
app.post('/admin/user/createUser', ensureLoggedIn('/login'), createUser);
app.post('/admin/user/saveUsers', ensureLoggedIn('/login'), saveUsers);
/* admin */

/* customers */
app.all('/customers*', ensureLoggedIn('/login'));
app.get('/customers', getCustomersPage);
app.get('/customers/:custid', getEditCustomersPage);
app.get('/customers/doc/:custid', getCustomerDocPage);

app.post('/customers/doc/', uploadCustomerDocuments);

app.post('/customers/createcustomer', createCustomer);
app.post('/customers/editcustomer', editCustomer);
/* customers */

/* company */
app.all('/company*', ensureLoggedIn('/login'));
app.get('/company', getCompanyPage);
/* company */

/* test */

/* test */

app.listen(port, function () {
  console.log('Our app is running on http://localhost:' + port);
});
