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


        cust.customers.queryAllCustomers(req.user.coid, function (err, customers) {

            res.render('customers/customers.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                customers: customers,
                editcustomerhtml: htmlContent,
            });
        });
    },
    getEditCustomersPage: (req, res) => {
        cust.customers.queryCustomers(req.params.custid, function (err, customer) {

            res.render('customers/editcustomer.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                customer: customer
            });
        });
    },
    getCustomerDocPage: (req, res) => {
        var custdoc = `public/customers/doc/${req.params.custid}`;
        var cusdirarray = [];
        getDirectories(custdoc, function (err, dir) {
            for (var i = 0; i < dir.length; i++) {
                dirnew = dir[i].replace('public', '');

                // date_time = '';
                // date = path.basename(daynew).split("_")[1];
                // time = path.basename(daynew).split("_")[2];
                // newtime = time.split(".")[0];
                // date_time = date + " " + newtime;

                cusdirarray.push({ docfullpath: dirnew, docfilename: path.basename(dirnew) });
                console.log(cusdirarray);
            }
            res.render('customers/custdocument.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                custdir: cusdirarray,
                custid: req.params.custid
            });
        });
    },


    uploadCustomerDocuments: (req, res) => {
        console.log(req);
        var filefolder = "public/customers/doc/" + req.body.custid;
        if (!fs.existsSync(filefolder)) {
            mkdirp(filefolder, function (err) {
                if (err) console.error(err)
                else console.log('dir created')
            });
        }
        if (req.files.docupload) {
            fs.writeFile(filefolder + '/' + req.files.docupload[0].name, req.files.docupload[0].data, function (err) {
                if (err) {
                    //console.log(err);
                    res.redirect(`/customers/doc/${req.body.custid}`);
                } else {
                    res.redirect(`/customers/doc/${req.body.custid}`);
                }
            });
        } else { res.redirect(`/customers/doc/${req.body.custid}`); }
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

                res.redirect('/customers');
            } else if (customer) {

                //console.log(customer);
                var filefolder = "public/customers/doc/" + customer.insertId;
                if (!fs.existsSync(filefolder)) {
                    mkdirp(filefolder, function (err) {
                        if (err) console.error(err)
                        else console.log('dir created')
                    });
                }
                req.flash('success', 'New Customer Created');
                if (req.files.icupload) {
                    console.log(filefolder + '/' + req.files.icupload[0].name);
                     console.log(req.files.icupload[0].data);
                    fs.writeFile(filefolder + '/' + req.files.icupload[0].name, req.files.icupload[0].data, function (err) {
                        if (err) {
                            console.log(err);
                            res.redirect('/customers');
                        } else {
                            res.redirect('/customers');
                        }
                    });
                } else { res.redirect('/customers'); }
            }
        });
    },

    editCustomer: (req, res) => {
        cust.customers.editCustomer(req.body, function (err, customer) {
            console.log(customer);
            if (err) {
                req.flash('error', 'Unable to Edit Customer Data');
            } else if (customer) {
                req.flash('success', 'Customer Data Saved');
            }
            res.redirect('/customers');
        });
    },
};


var getDirectories = function (src, callback) {
    glob(src + '/**/*', callback);
};