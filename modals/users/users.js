const fs = require('fs')

var recordsadmin = JSON.parse(fs.readFileSync('./modals/users/users.json', 'utf8'));

exports.findById = function (id, cb) {
    process.nextTick(function () {

        let firstquery = `select a.* FROM users a LEFT JOIN company b ON a.coId = b.coId 
        where IFNULL(a.deactivated,0) != 1 and IFNULL(b.deactivated,0) != 1 and userId='${id}' LIMIT 1`;
        con.query(firstquery, function (err, result, fields) {
            if (!err) result = (JSON.parse(JSON.stringify(result))); // Hacky solution
            var records = [];
            for (var i = 0, len = recordsadmin.length; i < len; ++i) {
                records.push(recordsadmin[i]);
            }
            if (result && result.length) {
                records.push(result[0]);
            }

            for (var i = 0, len = records.length; i < len; i++) {
                var record = records[i];
                if (record.userId === id) {
                    return cb(null, record);
                }
            }
            return cb(new Error('User ' + id + ' does not exist'));
        });
    });
}

exports.findByUsername = function (username, cb) {
    process.nextTick(function () {
        let firstquery = `select a.* FROM users a LEFT JOIN company b ON a.coId = b.coId 
        where IFNULL(a.deactivated,0) != 1 and IFNULL(b.deactivated,0) != 1 and userName='${username}' LIMIT 1`;

        con.query(firstquery, function (err, result, fields) {
            if (!err) result = (JSON.parse(JSON.stringify(result))); // Hacky solution
            var records = [];
            for (var i = 0, len = recordsadmin.length; i < len; ++i) {
                records.push(recordsadmin[i]);
            }

            if (result && result.length) {
                records.push(result[0]);
            }

            for (var i = 0, len = records.length; i < len; i++) {
                var record = records[i];
                if (record.username === username) {
                    return cb(null, record);
                }
            }
            return cb(null, null);
        });
    });
}

exports.findAllUsers = function (coId, cb) {
    process.nextTick(function () {
        let firstquery = `select a.*,b.*,a.deactivated as userdeactivated,b.deactivated as companydeactivated FROM users a LEFT JOIN company b on a.coId = b.coId where b.coId =${coId}`

        con.query(firstquery, function (err, result, fields) {
            //console.log(result);
            if (!err) result = (JSON.parse(JSON.stringify(result))); // Hacky solution
            if (result && result.length) {
                return cb(null, result);
            } else {
                return cb(err, null);
            }
        });
    });
}

exports.createUser = function (req, cb) {
    var coId = req.user.coId;
    var user = req.body;
    process.nextTick(function () {
        let query = `select maxUsers,COUNT(b.userId) AS countUsers FROM company a 
        LEFT JOIN users b on a.coId = b.coId
        where a.coId=${coId}
        GROUP BY b.coId`;

        con.query(query, function (err, result) {
            if (result[0].countUsers < result[0].maxUsers) {
                user.username = user.username ? [].concat(user.username) : [''];
                user.password = user.password ? [].concat(user.password) : [''];
                user.displayname = user.displayname ? [].concat(user.displayname) : [''];
                user.email = user.email ? [].concat(user.email) : [''];

                let firstquery = "INSERT INTO users (username,userpassword,displayname,email,deactivated,administrator,coId,createdDate) VALUES (" +
                    "'" + user.username[0] + "'," +
                    "'" + user.password[0] + "'," +
                    "'" + user.displayname[0] + "'," +
                    "'" + user.email[0] + "'," +
                    "'" + "0" + "'," +
                    "'" + "0" + "'," +
                    "" + coId + "," +
                    "" + "CURRENT_TIMESTAMP" + "" +
                    ")";

                con.query(firstquery, function (err, result) {
                    //console.log(err);
                    if (err) {
                        return cb(err.code, null);
                    } else if (result && result.insertId) {
                        return cb(null, result.insertId);
                    }
                });
            } else {
                return cb("Unable Create Account Anymore, Please Contact SafeRack", null);
            }

        });
    });
}

exports.saveUserToken = function (req, cb) {
    process.nextTick(function () {

        var firstquery = '';
        firstquery = `UPDATE users SET token = '${req.session.token}' where userId = ${req.user.userId}`;
        con.query(firstquery, function (err, result) {
            //console.log(result);
            if (result && result.length) {
                return cb(null, result);
            } else {
                return cb(err, null);
            }
        });
    });
}

exports.saveAllUsers = function (users, cb) {
    process.nextTick(function () {
        if (!users) {
            return cb(null, null);
        }
        users.deactivated = users.deactivated ? [].concat(users.deactivated) : [''];
        users.admin = users.admin ? [].concat(users.admin) : [''];
        users.email = users.email ? [].concat(users.email) : [''];
        users.displayname = users.displayname ? [].concat(users.displayname) : [''];

        users.userId = users.userId ? [].concat(users.userId) : [''];


        var firstquery = '';
        for (var i = 0, len = users.userId.length; i < len; i++) {
            firstquery += "UPDATE users set" +
                " displayname='" +
                addescape(users.displayname[i]) + "'," +
                " email='" +
                addescape(users.email[i]) + "'," +
                " administrator='" +
                addescape(users.admin[i]) + "'," +
                " deactivated='" +
                addescape(users.deactivated[i]) + "'" +
                " where userId=" + users.userId[i] + ";";
        }

        con.query(firstquery, function (err, result) {
            //console.log(result);
            if (result && result.length) {
                return cb(null, result);
            } else {
                return cb(err, null);
            }
        });
    });
}

function addescape(str) {
    var strconv = '';
    strconv = str;
    if (typeof strconv === 'string') {
        strconv = strconv.replace("'", "''");
    }
    return strconv;
}