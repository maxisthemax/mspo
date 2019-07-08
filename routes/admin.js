const fs = require('fs');
var db = require('../modals/users');
module.exports = {
    getAdminPage: (req, res) => {
        db.users.findAllUsers(req.user.coId, function(err, users) {
            fs.readFile(".config", "utf8", (err, config) => {
                res.render('admin.ejs', {
                    user: req.user,
                    successFlash: req.flash('success'),
                    errorFlash: req.flash('error'),
                    config: JSON.parse(config),
                    allusers: (users) ? users : []
                });
            });
        });
    },
    saveUsers: (req, res) => {
        db.users.saveAllUsers(req.body, function(err, changedRows) {
            //console.log(changedRows)
            if (err)
                req.flash('error', 'Unable to Save User Data');
            else if (changedRows)
                req.flash('success', 'User Data Saved');

            res.redirect('/admin');

        });
    },
    createUser: (req, res) => {
        db.users.findByUsername(req.body.username, function(err, user) {
            if (err) {
                req.flash('error', err);
                res.redirect('/admin');
            }
            if (user) {
                req.flash('error', 'Same Username Detected');
                res.redirect('/admin');
            } else {
                db.users.createUser(req, function(err, users) {
                    //console.log(users);
                    //console.log(err);
                    if (err) {
                        req.flash('error', err);
                        res.redirect('/admin');
                    } else {
                        req.flash('success', 'Account Created');
                        res.redirect('/admin');
                    }
                });
            }
        });
    },
};