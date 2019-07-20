var transporter = require("../modals/transporters");
var cust = require("../modals/customers");
var tickets = require("../modals/tickets");
var fs = require("fs");
var ejs = require("ejs");
var formidable = require('formidable');
var mkdirp = require('mkdirp');
const path = require('path');
var glob = require("glob");

module.exports = {
    getTransportersPage: (req, res) => {

        var htmlContent = fs.readFileSync('./views/transporters/transportersbutton.ejs', 'utf8');
        var htmlContent2 = fs.readFileSync('./views/transporters/transportersbutton2.ejs', 'utf8');
        cust.customers.queryAllCustomers(req.user.coId, function (err, cust_s) {
            tickets.tickets.queryAllTickets(req.user.coId, function (err, ticket_s) {
                transporter.transporter.queryAllTransporters(req.user.coId, function (err, transporter_s) {
                    transporter.transporter.queryAllTransportersDisabled(req.user.coId, function (err, transporter_s_disabled) {
                        res.render('transporters/transporters.ejs', {
                            successFlash: req.flash('success'),
                            errorFlash: req.flash('error'),
                            cust_s: (cust_s) ? cust_s : [],
                            transporter_s_disabled: (transporter_s_disabled) ? transporter_s_disabled : [],
                            transporter_s: (transporter_s) ? transporter_s : [],
                            edittransporterhtml: htmlContent,
                            edittransporterhtml2: htmlContent2,
                            ticket_s: ticket_s
                        });
                    });
                });
            });
        });
    },

    createTransporter: (req, res) => {
        transporter.transporter.createTransporter(req, function (err, transporter) {
            if (err) {
                if (err.code == "ER_DUP_ENTRY") {
                    req.flash('error', 'transporter Already Exist');
                }
                else {
                    req.flash('error', 'Unable to Save transporter Data');
                }

                res.redirect('/transporter/');
            } else if (transporter) {
                //console.log(customer);
                var defaultfolder = `public/company/${req.user.coId}/transporter/doc/`;
                var filefolder = defaultfolder + transporter.insertId;
                req.flash('success', 'New transporter Created');
                if (!fs.existsSync(filefolder)) {
                    mkdirp(filefolder, function (err) {
                        if (err) console.error(err)
                        else {
                            console.log('dir created'); if (req.files.docupload) {
                                fs.writeFileSync(filefolder + '/' + req.files.docupload[0].name, req.files.docupload[0].data, function (err) {
                                    if (err) {
                                        res.redirect('/transporter/');
                                    }
                                });
                                res.redirect('/transporter/');
                            } else { res.redirect('/transporter/'); }
                        }
                    });
                } else {

                    if (req.files.docupload) {
                        fs.writeFileSync(filefolder + '/' + req.files.docupload[0].name, req.files.docupload[0].data, function (err) {
                            if (err) {
                                res.redirect('/transporter/');
                            }
                        });
                        res.redirect('/transporter/');
                    } else { res.redirect('/transporter/'); }
                }
            }
        });
    },


    getEditTransportersPage: (req, res) => {
        cust.customers.queryAllCustomers(req.user.coId, function (err, cust_s) {
            tickets.tickets.queryAllTickets(req.user.coId, function (err, ticket_s) {
                transporter.transporter.queryTransporter(req.params.transporterId, function (err, transporter) {
                    res.render('transporters/edittransporter.ejs', {
                        successFlash: req.flash('success'),
                        errorFlash: req.flash('error'),
                        transporter: transporter,
                        cust_s: cust_s,
                        ticket_s: ticket_s
                    });
                });
            });
        });
    },

    editTransporter: (req, res) => {
        transporter.transporter.editTransporter(req, function (err, transporter) {
            if (err) {
                req.flash('error', 'Unable to Edit transporter Data');
            } else if (transporter) {
                req.flash('success', 'transporter Data Saved');
            }
            res.redirect('/transporter/');
        });
    },


    getTransportersDocPage: (req, res) => {

        var defaultfolder = `public/company/${req.user.coId}/transporter/doc`;
        var transporter_doc = `${defaultfolder}/${req.params.transporterId}`;
        var transporter_dirarray = [];
        getDirectories(transporter_doc, function (err, dir) {
            for (var i = 0; i < dir.length; i++) {
                dirnew = dir[i].replace('public', '');

                // date_time = '';
                // date = path.basename(daynew).split("_")[1];
                // time = path.basename(daynew).split("_")[2];
                // newtime = time.split(".")[0];
                // date_time = date + " " + newtime;

                transporter_dirarray.push({ docfullpath: dirnew, docfilename: path.basename(dirnew) });
            }
            res.render('transporters/transporterdocument.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                transporter_dir: transporter_dirarray,
                transporterId: req.params.transporterId
            });
        });
    },
    disabledDeleteTransporter: (req, res) => {
        transporter.transporter.disableDeleteTransporter(
            req.params.disabledordelete,
            req.params.transporterId,
            function (err, transporter) {
                if (err) {
                    req.flash('error', 'Fail');
                    res.redirect('/transporter/');
                } else {
                    req.flash('success', 'Success');
                    res.redirect('/transporter/');
                }
            });
    },
    uploadTransporterDocuments: (req, res) => {
        //1 - upload
        //2 - delete
        var mode = req.body.mode;
        //console.log(mode);
        var defaultfolder = `public/company/${req.user.coId}/transporter/doc/`;
        var filefolder = defaultfolder + req.body.transporterId;

        if (mode == 1) {
            if (!fs.existsSync(filefolder)) {
                mkdirp(filefolder, function (err) {
                    if (err) console.error(err)
                    else {
                        console.log('dir created');
                        if (req.files.docupload && req.files.docupload.length > 0) {
                            for (i = 0; i < req.files.docupload.length; i++) {
                                var filetype = req.files.docupload[i].name.split('.').pop();
                                var filename = (req.body[`rename[${i}]`] == "") ? req.files.docupload[i].name : req.body[`rename[${i}]`] + "." + filetype;
                                fs.writeFileSync(filefolder + '/' + filename, req.files.docupload[i].data, function (err) {
                                    if (err) {
                                        req.flash('error', 'Failed To Upload');
                                        res.redirect(`/transporter/doc/${req.body.transporterId}`);
                                    }
                                });
                            }
                            req.flash('success', 'Upload Complete');
                            res.redirect(`/transporter/doc/${req.body.transporterId}`);

                        } else { res.redirect(`/transporter/doc/${req.body.transporterId}`); }
                    }
                });



            }
            else {
                if (fs.existsSync(filefolder)) {
                    if (req.files.docupload && req.files.docupload.length > 0) {
                        for (i = 0; i < req.files.docupload.length; i++) {
                            var filetype = req.files.docupload[i].name.split('.').pop();
                            var filename = (req.body[`rename[${i}]`] == "") ? req.files.docupload[i].name : req.body[`rename[${i}]`] + "." + filetype;
                            fs.writeFileSync(filefolder + '/' + filename, req.files.docupload[i].data, function (err) {
                                if (err) {
                                    req.flash('error', 'Failed To Upload');
                                    res.redirect(`/transporter/doc/${req.body.transporterId}`);
                                }
                            });
                        }
                        req.flash('success', 'Upload Complete');
                        res.redirect(`/transporter/doc/${req.body.transporterId}`);

                    } else { res.redirect(`/transporter/doc/${req.body.transporterId}`); }
                }
            }
        }
        else if (mode == 2) {

            var filename = req.body.filenamedelete;
            var filepath = filefolder + '/' + filename;
            //console.log(filepath);
            try {
                req.flash('success', 'Delete Complete');
                fs.unlinkSync(filepath)
                //file removed
            } catch (err) {
                req.flash('error', 'Fail to Delete');
                console.error(err)
            }
            res.redirect(`/transporter/doc/${req.body.transporterId}`);
        }
    },

};


var getDirectories = function (src, callback) {
    glob(src + '/**/*', callback);
};