var mspos = require("../modals/mspos");
var cust = require("../modals/customers");
var fs = require("fs");
var ejs = require("ejs");
var formidable = require('formidable');
var mkdirp = require('mkdirp');
const path = require('path');
var glob = require("glob");

module.exports = {
    getMsposPage: (req, res) => {

        var htmlContent = fs.readFileSync('./views/mspos/msposbutton.ejs', 'utf8');
        var htmlContent2 = fs.readFileSync('./views/mspos/msposbutton2.ejs', 'utf8');
        cust.customers.queryAllCustomers(req.user.coId, function (err, cust_s) {
            mspos.mspos.queryAllMspos(req.user.coId, function (err, mspo_s) {
                mspos.mspos.queryAllMsposDisabled(req.user.coId, function (err, mspo_s_disabled) {
                    res.render('mspos/mspos.ejs', {
                        successFlash: req.flash('success'),
                        errorFlash: req.flash('error'),
                        cust_s: (cust_s) ? cust_s : [],
                        mspo_s_disabled: (mspo_s_disabled) ? mspo_s_disabled : [],
                        mspo_s: (mspo_s) ? mspo_s : [],
                        editmspohtml: htmlContent,
                        editmspohtml2: htmlContent2,
                    });
                });
            });
        });
    },
    getEditMsposPage: (req, res) => {
        cust.customers.queryAllCustomers(req.user.coId, function (err, cust_s) {
            mspos.mspos.queryMspo(req.params.mspoId, function (err, mspo) {

                res.render('mspos/editmspo.ejs', {
                    successFlash: req.flash('success'),
                    errorFlash: req.flash('error'),
                    mspo: mspo,
                    cust_s: cust_s
                });
            });
        });
    },

    createMspo: (req, res) => {
        mspos.mspos.createMspo(req, function(err, mspo) {
            if (err) {
                if (err.code == "ER_DUP_ENTRY") {
                    req.flash('error', 'MSPO Already Exist');
                } else {
                    req.flash('error', 'Unable to Save MSPO Data');
                }

                res.redirect('/mspos/');
            } else if (mspo) {
                //console.log(customer);
                var defaultfolder = `public/company/${req.user.coId}/mspos/doc/`;
                var filefolder = defaultfolder + mspo.insertId;
                if (!fs.existsSync(filefolder)) {
                    mkdirp(filefolder, function(err) {
                        if (err) console.error(err)
                        else console.log('dir created')
                    });
                }
                req.flash('success', 'New MSPO Created');
                if (req.files.docupload) {
                    fs.writeFileSync(filefolder + '/' + req.files.docupload[0].name, req.files.docupload[0].data, function(err) {
                        if (err) {
                            res.redirect('/mspos/');
                        }
                    });
                    res.redirect('/mspos/');
                } else { res.redirect('/mspos/'); }
            }
        });
    },

    editMspo: (req, res) => {
        mspos.mspos.editMspo(req, function(err, mspo) {
            if (err) {
                req.flash('error', 'Unable to Edit MSPO Data');
            } else if (mspo) {
                req.flash('success', 'MSPO Data Saved');
            }
            res.redirect('/mspos/');
        });
    },

    getMsposDocPage: (req, res) => {

        var defaultfolder = `public/company/${req.user.coId}/mspos/doc`;
        var mspo_doc = `${defaultfolder}/${req.params.mspoId}`;
        var mspo_dirarray = [];
        getDirectories(mspo_doc, function(err, dir) {
            for (var i = 0; i < dir.length; i++) {
                dirnew = dir[i].replace('public', '');

                // date_time = '';
                // date = path.basename(daynew).split("_")[1];
                // time = path.basename(daynew).split("_")[2];
                // newtime = time.split(".")[0];
                // date_time = date + " " + newtime;

                mspo_dirarray.push({ docfullpath: dirnew, docfilename: path.basename(dirnew) });
            }
            res.render('mspos/mspodocument.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                mspo_dir: mspo_dirarray,
                mspoId: req.params.mspoId
            });
        });
    },
    disabledDeleteMspo: (req, res) => {
        mspos.mspos.disableDeleteMspo(
            req.params.disabledordelete,
            req.params.mspoId,
            function(err, mspo) {
                if (err) {
                    console.log(err);
                    req.flash('error', 'Fail');
                    res.redirect('/mspos/');
                } else {
                    req.flash('success', 'Success');
                    res.redirect('/mspos/');
                }
            });
    },
    uploadMspoDocuments: (req, res) => {
        //1 - upload
        //2 - delete
        var mode = req.body.mode;
        //console.log(mode);
        var defaultfolder = `public/company/${req.user.coId}/mspos/doc/`;
        var filefolder = defaultfolder + req.body.mspoId;

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
                            req.flash('error', 'Fail to Upload');
                            res.redirect(`/mspos/doc/${req.body.mspoId}`);
                        }
                    });
                }
                req.flash('success', 'Upload Complete');
                res.redirect(`/mspos/doc/${req.body.mspoId}`);

            } else { res.redirect(`/mspos/doc/${req.body.mspoId}`); }
        } else if (mode == 2) {

            var filename = req.body.filenamedelete;
            var filepath = filefolder + '/' + filename;
            //console.log(filepath);
            try {
                fs.unlinkSync(filepath)
                req.flash('success', 'Delete Complete');
                    //file removed
            } catch (err) {
                req.flash('error', 'Fail to Delete');
                console.error(err)
            }
            res.redirect(`/mspos/doc/${req.body.mspoId}`);
        }
    },

};


var getDirectories = function (src, callback) {
    glob(src + '/**/*', callback);
};