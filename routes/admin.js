const fs = require('fs');
var db = require('../modals/users');
module.exports = {
    getAdminPage: (req, res) => {
        db.users.findAllUsers(function (err, users) {
            fs.readFile("config.json", "utf8", (err, config) => {
                res.render('admin.ejs', {
                    user: req.user,
                    successFlash: req.flash('success'),
                    errorFlash: req.flash('error'),
                    config: JSON.parse(config),
                    allusers: users
                });
            });
        });
    },
    postAdminPage: (req, res) => {
        var server = req.body.server;
        var dbuser = req.body.dbuser;
        var dbpassword = req.body.dbpassword;
        //start writing
        var file = 'config.json';
        fs.readFile(file, (err, data) => {
            if (err && err.code === "ENOENT") {
                // But the file might not yet exist.  If so, just write the object and bail
                return fs.writeFile(file, JSON.stringify([obj]), error => console.error);
            }
            else if (err) {
                // Some other error
                console.error(err);
            }
            // 2. Otherwise, get its JSON content
            else {
                try {
                    var obj = { user: dbuser, password: dbpassword, server: server, driver: "msnodesqlv8", options: { trustedConnection: "true" } }
                    //4. Write the file back out
                    return fs.writeFile(file, JSON.stringify(obj), error => console.error)
                } catch (exception) {
                    console.error(exception);
                }
            }
        });
        res.redirect('/admin/testconnection');
    },
    postDabaseConnection: (req, res) => {
        fs.readFile("config.json", "utf8", function (err, config) {

            if (err) throw err;

            sql.close();
            sql.connect(JSON.parse(config), function (err) {
                if (err) {
                    req.flash('error', 'Unable to Connect to Database');
                }
                else {
                    req.flash('success', 'Connected To Dabatase');
                }
                res.redirect('/admin');
            });
        });
    },
    saveUsers: (req, res) => {
        db.users.saveAllUsers(req.body, function (err, users) {
            if (users) {
                if (users.length)
                    req.flash('success', 'User Data Saved');
            } else {
                req.flash('error', 'Unable to Save User Data');
            }
            res.redirect('/admin');
        });
    },
    createUser: (req, res) => {
        db.users.findByUsername(req.body.username, function (err, user) {
            if (err) {
                req.flash('error', err);
                res.redirect('/admin');
            }
            if (user) {
                req.flash('error', 'Same Username Detected');
                res.redirect('/admin');
            } else {
                db.users.createUser(req.body, function (err, users) {
                    console.log(users);
                    console.log(err);
                    req.flash('success', 'Account Created');
                    res.redirect('/admin');

                });
            }
        });
    },
};