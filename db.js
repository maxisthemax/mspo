var mysql = require('mysql');
const config = {"host":"us-cdbr-iron-east-02.cleardb.net","user":"bc87d1f61f506e","password":"7252eff05e0cad1","database":"heroku_cb104ca2b7e8ce0","multipleStatements":"true"};

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

