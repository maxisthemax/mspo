const fs = require('fs')

var recordsadmin = JSON.parse(fs.readFileSync('./modals/users/users.json', 'utf8'));

exports.findById = function (id, cb) {
  process.nextTick(function () {

    let firstquery = "select * FROM USERS where IFNULL(deactivated,0) != 1 and userid='" + id + "'" + " LIMIT 1";
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
        if (record.userid === id) {
          return cb(null, record);
        }
      }
      return cb(new Error('User ' + id + ' does not exist'));
    });
  });
}

exports.findByUsername = function (username, cb) {
  process.nextTick(function () {
    let firstquery = "select * FROM USERS where IFNULL(deactivated,0) != 1 and username='" + username + "'" + " LIMIT 1";

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

exports.findAllUsers = function (coid, cb) {
  process.nextTick(function () {
    let firstquery = `select a.*,b.*,a.deactivated as userdeactivated,b.deactivated as companydeactivated FROM USERS a LEFT JOIN company b on a.coid = b.coid where b.coid =${coid}`

    con.query(firstquery, function (err, result, fields) {
      if (!err) result = (JSON.parse(JSON.stringify(result))); // Hacky solution
      if (result && result.length) {
        return cb(null, result);
      }
      else {
        return cb(err, null);
      }
    });
  });
}

exports.createUser = function (req, cb) {
  var coid = req.user.coid;
  var user = req.body;
  process.nextTick(function () {
    user.username = user.username ? [].concat(user.username) : [''];
    user.password = user.password ? [].concat(user.password) : [''];
    user.displayname = user.displayname ? [].concat(user.displayname) : [''];
    user.email = user.email ? [].concat(user.email) : [''];

    let firstquery = "INSERT INTO USERS (username,userpassword,displayname,email,deactivated,coid) VALUES ("
      + "'" + user.username[0] + "',"
      + "'" + user.password[0] + "',"
      + "'" + user.displayname[0] + "',"
      + "'" + user.email[0] + "',"
      + "'" + "0" + "',"
      + "" + coid + ""
      + ")";
    console.log(firstquery);
    con.query(firstquery, function (err, result) {
      //console.log(result);
      if (err) {
        return cb(err, null);
      }
      else if (result && result.insertId) {
        return cb(null, result.insertId);
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

    users.userid = users.userid ? [].concat(users.userid) : [''];


    var firstquery = '';
    for (var i = 0, len = users.userid.length; i < len; i++) {
      firstquery += "UPDATE USERS set"
        + " displayname='"
        + addescape(users.displayname[i]) + "',"
        + " email='"
        + addescape(users.email[i]) + "',"
        + " administrator='"
        + addescape(users.admin[i]) + "',"
        + " deactivated='"
        + addescape(users.deactivated[i]) + "'"
        + " where userid=" + users.userid[i] + ";";
    }

    con.query(firstquery, function (err, result) {
      //console.log(result);
      if (result && result.length) {
        return cb(null, result);
      }
      else {
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