var comp = require("../modals/company");
var fs = require("fs");
var mkdirp = require('mkdirp');
const path = require('path');
module.exports = {
    getCompanyPage: (req, res) => {
        comp.company.queryCompany(req.user.coId, function(err, company) {
            res.render('company/company.ejs', {
                company: company,
                user: req.user
            });
        });
    },
    saveCompany: (req, res) => {
        //console.log(req.body);
        comp.company.saveCompany(req.body, function(err, company) {
            //console.log(company);
            if (err) {
                req.flash('error', 'Unable to Edit Company Data');
            } else if (company) {
                req.flash('success', 'Company Data Saved');
            }
            res.redirect('/company/');
        });
    },
};