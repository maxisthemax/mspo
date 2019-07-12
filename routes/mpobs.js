var mpobs = require("../modals/mpobs");
var cust = require("../modals/customers");
var fs = require("fs");
var ejs = require("ejs");
var formidable = require('formidable');
var mkdirp = require('mkdirp');
const path = require('path');
var glob = require("glob");

module.exports = {
    getMpobsPage: (req, res) => {

        var htmlContent = fs.readFileSync('./views/mpobs/mpobsbutton.ejs', 'utf8');
        var htmlContent2 = fs.readFileSync('./views/mpobs/mpobsbutton2.ejs', 'utf8');
        cust.customers.queryAllCustomers(req.user.coId, function (err, cust_s) {
            mpobs.mpobs.queryAllMpobs(req.user.coId, function (err, mpob_s) {
                mpobs.mpobs.queryAllMpobsDisabled(req.user.coId, function (err, mpob_s_disabled) {
                    res.render('mpobs/mpobs.ejs', {
                        successFlash: req.flash('success'),
                        errorFlash: req.flash('error'),
                        cust_s: (cust_s) ? cust_s : [],
                        mpob_s_disabled: (mpob_s_disabled) ? mpob_s_disabled : [],
                        mpob_s: (mpob_s) ? mpob_s : [],
                        editmpobhtml: htmlContent,
                        editmpobhtml2: htmlContent2,
                    });
                });
            });
        });
    },
    getEditMpobsPage: (req, res) => {
        cust.customers.queryAllCustomers(req.user.coId, function (err, cust_s) {
            mpobs.mpobs.queryMpob(req.params.mpobId, function (err, mpob) {

                res.render('mpobs/editmpob.ejs', {
                    successFlash: req.flash('success'),
                    errorFlash: req.flash('error'),
                    mpob: mpob,
                    cust_s: cust_s
                });
            });
        });
    },

    createMpob: (req, res) => {
        mpobs.mpobs.createMpob(req, function(err, mpob) {
            if (err) {
                if (err.code == "ER_DUP_ENTRY") {
                    req.flash('error', 'MPOB Already Exist');
                } else {
                    req.flash('error', 'Unable to Save MPOB Data');
                }

                res.redirect('/mpobs/');
            } else if (mpob) {
                //console.log(customer);
                var defaultfolder = `public/company/${req.user.coId}/mpobs/doc/`;
                var filefolder = defaultfolder + mpob.insertId;
                if (!fs.existsSync(filefolder)) {
                    mkdirp(filefolder, function(err) {
                        if (err) console.error(err)
                        else console.log('dir created')
                    });
                }
                req.flash('success', 'New MPOB Created');
                if (req.files.docupload) {
                    fs.writeFileSync(filefolder + '/' + req.files.docupload[0].name, req.files.docupload[0].data, function(err) {
                        if (err) {
                            res.redirect('/mpobs/');
                        }
                    });
                    res.redirect('/mpobs/');
                } else { res.redirect('/mpobs/'); }
            }
        });
    },

    editMpob: (req, res) => {
        mpobs.mpobs.editMpob(req, function(err, mpob) {
            if (err) {
                req.flash('error', 'Unable to Edit MPOB Data');
            } else if (mpob) {
                req.flash('success', 'MPOB Data Saved');
            }
            res.redirect('/mpobs/');
        });
    },

    getMpobsDocPage: (req, res) => {

        var defaultfolder = `public/company/${req.user.coId}/mpobs/doc`;
        var mpob_doc = `${defaultfolder}/${req.params.mpobId}`;
        var mpob_dirarray = [];
        getDirectories(mpob_doc, function(err, dir) {
            for (var i = 0; i < dir.length; i++) {
                dirnew = dir[i].replace('public', '');

                // date_time = '';
                // date = path.basename(daynew).split("_")[1];
                // time = path.basename(daynew).split("_")[2];
                // newtime = time.split(".")[0];
                // date_time = date + " " + newtime;

                mpob_dirarray.push({ docfullpath: dirnew, docfilename: path.basename(dirnew) });
            }
            res.render('mpobs/mpobdocument.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                mpob_dir: mpob_dirarray,
                mpobId: req.params.mpobId
            });
        });
    },
    disabledDeleteMpob: (req, res) => {
        mpobs.mpobs.disableDeleteMpob(
            req.params.disabledordelete,
            req.params.mpobId,
            function(err, mpob) {
                if (err) {
                    console.log(err);
                    req.flash('error', 'Fail'); 
                    res.redirect('/mpobs/');
                } else {
                    req.flash('success', 'Success'); 
                    res.redirect('/mpobs/');
                }
            });
    },
    uploadMpobDocuments: (req, res) => {
        //1 - upload
        //2 - delete
        var mode = req.body.mode;
        //console.log(mode);
        var defaultfolder = `public/company/${req.user.coId}/mpobs/doc/`;
        var filefolder = defaultfolder + req.body.mpobId;

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
                            req.flash('error', 'Failed to Upload'); 
                            res.redirect(`/mpobs/doc/${req.body.mpobId}`);
                        }
                    });
                }
                req.flash('success', 'Upload Complete'); 
                res.redirect(`/mpobs/doc/${req.body.mpobId}`);

            } else { res.redirect(`/mpobs/doc/${req.body.mpobId}`); }
        } else if (mode == 2) {

            var filename = req.body.filenamedelete;
            var filepath = filefolder + '/' + filename;
            //console.log(filepath);
            try {
                fs.unlinkSync(filepath)
                req.flash('success', 'Delete Complete'); 
                    //file removed
            } catch (err) {
                req.flash('error', 'Failed to Delete');
                console.error(err)
            }
            res.redirect(`/mpobs/doc/${req.body.mpobId}`);
        }
    },

};


var getDirectories = function (src, callback) {
    glob(src + '/**/*', callback);
};