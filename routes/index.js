module.exports = {
    getHomePage: (req, res) => {
        res.render('home.ejs', {
            user: req.user,
            successFlash: req.flash('success'),
            errorFlash: req.flash('error'),
        });
    }
};