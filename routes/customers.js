var cust = require("../modals/customers");
var fs = require("fs");
var ejs = require("ejs");
var formidable = require('formidable');
var mkdirp = require('mkdirp');
const path = require('path');
var glob = require("glob");

module.exports = {
    getCustomersPage: (req, res) => {

        var htmlContent = fs.readFileSync('./views/customers/customersbutton.ejs', 'utf8');


        cust.customers.queryAllCustomers(req.user.coId, function (err, cust_s) {
            cust.customers.queryAllCustomersDisabled(req.user.coId, function (err, cust_s_disabled) {
                res.render('customers/customers.ejs', {
                    successFlash: req.flash('success'),
                    errorFlash: req.flash('error'),
                    cust_s: cust_s,
                    cust_s_disabled: (cust_s_disabled)?cust_s_disabled:[],
                    editcustomerhtml: htmlContent,
                });
            });
        });
    },
    getEditCustomersPage: (req, res) => {
        cust.customers.queryCustomers(req.params.custId, function (err, cust) {

            res.render('customers/editcustomer.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                cust: cust
            });
        });
    },
    getCustomerDocPage: (req, res) => {
        var defaultfolder = `public/company/${req.user.coId}/customers/doc/`;
        var cust_doc = `${defaultfolder}/${req.params.custId}`;
        var cust_dirarray = [];
        getDirectories(cust_doc, function (err, dir) {
            for (var i = 0; i < dir.length; i++) {
                dirnew = dir[i].replace('public', '');

                // date_time = '';
                // date = path.basename(daynew).split("_")[1];
                // time = path.basename(daynew).split("_")[2];
                // newtime = time.split(".")[0];
                // date_time = date + " " + newtime;

                cust_dirarray.push({ docfullpath: dirnew, docfilename: path.basename(dirnew) });
            }
            res.render('customers/custdocument.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                cust_dir: cust_dirarray,
                custId: req.params.custId
            });
        });
    },


    uploadCustomerDocuments: (req, res) => {
        //1 - upload
        //2 - delete
        var mode = req.body.mode;
        var defaultfolder = `public/company/${req.user.coId}/customers/doc/`;
        var filefolder = defaultfolder + req.body.custId;

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
                            res.redirect(`/customers/doc/${req.body.custId}`);
                        }
                    });
                }

                res.redirect(`/customers/doc/${req.body.custId}`);

            } else { res.redirect(`/customers/doc/${req.body.custId}`); }
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
            res.redirect(`/customers/doc/${req.body.custId}`);
        }
    },

    createCustomer: (req, res) => {
        cust.customers.createCustomer(req, function (err, customer) {
            if (err) {
                if (err.code == "ER_DUP_ENTRY") {
                    req.flash('error', 'Customer Already Exist');
                }
                else {
                    req.flash('error', 'Unable to Save Customer Data');
                }

                res.redirect('/customers/');
            } else if (customer) {

                //console.log(customer);
                var defaultfolder = `public/company/${req.user.coId}/customers/doc/`;
                var filefolder = defaultfolder + customer.insertId;
                if (!fs.existsSync(filefolder)) {
                    mkdirp(filefolder, function (err) {
                        if (err) console.error(err)
                        else console.log('dir created')
                    });
                }
                req.flash('success', 'New Customer Created');
                if (req.files.icupload && req.files.icupload.length > 0) {
                    var filetype = req.files.icupload[0].name.split('.').pop();
                    var filename = (req.body[`icrename[0]`] == "") ? req.files.icupload[0].name : req.body[`icrename[0]`] + "." + filetype;
                    fs.writeFileSync(filefolder + '/' + filename, req.files.icupload[0].data, function (err) {
                        if (err) {
                            res.redirect('/customers/');
                        }
                    });
                    res.redirect('/customers/');
                } else { res.redirect('/customers/'); }
            }
        });
    },

    editCustomer: (req, res) => {
        cust.customers.editCustomer(req.body, function (err, customer) {
            //console.log(customer);
            if (err) {
                req.flash('error', 'Unable to Edit Customer Data');
            } else if (customer) {
                req.flash('success', 'Customer Data Saved');
            }
            res.redirect('/customers/');
        });
    },
};


var getDirectories = function (src, callback) {
    glob(src + '/**/*', callback);
};