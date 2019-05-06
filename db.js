const sql = require("mssql");
const config = require('./config.json');

//  connect to database
sql.connect(config, function (err) {
    if (err) {
        throw err;
    }
    else {
        console.log('Connected to database');
    }
});

module.exports = sql;


