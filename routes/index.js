var comp = require("../modals/company");
module.exports = {
  getHomePage: (req, res) => {
    comp.company.queryCompany(req.user.coId, function (err, company) {
      res.render("home.ejs", {
        company: company,
        user: req.user,
        successFlash: req.flash("success"),
        errorFlash: req.flash("error"),
      });
    });
  },
};
