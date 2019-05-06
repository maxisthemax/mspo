module.exports = {
    getLoginPage: (req, res) => {
        res.render('login.ejs', {
            title: 'Welcome to Chart App',
            user: req.user,
            errorFlash: req.flash('error')
        });
    },
    postLoginPage: (req, res) => {
        req.flash('success', 'Login Sucessful, Hi '+req.user.displayname);
        res.redirect('/');
    },
    getLogout: (req, res) => {
        req.logout();
        res.redirect('/login');
    },    
};