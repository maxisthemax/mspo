var buyers = require("../modals/buyers");
var cust = require("../modals/customers");
var fs = require("fs");
var ejs = require("ejs");
var formidable = require('formidable');
var mkdirp = require('mkdirp');
const path = require('path');
var glob = require("glob");

module.exports = {
    getBuyersPage: (req, res) => {

        var htmlContent = fs.readFileSync('./views/buyers/buyersbutton.ejs', 'utf8');
        var htmlContent2 = fs.readFileSync('./views/buyers/buyersbutton2.ejs', 'utf8');
        cust.customers.queryAllCustomers(req.user.coId, function (err, cust_s) {
            
            buyers.buyers.queryAllBuyers(req.user.coId, function (err, buyer_s) {
                buyers.buyers.queryAllBuyersDisabled(req.user.coId, function (err, buyer_s_disabled) {
                    res.render('buyers/buyers.ejs', {
                        successFlash: req.flash('success'),
                        errorFlash: req.flash('error'),
                        cust_s: (cust_s) ? cust_s : [],
                        buyer_s_disabled: (buyer_s_disabled) ? buyer_s_disabled : [],
                        buyer_s: (buyer_s) ? buyer_s : [],
                        editbuyerhtml: htmlContent,
                        editbuyerhtml2: htmlContent2,
                    });
                });
            });
        });
    },
    
    createBuyer: (req, res) => {
        buyers.buyers.createBuyer(req, function (err, buyer) {
            if (err) {
                if (err.code == "ER_DUP_ENTRY") {
                    req.flash('error', 'buyer Already Exist');
                }
                else {
                    req.flash('error', 'Unable to Save buyer Data');
                }

                res.redirect('/buyers/');
            } else if (buyer) {
                //console.log(customer);
                var defaultfolder = `public/company/${req.user.coId}/buyers/doc/`;
                var filefolder = defaultfolder + buyer.insertId;
                req.flash('success', 'New buyer Created');
                if (!fs.existsSync(filefolder)) {
                    mkdirp(filefolder, function (err) {
                        if (err) console.error(err)
                        else {
                            console.log('dir created'); if (req.files.docupload) {
                                fs.writeFileSync(filefolder + '/' + req.files.docupload[0].name, req.files.docupload[0].data, function (err) {
                                    if (err) {
                                        res.redirect('/buyers/');
                                    }
                                });
                                res.redirect('/buyers/');
                            } else { res.redirect('/buyers/'); }
                        }
                    });
                } else {

                    if (req.files.docupload) {
                        fs.writeFileSync(filefolder + '/' + req.files.docupload[0].name, req.files.docupload[0].data, function (err) {
                            if (err) {
                                res.redirect('/buyers/');
                            }
                        });
                        res.redirect('/buyers/');
                    } else { res.redirect('/buyers/'); }
                }
            }
        });
    },


    getEditBuyersPage: (req, res) => {
        cust.customers.queryAllCustomers(req.user.coId, function (err, cust_s) {
            buyers.buyers.queryBuyer(req.params.buyerId, function (err, buyer) {
                res.render('buyers/editbuyer.ejs', {
                    successFlash: req.flash('success'),
                    errorFlash: req.flash('error'),
                    buyer: buyer,
                    cust_s: cust_s
                });
            });
        });
    },

    editBuyer: (req, res) => {
        buyers.buyers.editBuyer(req, function (err, buyer) {
            if (err) {
                req.flash('error', 'Unable to Edit buyer Data');
            } else if (buyer) {
                req.flash('success', 'buyer Data Saved');
            }
            res.redirect('/buyers/');
        });
    },


    getBuyersDocPage: (req, res) => {

        var defaultfolder = `public/company/${req.user.coId}/buyers/doc`;
        var buyer_doc = `${defaultfolder}/${req.params.buyerId}`;
        var buyer_dirarray = [];
        getDirectories(buyer_doc, function (err, dir) {
            for (var i = 0; i < dir.length; i++) {
                dirnew = dir[i].replace('public', '');

                // date_time = '';
                // date = path.basename(daynew).split("_")[1];
                // time = path.basename(daynew).split("_")[2];
                // newtime = time.split(".")[0];
                // date_time = date + " " + newtime;

                buyer_dirarray.push({ docfullpath: dirnew, docfilename: path.basename(dirnew) });
            }
            res.render('buyers/buyerdocument.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                buyer_dir: buyer_dirarray,
                buyerId: req.params.buyerId
            });
        });
    },
    disabledDeleteBuyer: (req, res) => {
        buyers.buyers.disableDeleteBuyer(
            req.params.disabledordelete,
            req.params.buyerId,
            function (err, buyer) {
                if (err) {
                    req.flash('error', 'Fail');
                    res.redirect('/buyers/');
                } else {
                    req.flash('success', 'Success');
                    res.redirect('/buyers/');
                }
            });
    },
    uploadBuyerDocuments: (req, res) => {
        //1 - upload
        //2 - delete
        var mode = req.body.mode;
        //console.log(mode);
        var defaultfolder = `public/company/${req.user.coId}/buyers/doc/`;
        var filefolder = defaultfolder + req.body.buyerId;

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
                                        res.redirect(`/buyers/doc/${req.body.buyerId}`);
                                    }
                                });
                            }
                            req.flash('success', 'Upload Complete');
                            res.redirect(`/buyers/doc/${req.body.buyerId}`);

                        } else { res.redirect(`/buyers/doc/${req.body.buyerId}`); }
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
                                    res.redirect(`/buyers/doc/${req.body.buyerId}`);
                                }
                            });
                        }
                        req.flash('success', 'Upload Complete');
                        res.redirect(`/buyers/doc/${req.body.buyerId}`);

                    } else { res.redirect(`/buyers/doc/${req.body.buyerId}`); }
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
            res.redirect(`/buyers/doc/${req.body.buyerId}`);
        }
    },

};


var getDirectories = function (src, callback) {
    glob(src + '/**/*', callback);
};