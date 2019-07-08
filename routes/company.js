var comp = require("../modals/company");

module.exports = {
    getCompanyPage: (req, res) => {
        comp.company.queryCompany(req.user.coId, function (err, company) {
            res.render('company/company.ejs', {
                company: company,
            });
        });
    },
    createCompany: (req, res) => {
        // cust.customers.createCustomer(req.body, function (err, customer) {
        //     //console.log(customer);
        //     if (err) {
        //         if (err.code == "ER_DUP_ENTRY")
        //             req.flash('error', 'Customer Already Exist');
        //         else
        //             req.flash('error', 'Unable to Save Customer Data');
        //     } else if (customer) {
        //         req.flash('success', 'New Customer Created');
        //     }
        //     res.redirect('/customers');
        // });
    },
    editCompany: (req, res) => {
        // cust.customers.editCustomer(req.body, function (err, customer) {
        //     console.log(customer);
        //     if (err) {
        //         req.flash('error', 'Unable to Edit Customer Data');
        //     } else if (customer) {
        //         req.flash('success', 'Customer Data Saved');
        //     }
        //     res.redirect('/customers');
        // });
    },
};