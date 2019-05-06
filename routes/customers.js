module.exports = {
    getCustomersPage: (req, res) => {
        res.render('customers.ejs', {
            successFlash: req.flash('success'),
            errorFlash: req.flash('error'),
        });
    },
};