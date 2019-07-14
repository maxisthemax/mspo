var summary = require("../modals/summary");
var cust = require("../modals/customers");
var fs = require("fs");
var ejs = require("ejs");
var formidable = require('formidable');
var mkdirp = require('mkdirp');
const path = require('path');
var glob = require("glob");

module.exports = {
    getSummaryPage: (req, res) => {
        cust.customers.queryAllCustomers(req.user.coId, function (err, customers) {
            res.render('summary/summary.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                custs: customers,
                cust: [],
                lands: [],
                mpobs: [],
                msops: [],
                summspodir: [],
                summpobdir: [],
                sumlanddir: [],
                sumcustdir: [],
                summspodir: [],
            });
        });
    },

    postSummaryPage: (req, res) => {
        //console.log(req.body);
        cust.customers.queryAllCustomers(req.user.coId, function (err, customers) {
            summary.summary.querySummary(req, function (err, summary) {

                var custdir = [];

                var landdir = [];
                var mpobdir = [];
                var mspodir = [];

                var defaultfolder = `public/company/${req.user.coId}/customers/doc`;
                var cust_doc = `${defaultfolder}/${summary[0][0].custId}`;

                //land
                var defaultfolder = `public/company/${req.user.coId}/lands/doc`;
                var land_doc_path; //public/company/doc/{12,33}
                var land_get_doc_array = []; //{12,33}
                var land_doc_array = []; //[ { landId: 29, lotNo: 'x123' }, { landId: 30, lotNo: 'xx' } ]
                var land_doc_folder_array = [];
                for (var i = 0; i < summary[1].length; i++) {
                    land_doc_array.push({ 'landId': summary[1][i].landId, 'lotNo': summary[1][i].lotNo, 'titleNo': summary[1][i].titleNo, 'folderpath': [] });
                    land_get_doc_array.push(summary[1][i].landId);
                }
                land_doc_path = `${defaultfolder}/{${land_get_doc_array}}`
                //land

                //mspo
                var defaultfolder = `public/company/${req.user.coId}/mpobs/doc`;
                var mpob_doc_path; //public/company/doc/{12,33}
                var mpob_get_doc_array = []; //{12,33}
                var mpob_doc_array = []; //[ { mpobId: 29, lotNo: 'x123' }, { mpobId: 30, lotNo: 'xx' } ]
                var mpob_doc_folder_array = [];
                for (var i = 0; i < summary[2].length; i++) {
                    mpob_doc_array.push({ 'mpobId': summary[2][i].mpobId, 'mpobLicNo': summary[2][i].mpobLicNo, 'folderpath': [] });
                    mpob_get_doc_array.push(summary[2][i].mpobId);
                }
                mpob_doc_path = `${defaultfolder}/{${mpob_get_doc_array}}`
                //mpob

                //mspo
                var defaultfolder = `public/company/${req.user.coId}/mspos/doc`;
                var mspo_doc_path; //public/company/doc/{12,33}
                var mspo_get_doc_array = []; //{12,33}
                var mspo_doc_array = []; //[ { mspoId: 29, lotNo: 'x123' }, { mspoId: 30, lotNo: 'xx' } ]
                var mspo_doc_folder_array = [];
                for (var i = 0; i < summary[3].length; i++) {
                    mspo_doc_array.push({ 'mspoId': summary[3][i].mspoId, 'mspoCertNo': summary[3][i].mspoCertNo, 'folderpath': [] });
                    mspo_get_doc_array.push(summary[3][i].mspoId);
                }
                mspo_doc_path = `${defaultfolder}/{${mspo_get_doc_array}}`
                //mspo

                getDirectories(cust_doc, function (err, dir) {

                    for (var i = 0; i < dir.length; i++) {
                        dirnew = dir[i].replace('public', '');
                        custdir.push({ docfullpath: dirnew, docfilename: path.basename(dirnew) });
                    }


                    getDirectories(land_doc_path, function (err, dir) {
                        for (var i = 0; i < dir.length; i++) {
                            dirnew = dir[i].replace('public', '');
                            //landdir.push({ docfullpath: dirnew, docfilename: path.basename(dirnew) });

                            var folderpath = path.dirname(dirnew);
                            var foldername = path.basename(folderpath);
                            land_doc_folder_array.push({ "foldername": foldername, "folderitem": dirnew, "filename": path.basename(dirnew) });
                        }

                        for (var i = 0; i < land_doc_array.length; i++) {
                            for (var j = 0; j < land_doc_folder_array.length; j++) {
                                if (land_doc_array[i].landId == land_doc_folder_array[j].foldername) {
                                    land_doc_array[i].folderpath.push(land_doc_folder_array[j]);
                                }
                            }
                        }

                        getDirectories(mpob_doc_path, function (err, dir) {

                            for (var i = 0; i < dir.length; i++) {
                                dirnew = dir[i].replace('public', '');
                                mpobdir.push({ docfullpath: dirnew, docfilename: path.basename(dirnew) });

                                var folderpath = path.dirname(dirnew);
                                var foldername = path.basename(folderpath);
                                mpob_doc_folder_array.push({ "foldername": foldername, "folderitem": dirnew, "filename": path.basename(dirnew) });
                            }

                            for (var i = 0; i < mpob_doc_array.length; i++) {
                                for (var j = 0; j < mpob_doc_folder_array.length; j++) {
                                    if (mpob_doc_array[i].mpobId == mpob_doc_folder_array[j].foldername) {
                                        mpob_doc_array[i].folderpath.push(mpob_doc_folder_array[j]);
                                    }
                                }
                            }
                            getDirectories(mspo_doc_path, function (err, dir) {
                                for (var i = 0; i < dir.length; i++) {
                                    dirnew = dir[i].replace('public', '');
                                    mspodir.push({ docfullpath: dirnew, docfilename: path.basename(dirnew) });
    
                                    var folderpath = path.dirname(dirnew);
                                    var foldername = path.basename(folderpath);
                                    mspo_doc_folder_array.push({ "foldername": foldername, "folderitem": dirnew, "filename": path.basename(dirnew) });
                                }
    
                                for (var i = 0; i < mspo_doc_array.length; i++) {
                                    for (var j = 0; j < mspo_doc_folder_array.length; j++) {
                                        if (mspo_doc_array[i].mspoId == mspo_doc_folder_array[j].foldername) {
                                            mspo_doc_array[i].folderpath.push(mspo_doc_folder_array[j]);
                                        }
                                    }
                                }

                                res.render('summary/summary.ejs', {
                                    successFlash: req.flash('success'),
                                    errorFlash: req.flash('error'),
                                    custs: customers,
                                    cust: (summary.length > 0 && summary[0]) ? summary[0] : [],
                                    lands: (summary.length > 0 && summary[1]) ? summary[1] : [],
                                    mpobs: (summary.length > 0 && summary[2]) ? summary[2] : [],
                                    msops: (summary.length > 0 && summary[3]) ? summary[3] : [],
                                    summspodir: mspo_doc_array,
                                    summpobdir: mpob_doc_array,
                                    sumlanddir: land_doc_array,
                                    sumcustdir: custdir,
                                });
                            });
                        });
                    });


                });


            });
        });
    }
}

function checkLandId(age) {
    return age >= 18;
}


var getDirectories = function (src, callback) {
    glob(src + '/**/*', callback);
};