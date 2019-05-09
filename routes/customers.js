var cust = require("../modals/customers");
var fs = require("fs");
var ejs = require("ejs");
module.exports = {
    getCustomersPage: (req, res) => {

        var htmlContent = fs.readFileSync('./views/customers/editcustomer.ejs', 'utf8');


        cust.customers.queryAllCustomers(null, function (err, customers) {
            //ejs.renderFile('./views/customers/editcustomers.ejs', '', {}, function (err, str) {
            res.render('customers/customers.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                customers: customers,
                editcustomerhtml: htmlContent,
                //cust: [],
            });
            //});
        });
    },
    createCustomer: (req, res) => {
        cust.customers.createCustomer(req.body, function (err, customer) {
            //console.log(customer);
            if (err) {
                if (err.code == "ER_DUP_ENTRY")
                    req.flash('error', 'Customer Already Exist');
                else
                    req.flash('error', 'Unable to Save Customer Data');
            } else if (customer) {
                req.flash('success', 'New Customer Created');
            }
            res.redirect('/customers');
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