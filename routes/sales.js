var sales = require("../modals/sales");
var cust = require("../modals/customers");
var buyers = require("../modals/buyers");
var transporters = require("../modals/transporters");
var lands = require("../modals/lands");
var fs = require("fs");
var ejs = require("ejs");
var formidable = require('formidable');
var mkdirp = require('mkdirp');
const path = require('path');
var glob = require("glob");

module.exports = {
    getSalesPage: (req, res) => {

        var htmlContent = fs.readFileSync('./views/sales/salesbutton.ejs', 'utf8');
        var htmlContent2 = fs.readFileSync('./views/sales/salesbutton2.ejs', 'utf8');
        buyers.buyers.queryAllBuyers(req.user.coId, function (err, buyer_s) {
            sales.sales.queryAllSales(req.user.coId, function (err, sale_s) {
                sales.sales.queryAllSalesDisabled(req.user.coId, function (err, sale_s_disabled) {
                    transporters.transporter.queryAllTransporters(req.user.coId, function (err, transporters) {
                        res.render('sales/sales.ejs', {
                            successFlash: req.flash('success'),
                            errorFlash: req.flash('error'),
                            sale_s_disabled: (sale_s_disabled) ? sale_s_disabled : [],
                            sale_s: (sale_s) ? sale_s : [],
                            buyer_s: (buyer_s) ? buyer_s : [],
                            editsalehtml: htmlContent,
                            editsalehtml2: htmlContent2,
                            transporters: transporters,
                        });
                    });
                });
            });
        });
    },
    createSale: (req, res) => {
        sales.sales.createSale(req, function (err, sale) {
            if (err) {
                if (err.code == "ER_DUP_ENTRY") {
                    req.flash('error', 'sale Already Exist');
                }
                else {
                    req.flash('error', 'Unable to Save Sale Data');
                }

                res.redirect('/sales/');
            } else if (sale) {
                //console.log(customer);
                var defaultfolder = `public/company/${req.user.coId}/sales/doc/`;
                var filefolder = defaultfolder + sale.insertId;
                req.flash('success', 'New sale Created');
                if (!fs.existsSync(filefolder)) {
                    mkdirp(filefolder, function (err) {
                        if (err) console.error(err)
                        else {
                            console.log('dir created'); if (req.files.docupload) {
                                fs.writeFileSync(filefolder + '/' + req.files.docupload[0].name, req.files.docupload[0].data, function (err) {
                                    if (err) {
                                        res.redirect('/sales/');
                                    }
                                });
                                res.redirect('/sales/');
                            } else { res.redirect('/sales/'); }
                        }
                    });
                } else {

                    if (req.files.docupload) {
                        fs.writeFileSync(filefolder + '/' + req.files.docupload[0].name, req.files.docupload[0].data, function (err) {
                            if (err) {
                                res.redirect('/sales/');
                            }
                        });
                        res.redirect('/sales/');
                    } else { res.redirect('/sales/'); }
                }
            }
        });
    },


    getEditSalesPage: (req, res) => {
        sales.sales.querySale(req.params.saleId, function (err, sale) {
            buyers.buyers.queryAllBuyers(req.user.coId, function (err, buyer_s) {
                transporters.transporter.queryAllTransporters(req.user.coId, function (err, transporters) {
                    res.render('sales/editsale.ejs', {
                        successFlash: req.flash('success'),
                        errorFlash: req.flash('error'),
                        sale: sale,
                        buyer_s: buyer_s,
                        transporters: transporters,
                    });
                });
            });
        });
    },

    editSale: (req, res) => {
        sales.sales.editSale(req, function (err, sale) {
            if (err) {
                req.flash('error', 'Unable to Edit Sale Data');
            } else if (sale) {
                req.flash('success', 'Sale Data Saved');
            }
            res.redirect('/sales/');
        });
    },


    getSalesDocPage: (req, res) => {

        var defaultfolder = `public/company/${req.user.coId}/sales/doc`;
        var sale_doc = `${defaultfolder}/${req.params.saleId}`;
        var sale_dirarray = [];
        getDirectories(sale_doc, function (err, dir) {
            for (var i = 0; i < dir.length; i++) {
                dirnew = dir[i].replace('public', '');

                // date_time = '';
                // date = path.basename(daynew).split("_")[1];
                // time = path.basename(daynew).split("_")[2];
                // newtime = time.split(".")[0];
                // date_time = date + " " + newtime;

                sale_dirarray.push({ docfullpath: dirnew, docfilename: path.basename(dirnew) });
            }
            res.render('sales/saledocument.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                sale_dir: sale_dirarray,
                saleId: req.params.saleId
            });
        });
    },
    disabledDeleteSale: (req, res) => {
        sales.sales.disableDeleteSale(
            req.params.disabledordelete,
            req.params.saleId,
            function (err, sale) {
                if (err) {
                    req.flash('error', 'Fail');
                    res.redirect('/sales/');
                } else {
                    req.flash('success', 'Success');
                    res.redirect('/sales/');
                }
            });
    },
    uploadSaleDocuments: (req, res) => {
        //1 - upload
        //2 - delete
        var mode = req.body.mode;
        //console.log(mode);
        var defaultfolder = `public/company/${req.user.coId}/sales/doc/`;
        var filefolder = defaultfolder + req.body.saleId;

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
                                        res.redirect(`/sales/doc/${req.body.saleId}`);
                                    }
                                });
                            }
                            req.flash('success', 'Upload Complete');
                            res.redirect(`/sales/doc/${req.body.saleId}`);

                        } else { res.redirect(`/sales/doc/${req.body.saleId}`); }
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
                                    res.redirect(`/sales/doc/${req.body.saleId}`);
                                }
                            });
                        }
                        req.flash('success', 'Upload Complete');
                        res.redirect(`/sales/doc/${req.body.saleId}`);

                    } else { res.redirect(`/sales/doc/${req.body.saleId}`); }
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
            res.redirect(`/sales/doc/${req.body.saleId}`);
        }
    },

};


var getDirectories = function (src, callback) {
    glob(src + '/**/*', callback);
};