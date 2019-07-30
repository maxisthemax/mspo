var tickets = require("../modals/tickets");
var cust = require("../modals/customers");
var buyers = require("../modals/buyers");
var transporters = require("../modals/transporters");
var fs = require("fs");
var ejs = require("ejs");
var formidable = require('formidable');
var mkdirp = require('mkdirp');
const path = require('path');
var glob = require("glob");

module.exports = {
    getTicketsPage: (req, res) => {

        var htmlContent = fs.readFileSync('./views/tickets/ticketsbutton.ejs', 'utf8');
        var htmlContent2 = fs.readFileSync('./views/tickets/ticketsbutton2.ejs', 'utf8');
        cust.customers.queryAllCustomers(req.user.coId, function (err, cust_s) {
            buyers.buyers.queryAllBuyers(req.user.coId, function (err, buyer_s) {
                tickets.tickets.queryAllTickets(req.user.coId, function (err, ticket_s) {
                    tickets.tickets.queryAllTicketsDisabled(req.user.coId, function (err, ticket_s_disabled) {
                        transporters.transporter.queryAllTransporters(req.user.coId, function (err, transporters) {
                            res.render('tickets/tickets.ejs', {
                                successFlash: req.flash('success'),
                                errorFlash: req.flash('error'),
                                cust_s: (cust_s) ? cust_s : [],
                                ticket_s_disabled: (ticket_s_disabled) ? ticket_s_disabled : [],
                                ticket_s: (ticket_s) ? ticket_s : [],
                                buyer_s: (buyer_s) ? buyer_s : [],
                                edittickethtml: htmlContent,
                                edittickethtml2: htmlContent2,
                                transporters: transporters
                            });
                        });
                    });
                });
            });
        });
    },
    createTicket: (req, res) => {
        tickets.tickets.createTicket(req, function (err, ticket) {
            if (err) {
                if (err.code == "ER_DUP_ENTRY") {
                    req.flash('error', 'ticket Already Exist');
                }
                else {
                    req.flash('error', 'Unable to Save Ticket Data');
                }

                res.redirect('/tickets/');
            } else if (ticket) {
                //console.log(customer);
                var defaultfolder = `public/company/${req.user.coId}/tickets/doc/`;
                var filefolder = defaultfolder + ticket.insertId;
                req.flash('success', 'New ticket Created');
                if (!fs.existsSync(filefolder)) {
                    mkdirp(filefolder, function (err) {
                        if (err) console.error(err)
                        else {
                            console.log('dir created'); if (req.files.docupload) {
                                fs.writeFileSync(filefolder + '/' + req.files.docupload[0].name, req.files.docupload[0].data, function (err) {
                                    if (err) {
                                        res.redirect('/tickets/');
                                    }
                                });
                                res.redirect('/tickets/');
                            } else { res.redirect('/tickets/'); }
                        }
                    });
                } else {

                    if (req.files.docupload) {
                        fs.writeFileSync(filefolder + '/' + req.files.docupload[0].name, req.files.docupload[0].data, function (err) {
                            if (err) {
                                res.redirect('/tickets/');
                            }
                        });
                        res.redirect('/tickets/');
                    } else { res.redirect('/tickets/'); }
                }
            }
        });
    },


    getEditTicketsPage: (req, res) => {
        cust.customers.queryAllCustomers(req.user.coId, function (err, cust_s) {
            tickets.tickets.queryTicket(req.params.ticketId, function (err, ticket) {
                buyers.buyers.queryAllBuyers(req.user.coId, function (err, buyer_s) {
                    transporters.transporter.queryAllTransporters(req.user.coId, function (err, transporters) {
                        res.render('tickets/editticket.ejs', {
                            successFlash: req.flash('success'),
                            errorFlash: req.flash('error'),
                            ticket: ticket,
                            cust_s: cust_s,
                            buyer_s: buyer_s,
                            transporters: transporters
                        });
                    });
                });
            });
        });
    },

    editTicket: (req, res) => {
        tickets.tickets.editTicket(req, function (err, ticket) {
            if (err) {
                req.flash('error', 'Unable to Edit Ticket Data');
            } else if (ticket) {
                req.flash('success', 'Ticket Data Saved');
            }
            res.redirect('/tickets/');
        });
    },


    getTicketsDocPage: (req, res) => {

        var defaultfolder = `public/company/${req.user.coId}/tickets/doc`;
        var ticket_doc = `${defaultfolder}/${req.params.ticketId}`;
        var ticket_dirarray = [];
        getDirectories(ticket_doc, function (err, dir) {
            for (var i = 0; i < dir.length; i++) {
                dirnew = dir[i].replace('public', '');

                // date_time = '';
                // date = path.basename(daynew).split("_")[1];
                // time = path.basename(daynew).split("_")[2];
                // newtime = time.split(".")[0];
                // date_time = date + " " + newtime;

                ticket_dirarray.push({ docfullpath: dirnew, docfilename: path.basename(dirnew) });
            }
            res.render('tickets/ticketdocument.ejs', {
                successFlash: req.flash('success'),
                errorFlash: req.flash('error'),
                ticket_dir: ticket_dirarray,
                ticketId: req.params.ticketId
            });
        });
    },
    disabledDeleteTicket: (req, res) => {
        tickets.tickets.disableDeleteTicket(
            req.params.disabledordelete,
            req.params.ticketId,
            function (err, ticket) {
                if (err) {
                    req.flash('error', 'Fail');
                    res.redirect('/tickets/');
                } else {
                    req.flash('success', 'Success');
                    res.redirect('/tickets/');
                }
            });
    },
    uploadTicketDocuments: (req, res) => {
        //1 - upload
        //2 - delete
        var mode = req.body.mode;
        //console.log(mode);
        var defaultfolder = `public/company/${req.user.coId}/tickets/doc/`;
        var filefolder = defaultfolder + req.body.ticketId;

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
                                        res.redirect(`/tickets/doc/${req.body.ticketId}`);
                                    }
                                });
                            }
                            req.flash('success', 'Upload Complete');
                            res.redirect(`/tickets/doc/${req.body.ticketId}`);

                        } else { res.redirect(`/tickets/doc/${req.body.ticketId}`); }
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
                                    res.redirect(`/tickets/doc/${req.body.ticketId}`);
                                }
                            });
                        }
                        req.flash('success', 'Upload Complete');
                        res.redirect(`/tickets/doc/${req.body.ticketId}`);

                    } else { res.redirect(`/tickets/doc/${req.body.ticketId}`); }
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
            res.redirect(`/tickets/doc/${req.body.ticketId}`);
        }
    },

};


var getDirectories = function (src, callback) {
    glob(src + '/**/*', callback);
};