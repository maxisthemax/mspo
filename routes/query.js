const fs = require('fs');

module.exports = {
    querysearch: (req, res) => {
        res.render('query.ejs', {
            user: req.user,
            successFlash: req.flash('success'),
            errorFlash: req.flash('error'),
        });
    }
};
