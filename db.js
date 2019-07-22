var mysql = require('mysql');
var config = {};
var debug;
debug = 0;

if (debug == 1)
config = {"host":"localhost","user":"root","password":"","database":"mspo","multipleStatements":"true"};
else
config = {"host":"localhost","port":"3306","user":"max","password":"0J9_g7gb","database":"mspo","multipleStatements":"true"};


//  connect to database

var con = mysql.createConnection(config);

con.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + con.threadId);
});
handleDisconnect(con);

function handleDisconnect(con) {
    con.on('error', function (err) {
        if (!err.fatal) {
            return;
        }

        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            throw err;
        }
        console.log('Re-connecting lost connection: ' + err.stack);
        con = mysql.createConnection(config);
        handleDisconnect(con);
        con.connect();
    });
}
handleDisconnect(con);

module.exports = con;

