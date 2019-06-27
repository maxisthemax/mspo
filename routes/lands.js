var lands = require("../modals/lands");
var fs = require("fs");
var ejs = require("ejs");
var formidable = require('formidable');
var mkdirp = require('mkdirp');
const path = require('path');
var glob = require("glob");

module.exports = {
    getLandsPage: (req, res) => {

        var htmlContent = fs.readFileSync('./views/lands/landsbutton.ejs', 'utf8');


        lands.lands.queryAllLands(req.user.coId, function (err, lands) {

            res.render('lands/lands.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                lands: lands,
                editlandhtml: htmlContent,
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

                res.redirect('/lands');
            } else if (land) {

                //console.log(customer);
                // var filefolder = "public/customers/doc/" + customer.insertId;
                // if (!fs.existsSync(filefolder)) {
                //     mkdirp(filefolder, function (err) {
                //         if (err) console.error(err)
                //         else console.log('dir created')
                //     });
                // }
                // req.flash('success', 'New Customer Created');
                // if (req.files.icupload) {
                //     console.log(filefolder + '/' + req.files.icupload[0].name);
                //     console.log(req.files.icupload[0].data);
                //     fs.writeFile(filefolder + '/' + req.files.icupload[0].name, req.files.icupload[0].data, function (err) {
                //         if (err) {
                //             console.log(err);
                //             res.redirect('/customers');
                //         } else {
                //             res.redirect('/customers');
                //         }
                //     });
                // } else { res.redirect('/customers'); }
                req.flash('success', 'New Land Created');
                res.redirect('/lands');
            }
        });
    },


    getEditLandsPage: (req, res) => {
        lands.lands.queryLand(req.params.lotId, function (err, land) {

            res.render('lands/editland.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                land: land
            });
        });
    },



    getLandsDocPage: (req, res) => { },
    uploadLandDocuments: (req, res) => { },
    editLand: (req, res) => { },
};