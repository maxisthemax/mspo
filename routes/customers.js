var cust = require("../modals/customers");
module.exports = {
    getCustomersPage: (req, res) => {
        cust.customers.queryAllCustomers(null, function (err, customers) {
            res.render('customers.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                customers: customers,

            });
        });
    },
    createCustomer: (req, res) => {
        cust.customers.createCustomer(req.body, function (err, customer) {
            
            if (err) {
                if (err.code == "ER_DUP_ENTRY")    
                    req.flash('error', 'Customer Already Exist');
                else
                    req.flash('error', 'Unable to Save User Data');
            } else if (customer) {
            req.flash('success', 'New Customer Created');
            }

            res.redirect('/customers');

        });
    },    
};