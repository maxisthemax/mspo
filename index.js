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
const { getCustomersPage, createCustomer, editCustomer, getEditCustomersPage, getCustomerDocPage, uploadCustomerDocuments, disabledDeleteCustomer } = require('./routes/customers');
const { getLandsPage, getEditLandsPage, getLandsDocPage, uploadLandDocuments, createLand, editLand, disabledDeleteLand } = require('./routes/lands');
const { getMpobsPage, getEditMpobsPage, getMpobsDocPage, uploadMpobDocuments, createMpob, editMpob, disabledDeleteMpob } = require('./routes/mpobs');
const { getMsposPage, getEditMsposPage, getMsposDocPage, uploadMspoDocuments, createMspo, editMspo, disabledDeleteMspo } = require('./routes/mspos');
const { getSummaryPage,postSummaryPage } = require('./routes/summary');
const { getCompanyPage, saveCompany } = require('./routes/company');
const { getsuperadminPage, getEditsuperadminPage, getsuperadminDocPage, createsuperadmin, 
    editsuperadmin, deactivateCompany } = require('./routes/superadmin');


// Create a new Express application.
var app = express();
app.use(busboyBodyParser({ multi: true }));
// set the port of our application
// process.env.PORT lets the port be set by Heroku
// var port = process.env.PORT || 7000;
// app.set('port', port);



passport.use(new Strategy(
    function(username, password, cb) {
        db.users.findByUsername(username, function(err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.userpassword != password) { return cb(null, false); } else
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
passport.serializeUser(function(user, cb) {
    cb(null, user.userId);
});
passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function(err, user) {
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
app.use(function(req, res, next) {
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var requiresAdmin = function() {
    return [
        function(req, res, next) {
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
var checkmpobcompany = function(req) {
    return [
        function(req, res, next) {

            var mpobId = req.params.mpobId;
            process.nextTick(function() {
                var firstquery = `SELECT coId FROM mpobs 
    WHERE mpobId=${mpobId} LIMIT 1`;
                //console.log(firstquery);

                con.query(firstquery, function(err, result, fields) {
                    //console.log(result);
                    if (result.length == 0) {
                        errorFlash = req.flash('error', 'Error Reading');
                        res.redirect('/');
                    } else {
                        if (result[0].coId != req.user.coId) {
                            errorFlash = req.flash('error', 'Error Reading');
                            res.redirect('/');
                        } else { next(); }
                    }
                });
            });
        }
    ]
};

var checksummarycustid = function(req) {
    return [
        function(req, res, next) {

            var queryCustId = req.params.queryCustId;
            process.nextTick(function() {
                var firstquery = `SELECT coId FROM customers 
                WHERE custId=${queryCustId} LIMIT 1`;
                //console.log(firstquery);

                con.query(firstquery, function(err, result, fields) {
                    //console.log(result);

                    if (result && result.length == 0) {
                        errorFlash = req.flash('error', 'Error Reading');
                        res.redirect('/');
                    } else {
                        if (result[0].coId != req.user.coId) {
                            errorFlash = req.flash('error', 'Error Reading');
                            res.redirect('/');
                        } else { next(); }
                    }

                });
            });
        }
    ]
};

var checkmspocompany = function(req) {
    return [
        function(req, res, next) {

            var mspoId = req.params.mspoId;
            process.nextTick(function() {
                var firstquery = `SELECT coId FROM mspos 
                WHERE mspoId=${mspoId} LIMIT 1`;
                //console.log(firstquery);

                con.query(firstquery, function(err, result, fields) {
                    //console.log(result);

                    if (result && result.length == 0) {
                        errorFlash = req.flash('error', 'Error Reading');
                        res.redirect('/');
                    } else {
                        if (result[0].coId != req.user.coId) {
                            errorFlash = req.flash('error', 'Error Reading');
                            res.redirect('/');
                        } else { next(); }
                    }

                });
            });
        }
    ]
};

var checklandcompany = function(req) {
    return [
        function(req, res, next) {

            var landId = req.params.landId;
            process.nextTick(function() {
                var firstquery = `SELECT coId FROM lands 
    WHERE landId=${landId} LIMIT 1`;
                //console.log(firstquery);

                con.query(firstquery, function(err, result, fields) {
                    //console.log(result);
                    if (result.length == 0) {
                        errorFlash = req.flash('error', 'Error Reading');
                        res.redirect('/');
                    } else {
                        if (result[0].coId != req.user.coId) {
                            errorFlash = req.flash('error', 'Error Reading');
                            res.redirect('/');
                        } else { next(); }
                    }
                });
            });
        }
    ]
};

var checkcustomercompany = function(req) {
    return [
        function(req, res, next) {

            var custId = req.params.custId;
            process.nextTick(function() {
                var firstquery = `SELECT coId FROM customers 
    WHERE custId=${custId} LIMIT 1`;
                //console.log(firstquery);

                con.query(firstquery, function(err, result, fields) {
                    //console.log(result);
                    if (result.length == 0) {
                        errorFlash = req.flash('error', 'Error Reading');
                        res.redirect('/');
                    } else {
                        if (result[0].coId != req.user.coId) {
                            errorFlash = req.flash('error', 'Error Reading');
                            res.redirect('/');
                        } else { next(); }
                    }
                });
            });
        }
    ]
};


var checksuperadmin = function(req) {
    return [
        function(req, res, next) {

            var custId = req.params.custId;
            process.nextTick(function() {
                var firstquery = `SELECT coId FROM customers 
    WHERE ${req.user.coId}=1 LIMIT 1`;

                con.query(firstquery, function(err, result, fields) {
                    //console.log(result);
                    if (result && result.length == 0) {
                        errorFlash = req.flash('error', 'Error Reading');
                        res.redirect('/');
                    } else {
                        if (result[0].coId != req.user.coId) {
                            errorFlash = req.flash('error', 'Error Reading');
                            res.redirect('/');
                        } else { next(); }
                    }
                });
            });
        }
    ]
};
/* home*/
app.get('/', ensureLoggedIn('/login'), getHomePage);
/* home*/

/* login & logout */
app.get('/login/', getLoginPage);
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: 'Invalid Username Or Password' }),
    postLoginPage);
app.get('/logout', getLogout);
/* login & logout */

/* admin */
app.all('/admin/*', requiresAdmin());
app.get('/admin/', requiresAdmin(), getAdminPage);
app.post('/admin/user/createUser', ensureLoggedIn('/login'), createUser);
app.post('/admin/user/saveUsers', ensureLoggedIn('/login'), saveUsers);
/* admin */

/* customers */
app.all('/customers*', ensureLoggedIn('/login'));
app.get('/customers/', getCustomersPage);
app.get('/customers/:custId', checkcustomercompany(), getEditCustomersPage);
app.get('/customers/doc/:custId', checkcustomercompany(), getCustomerDocPage);
app.get('/customers/:disabledordelete/:custId/', checkcustomercompany(), disabledDeleteCustomer);
app.post('/customers/doc/', uploadCustomerDocuments);
app.post('/customers/createcustomer', createCustomer);
app.post('/customers/editcustomer', editCustomer);
/* customers */

/* lands */
app.all('/lands*', ensureLoggedIn('/login'));
app.get('/lands/', getLandsPage);
app.get('/lands/:landId', checklandcompany(), getEditLandsPage);
app.get('/lands/doc/:landId', checklandcompany(), getLandsDocPage);
app.get('/lands/:disabledordelete/:landId/', checklandcompany(), disabledDeleteLand);
app.post('/lands/doc/', uploadLandDocuments);
app.post('/lands/createland', createLand);
app.post('/lands/editland', editLand);
/* lands */

/* mpobs */
app.all('/mpobs*', ensureLoggedIn('/login'));
app.get('/mpobs/', getMpobsPage);
app.get('/mpobs/:mpobId', checkmpobcompany(), getEditMpobsPage);
app.get('/mpobs/doc/:mpobId', checkmpobcompany(), getMpobsDocPage);
app.get('/mpobs/:disabledordelete/:mpobId/', checkmpobcompany(), disabledDeleteMpob);
app.post('/mpobs/doc/', uploadMpobDocuments);
app.post('/mpobs/creatempob', createMpob);
app.post('/mpobs/editmpob', editMpob);
/* mpobs */

/* mspos */
app.all('/mspos*', ensureLoggedIn('/login'));
app.get('/mspos/', getMsposPage);
app.get('/mspos/:mspoId', checkmspocompany(), getEditMsposPage);
app.get('/mspos/doc/:mspoId', checkmspocompany(), getMsposDocPage);
app.get('/mspos/:disabledordelete/:mspoId/', checkmspocompany(), disabledDeleteMspo);
app.post('/mspos/doc/', uploadMspoDocuments);
app.post('/mspos/createmspo', createMspo);
app.post('/mspos/editmspo', editMspo);
/* mspos */

/* superadmin */
app.all('/superadmin*',ensureLoggedIn('/login'), checksuperadmin());
app.get('/superadmin/', getsuperadminPage);
app.get('/superadmin/:coId', getEditsuperadminPage);
app.get('/superadmin/doc/:coId', getsuperadminDocPage);
app.get('/superadmin/:mode/:coId/', deactivateCompany);
app.post('/superadmin/create', createsuperadmin);
app.post('/superadmin/edit', editsuperadmin);
/* superadmin */

/* summary */
app.all('/summary*', ensureLoggedIn('/login'));
app.get('/summary/', getSummaryPage);
app.post('/summary/', postSummaryPage);
/* summary */

/* company */
app.all('/company*', ensureLoggedIn('/login'));
app.get('/company/', getCompanyPage);
app.post('/company/edit', saveCompany);
/* company */

/* test */

/* test */

var server = app.listen(process.env.PORT || 5000, function() {
    var port = server.address().port;
    console.log("Express is working on port " + port);
});