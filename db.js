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
        con = mysql.createConnection(config.CLEARDB_DATABASE_URL);
        handleDisconnect(con);
        con.connect();
    });
}
handleDisconnect(con);

module.exports = con;

