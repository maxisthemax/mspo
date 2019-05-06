var cust = require("../modals/customers");
module.exports = {
    getCustomersPage: (req, res) => {
        cust.customers.queryAllCustomers(null, function (err, customers) {
            console.log(customers);
            res.render('customers.ejs', {
                customers: customers,
            });
        });
    },
};