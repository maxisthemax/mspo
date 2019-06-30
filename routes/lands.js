var lands = require("../modals/lands");
var cust = require("../modals/customers");
var fs = require("fs");
var ejs = require("ejs");
var formidable = require('formidable');
var mkdirp = require('mkdirp');
const path = require('path');
var glob = require("glob");

module.exports = {
    getLandsPage: (req, res) => {

        var htmlContent = fs.readFileSync('./views/lands/landsbutton.ejs', 'utf8');
        cust.customers.queryAllCustomers(req.user.coId, function (err, customers) {
            lands.lands.queryAllLands(req.user.coId, function (err, lands) {
                res.render('lands/lands.ejs', {
                    successFlash: req.flash('success'),
                    errorFlash: req.flash('error'),
                    customers: customers,
                    lands: lands,
                    editlandhtml: htmlContent,
                });
            });
        });
    },
    createLand: (req, res) => {
        lands.lands.createLand(req, function (err, land) {
            if (err) {
                if (err.code == "ER_DUP_ENTRY") {
                    req.flash('error', 'Land Already Exist');
                }
                else {
                    req.flash('error', 'Unable to Save Land Data');
                }

                res.redirect('/lands/');
            } else if (land) {
                //console.log(customer);
                var defaultfolder = `public/company/${req.user.coId}/lands/doc/`;
                var filefolder = defaultfolder + land.insertId;
                if (!fs.existsSync(filefolder)) {
                    mkdirp(filefolder, function (err) {
                        if (err) console.error(err)
                        else console.log('dir created')
                    });
                }
                req.flash('success', 'New Land Created');
                if (req.files.docupload) {
                    fs.writeFileSync(filefolder + '/' + req.files.docupload[0].name, req.files.docupload[0].data, function (err) {
                        if (err) {
                            res.redirect('/lands/');
                        }
                    });
                    res.redirect('/lands/');
                } else { res.redirect('/lands/'); }
            }
        });
    },


    getEditLandsPage: (req, res) => {
        cust.customers.queryAllCustomers(req.user.coId, function (err, customers) {
            lands.lands.queryLand(req.params.landId, function (err, land) {

                res.render('lands/editland.ejs', {
                    successFlash: req.flash('success'),
                    errorFlash: req.flash('error'),
                    land: land,
                    customers: customers
                });
            });
        });
    },

    editLand: (req, res) => {
        lands.lands.editLand(req, function (err, land) {
            if (err) {
                req.flash('error', 'Unable to Edit Land Data');
            } else if (land) {
                req.flash('success', 'Land Data Saved');
            }
            res.redirect('/lands/');
        });
    },


    getLandsDocPage: (req, res) => {

        var defaultfolder = `public/company/${req.user.coId}/lands/doc/`;
        var landdoc = `${defaultfolder}/${req.params.landId}`;
        var cusdirarray = [];
        getDirectories(landdoc, function (err, dir) {
            for (var i = 0; i < dir.length; i++) {
                dirnew = dir[i].replace('public', '');

                // date_time = '';
                // date = path.basename(daynew).split("_")[1];
                // time = path.basename(daynew).split("_")[2];
                // newtime = time.split(".")[0];
                // date_time = date + " " + newtime;

                cusdirarray.push({ docfullpath: dirnew, docfilename: path.basename(dirnew) });
            }
            res.render('lands/landdocument.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                landdir: cusdirarray,
                landId: req.params.landId
            });
        });
    },
    uploadLandDocuments: (req, res) => {
        //1 - upload
        //2 - delete
        var mode = req.body.mode;
        var defaultfolder = `public/company/${req.user.coId}/lands/doc/`;
        var filefolder = defaultfolder + req.body.landId;
        console.log(req.body);
        console.log(req.files);
        if (mode == 1) {
            if (!fs.existsSync(filefolder)) {
                mkdirp(filefolder, function (err) {
                    if (err) console.error(err)
                    else console.log('dir created')
                });
            }
            //console.log(req.files.docupload);
            if (req.files.docupload && req.files.docupload.length > 0) {
                for (i = 0; i < req.files.docupload.length; i++) {
                    var filetype = req.files.docupload[i].name.split('.').pop();
                    var filename = (req.body[`rename[${i}]`] == "") ? req.files.docupload[i].name : req.body[`rename[${i}]`] + "." + filetype;
                    fs.writeFileSync(filefolder + '/' + filename, req.files.docupload[i].data, function (err) {
                        if (err) {
                            //console.log(err);
                            res.redirect(`/lands/doc/${req.body.landId}`);
                        }
                    });
                }

                res.redirect(`/lands/doc/${req.body.landId}`);

            } else { res.redirect(`/lands/doc/${req.body.landId}`); }
        }
        else if (mode == 2) {

            var filename = req.body.filenamedelete;
            var filepath = filefolder + '/' + filename;
            try {
                fs.unlinkSync(filepath)
                //file removed
            } catch (err) {
                console.error(err)
            }
            res.redirect(`/lands/doc/${req.body.landId}`);
        }
    },

};


var getDirectories = function (src, callback) {
    glob(src + '/**/*', callback);
};