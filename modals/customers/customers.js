exports.queryAllCustomers = function (body, cb) {
  process.nextTick(function () {
    var firstquery = "SELECT * FROM `customers` WHERE 1 ORDER BY custId";
    con.query(firstquery, function (err, result, fields) {
      if (!err) result = (JSON.parse(JSON.stringify(result)));
      if (result && result.length) {
        return cb(null, result);
      }
      else {
        return cb(err, null);
      }
    });
  });
}

exports.createCustomer = function (cust, cb) {
  process.nextTick(function () {

    cust.custno = cust.custno ? [].concat(cust.custno) : [''];
    cust.custname = cust.custname ? [].concat(cust.custname) : [''];
    cust.custic = cust.custic ? [].concat(cust.custic) : [''];
    cust.custtel = cust.custtel ? [].concat(cust.custtel) : [''];
    cust.custadd1 = cust.custadd1 ? [].concat(cust.custadd1) : [''];
    cust.custadd2 = cust.custadd2 ? [].concat(cust.custadd2) : [''];
    cust.custadd3 = cust.custadd3 ? [].concat(cust.custadd3) : [''];
    

    let firstquery = "INSERT INTO `customers` (`custNo`, `custName`, `custIC`, `custTel`, `custAdd1`, `custAdd2`, `custAdd3`, `deactivated`, `createDate`) VALUES ("
      + "'" + cust.custno[0] + "',"
      + "'" + cust.custname[0] + "',"
      + "'" + cust.custic[0] + "',"
      + "'" + cust.custtel[0] + "',"
      + "'" + cust.custadd1[0] + "',"
      + "'" + cust.custadd2[0] + "',"
      + "'" + cust.custadd3[0] + "',"            
      + "'" + "0" + "',"
      + "" + "CURRENT_TIMESTAMP"
      + ")";
    con.query(firstquery, function (err, result, fields) {
      console.log(result);
      console.log(err);
      if (!err) result = (JSON.parse(JSON.stringify(result)));
      if (result && result.length) {
        return cb(null, result);
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

    let firstquery = "INSERT INTO USERS (username,userpassword,displayname,email,deactivated) VALUES ("
      + "'" + user.username[0] + "',"
      + "'" + user.password[0] + "',"
      + "'" + user.displayname[0] + "',"
      + "'" + user.email[0] + "',"
      + "'" + "0" + "'"
      + ")";

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

function addescape(str) {
  var strconv = '';
  strconv = str;
  if (typeof strconv === 'string') {
    strconv = strconv.replace("'", "''");
  }
  return strconv;
} 