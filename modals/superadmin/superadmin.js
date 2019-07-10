exports.queryAllsuperadmin = function (coId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT * FROM company where coId <> 1 ORDER BY coName`;
    //console.log(firstquery);
    con.query(firstquery, function (err, result, fields) {
      if (result) result = JSON.parse(JSON.stringify(result));
      if (result && result.length) {
        return cb(null, result);
      } else {
        return cb(err, null);
      }
    });
  });
}

exports.querysuperadmin = function (coId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT * FROM company where coId = ${coId} LIMIT 1`;
    //console.log(firstquery);
    con.query(firstquery, function (err, result, fields) {
      if (result) result = JSON.parse(JSON.stringify(result));
      if (result && result.length) {
        return cb(null, result);
      } else {
        return cb(err, null);
      }
    });
  });
}

exports.createsuperadmin = function (req, cb) {
  var comp = req.body;
  //console.log(mspo);
  process.nextTick(function () {

    comp.compname = comp.compname ? [].concat(comp.compname) : [''];
    comp.compadd = comp.compadd ? [].concat(comp.compadd) : [''];
    comp.comptel = comp.comptel ? [].concat(comp.comptel) : [''];
    comp.username = comp.username ? [].concat(comp.username) : [''];
    comp.password = comp.password ? [].concat(comp.password) : [''];

    let firstquery = `INSERT INTO company 
  (coName,coAdd,coTel, deactivated, createdDate)
  VALUES ('${comp.compname}','${comp.compadd}','${comp.comptel}','0',CURRENT_TIMESTAMP)`;

    //console.log(firstquery);
    con.query(firstquery, function (err, result, fields) {
      if (result) result = JSON.parse(JSON.stringify(result));
      if (result && result.insertId) {
        var compres = result;
        var thisId = result.insertId;
        let secondquery = `INSERT INTO USERS (username,userpassword,displayname,deactivated,administrator,coId) VALUES (
                      '${comp.username}','${comp.password}','${comp.compname}','0','1',${thisId})`;
        console.log(secondquery);
        con.query(secondquery, function (err, result, fields) {
          if (result) result = JSON.parse(JSON.stringify(result));
          if (result && result.insertId) {
            return cb(null, compres);
          } else {
            return cb(err, null);
          }
        });
      } else {
        return cb(err, null);
      }
    });
  });
}
exports.deactivateCompany = function (mode,coId, cb) {

  if(mode == "deactivate")
  var modeNo = 1;
  else if (mode == "activate")
  var modeNo = 0;

  process.nextTick(function () {
    var  firstquery = `UPDATE company SET deactivated = ${modeNo} WHERE coId = ${coId}`;

    con.query(firstquery, function (err, result, fields) {
      if (result) {
        return cb(null, result);
      }
      else {
        return cb(err, null);
      }
    });
  });
}

exports.editsuperadmin = function (req, cb) {
  var company = req.body;
  process.nextTick(function () {
    //console.log(company);
    company.coId = company.coId ? [].concat(company.coId) : [''];
    company.compname = company.compname ? [].concat(company.compname) : [''];
    company.compadd = company.compadd ? [].concat(company.compadd) : [''];
    company.comptel = company.comptel ? [].concat(company.comptel) : [''];

    let firstquery = `UPDATE company SET 
    coName = "${company.compname[0]}",
    coAdd = "${company.compadd[0]}",
    coTel = "${company.comptel[0]}"
    where coId= "${company.coId[0]}"`
    //console.log(firstquery);
    con.query(firstquery, function (err, result, fields) {
      if (result) result = JSON.parse(JSON.stringify(result));
      //console.log(result);
      if (result) {
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