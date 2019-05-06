var mysql = require('mysql');
const config = require('./config.json');

//  connect to database

var con = mysql.createConnection(config);

con.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + con.threadId);
});

module.exports = con;