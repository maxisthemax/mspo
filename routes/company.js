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
    createCompany: (req, res) => {
        comp.company.createCompany(req, function(err, company) {
            //console.log(customer);
            if (err) {
                if (err.code == "ER_DUP_ENTRY")
                    req.flash('error', 'Company Already Exist');
                else
                    req.flash('error', 'Unable to Save Company Data');
            } else if (company) {

                var defaultfolder = `public/company/${company.insertId}/`;
                if (!fs.existsSync(defaultfolder)) {
                    mkdirp(defaultfolder, function(err) {
                        if (err) console.error(err)
                        else console.log('dir created')
                    });
                }
                req.flash('success', 'New Compnay Created');
            }
            res.redirect('/company/');
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