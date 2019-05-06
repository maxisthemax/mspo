const fs = require('fs')

var recordsadmin = JSON.parse(fs.readFileSync('./modals/users/users.json', 'utf8'));

exports.findById = function (id, cb) {
  process.nextTick(function () {

    let firstquery = "select TOP 1 * USERS where isnull(deactivated,0) != 1 and userid='" + id + "'";

    var request = new sql.Request();
    request.query(firstquery, function (err, recordset) {

      var records = [];
      for (var i = 0, len = recordsadmin.length; i < len; ++i) {
        records.push(recordsadmin[i]);
      }
      if (recordset && recordset.recordset && recordset.recordset.length) {
        records.push(recordset.recordset[0]);
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
    let firstquery = "select TOP 1 * FROM USERS where isnull(deactivated,0) != 1 and username='" + username + "'";

    var request = new sql.Request();
    request.query(firstquery, function (err, recordset) {
      var records = [];
      for (var i = 0, len = recordsadmin.length; i < len; ++i) {
        records.push(recordsadmin[i]);
      }
      if (recordset && recordset.recordset && recordset.recordset.length) {
        records.push(recordset.recordset[0]);
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

exports.findAllUsers = function (cb) {
  process.nextTick(function () {
    let firstquery = "select * FROM CHARTAPP.dbo.USERS"
    var request = new sql.Request();
    request.query(firstquery, function (err, recordset) {
      if (recordset && recordset.recordset && recordset.recordset.length) {
        return cb(null, recordset.recordset);
      }
      else {
        return cb(err, null);
      }
    });
  });
}

exports.createUser = function (user, cb) {
  process.nextTick(function () {
    user.username = user.username ? [].concat(user.username) : [''];
    user.password = user.password ? [].concat(user.password) : [''];
    user.displayname = user.displayname ? [].concat(user.displayname) : [''];
    user.email = user.email ? [].concat(user.email) : [''];

    let firstquery = "INSERT INTO CHARTAPP.dbo.USERS (username,userpassword,displayname,email,deactivated) VALUES ("
      + "'" + user.username[0] + "',"
      + "'" + user.password[0] + "',"
      + "'" + user.displayname[0] + "',"
      + "'" + user.email[0] + "'," 
      + "'" + "0" + "'"
      + ")";

    var request = new sql.Request();
    request.query(firstquery, function (err, recordset) {

      if (err) {
        return cb(err, null);
      }
      else if (recordset && recordset.rowsAffected) {
        return cb(null, recordset.rowsAffected);
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
      firstquery += "UPDATE CHARTAPP.dbo.USERS set"
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



    var request = new sql.Request();
    request.query(firstquery, function (err, recordset) {
      if (recordset && recordset.rowsAffected) {
        return cb(null, recordset.rowsAffected);
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