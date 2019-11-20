var mysql = require('mysql');
var config = {};
var debug;
debug = 1;

if (debug == 1)
config = {"host":"localhost","user":"root","password":"","database":"mspo","multipleStatements":"true","timezone": 'Z'};
else
config = {"host":"localhost","port":"3306","user":"max","password":"0J9_g7gb","database":"mspo","multipleStatements":"true","timezone": 'Z'};


//  connect to database

var con = mysql.createPool(config);


module.exports = con;
