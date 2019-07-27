var db = require('../modals/users');
module.exports = {
    getLoginPage: (req, res) => {
        res.render('login.ejs', {
            title: 'Welcome to MSPO APP',
            user: req.user,
            errorFlash: req.flash('error')
        });
    },
    postLoginPage: (req, res) => {
        db.users.saveUserToken(req, function(err, result) {
            req.flash('success', 'Login Sucessful, Hi '+req.user.displayname);
            res.redirect('/');
        });
    },
    getLogout: (req, res) => {
        req.logout();
        res.redirect('/login');
    },    
};