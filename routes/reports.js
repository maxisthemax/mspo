var cust = require("../modals/customers");
var buyers = require("../modals/buyers");
var transporters = require("../modals/transporters");
var reports = require("../modals/reports");
var fs = require("fs");
var ejs = require("ejs");
var formidable = require('formidable');
var mkdirp = require('mkdirp');
const path = require('path');
var glob = require("glob");

module.exports = {
    getReportsPage: (req, res) => {
        reports.reports.queryLandsWithMpobs(req.user.coId,function (err, reports) {
            res.render('reports/reports.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                reports: (reports) ? reports : [],
            });
        });
    },
}
