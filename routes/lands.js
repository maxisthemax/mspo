module.exports = {
    getLandsPage: (req, res) => {

        //cust.customers.queryAllCustomers(null, function (err, customers) {
        //ejs.renderFile('./views/customers/editcustomers.ejs', '', {}, function (err, str) {
        res.render('company/company.ejs', {
            successFlash: req.flash('success'),
            errorFlash: req.flash('error'),
            //customers: customers,
            //cust: [],
        });
        //});
        //});
    },

    getEditLandsPage: (req, res) => { },
    getLandsDocPage: (req, res) => { },
    uploadLandDocuments: (req, res) => { },
    createLand: (req, res) => { },
    editLand: (req, res) => { },
};