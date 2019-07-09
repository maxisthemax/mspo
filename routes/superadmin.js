var superadmin = require("../modals/superadmin");
var cust = require("../modals/customers");
var fs = require("fs");
var ejs = require("ejs");
var formidable = require('formidable');
var mkdirp = require('mkdirp');
const path = require('path');
var glob = require("glob");

module.exports = {
    getsuperadminPage: (req, res) => {
        var htmlContent = fs.readFileSync('./views/superadmin/superadminbutton.ejs', 'utf8');
        cust.customers.queryAllCustomers(req.user.coId, function (err, cust_s) {
            superadmin.superadmin.queryAllsuperadmin(req.user.coId, function (err, superadmin_s) {
                    res.render('superadmin/superadmin.ejs', {
                        successFlash: req.flash('success'),
                        errorFlash: req.flash('error'),
                        cust_s: (cust_s) ? cust_s : [],
                        superadmin_s: (superadmin_s) ? superadmin_s : [],
                        editsuperadminhtml: htmlContent,
                });
            });
        });
    },
    getEditsuperadminPage: (req, res) => {
        cust.customers.queryAllCustomers(req.user.coId, function (err, cust_s) {
            superadmin.superadmin.querysuperadmin(req.params.superadminId, function (err, superadmin) {

                res.render('superadmin/editsuperadmin.ejs', {
                    successFlash: req.flash('success'),
                    errorFlash: req.flash('error'),
                    superadmin: superadmin,
                    cust_s: cust_s
                });
            });
        });
    },

    createsuperadmin: (req, res) => {
        superadmin.superadmin.createsuperadmin(req, function(err, superadmin) {
            //console.log(customer);
            if (err) {
                if (err.code == "ER_DUP_ENTRY")
                    req.flash('error', 'Company Already Exist');
                else
                    req.flash('error', 'Unable to Save Company Data');
            } else if (superadmin) {

                var defaultfolder = `public/company/${superadmin.insertId}/`;
                if (!fs.existsSync(defaultfolder)) {
                    mkdirp(defaultfolder, function(err) {
                        if (err) console.error(err)
                        else console.log('dir created')
                    });
                }
                req.flash('success', 'New Compnay Created');
            }
            res.redirect('/superadmin/');
        });
    },

    editsuperadmin: (req, res) => {
        superadmin.superadmin.editsuperadmin(req, function(err, superadmin) {
            if (err) {
                req.flash('error', 'Unable to Edit Company Data');
            } else if (superadmin) {
                req.flash('success', 'Company Data Saved');
            }
            res.redirect('/superadmin/');
        });
    },

    getsuperadminDocPage: (req, res) => {

        var defaultfolder = `public/company/${req.user.coId}/superadmin/doc/`;
        var superadmin_doc = `${defaultfolder}/${req.params.superadminId}`;
        var superadmin_dirarray = [];
        getDirectories(superadmin_doc, function(err, dir) {
            for (var i = 0; i < dir.length; i++) {
                dirnew = dir[i].replace('public', '');

                // date_time = '';
                // date = path.basename(daynew).split("_")[1];
                // time = path.basename(daynew).split("_")[2];
                // newtime = time.split(".")[0];
                // date_time = date + " " + newtime;

                superadmin_dirarray.push({ docfullpath: dirnew, docfilename: path.basename(dirnew) });
            }
            res.render('superadmin/superadmindocument.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                superadmin_dir: superadmin_dirarray,
                superadminId: req.params.superadminId
            });
        });
    },
    deactivateCompany: (req, res) => {
        superadmin.superadmin.deactivateCompany(
            req.params.mode,
            req.params.coId,
            function(err, superadmin) {
                if (err) {
                    console.log(err);
                    res.redirect('/superadmin/');
                } else {
                    res.redirect('/superadmin/');
                }
            });
    },
    uploadsuperadminDocuments: (req, res) => {
        //1 - upload
        //2 - delete
        var mode = req.body.mode;
        //console.log(mode);
        var defaultfolder = `public/company/${req.user.coId}/superadmin/doc/`;
        var filefolder = defaultfolder + req.body.superadminId;

        if (mode == 1) {
            if (!fs.existsSync(filefolder)) {
                mkdirp(filefolder, function(err) {
                    if (err) console.error(err)
                    else console.log('dir created')
                });
            }
            //console.log(req.files.docupload);
            if (req.files.docupload && req.files.docupload.length > 0) {
                for (i = 0; i < req.files.docupload.length; i++) {
                    var filetype = req.files.docupload[i].name.split('.').pop();
                    var filename = (req.body[`rename[${i}]`] == "") ? req.files.docupload[i].name : req.body[`rename[${i}]`] + "." + filetype;
                    fs.writeFileSync(filefolder + '/' + filename, req.files.docupload[i].data, function(err) {
                        if (err) {
                            //console.log(err);
                            res.redirect(`/superadmin/doc/${req.body.superadminId}`);
                        }
                    });
                }

                res.redirect(`/superadmin/doc/${req.body.superadminId}`);

            } else { res.redirect(`/superadmin/doc/${req.body.superadminId}`); }
        } else if (mode == 2) {

            var filename = req.body.filenamedelete;
            var filepath = filefolder + '/' + filename;
            //console.log(filepath);
            try {
                fs.unlinkSync(filepath)
                    //file removed
            } catch (err) {
                console.error(err)
            }
            res.redirect(`/superadmin/doc/${req.body.superadminId}`);
        }
    },

};


var getDirectories = function (src, callback) {
    glob(src + '/**/*', callback);
};