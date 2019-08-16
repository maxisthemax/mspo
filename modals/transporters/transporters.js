exports.queryAllTransporters = function (coId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT * FROM transporters a where a.coId = ${coId} and disabled = 0`;

    con.query(firstquery, function (err, result, fields) {
      if (result) result = JSON.parse(JSON.stringify(result));
      if (result && result.length) {
        return cb(null, result);
      }
      else {
        return cb(err, null);
      }
    });
  });
}

exports.queryAllTransportersDisabled = function (coId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT * FROM transporters a where a.coId = ${coId} and disabled = 1`;;
    con.query(firstquery, function (err, result, fields) {
      if (result) result = JSON.parse(JSON.stringify(result));
      if (result && result.length) {
        return cb(null, result);
      }
      else {
        return cb(err, null);
      }
    });
  });
}

exports.disableDeleteTransporter = function (disableDelete, transporterId, cb) {
  process.nextTick(function () {
    var firstquery = ""
    if (disableDelete == "disabled") {
      firstquery = `UPDATE transporters SET disabled = 1 WHERE transporterId = ${transporterId}`;
    } else if (disableDelete == "restore") {
      firstquery = `UPDATE transporters SET disabled = 0 WHERE transporterId = ${transporterId}`;
    } else if (disableDelete == "delete") {
      firstquery = `DELETE FROM transporters WHERE transporterId = ${transporterId}`;
    }

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

exports.queryTransporter = function (transporterId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT * FROM transporters 
    WHERE transporterId=${transporterId}`;
    con.query(firstquery, function (err, result, fields) {
      if (result) result = JSON.parse(JSON.stringify(result));
      if (result && result.length) {
        return cb(null, result);
      }
      else {
        return cb(err, null);
      }
    });
  });
}

exports.editTransporter = function (req, cb) {
  var transporter = req.body;
  process.nextTick(function () {

    transporter.transporterName = transporter.transporterName ? [].concat(transporter.transporterName) : [''];
    transporter.transporterAdd = transporter.transporterAdd ? [].concat(transporter.transporterAdd) : [''];
    transporter.transporterVehNo = transporter.transporterVehNo ? [].concat(transporter.transporterVehNo) : [''];
    transporter.priceMt = transporter.priceMt ? [].concat(transporter.priceMt) : [''];
    // transporter.totalTransport = transporter.totalTransport ? [].concat(transporter.totalTransport) : [''];
    // transporter.nettWeight = transporter.nettWeight ? [].concat(transporter.nettWeight) : [''];
    // transporter.transporterId = transporter.transporterId ? [].concat(transporter.transporterId) : [''];

    let firstquery = `UPDATE transporters SET 
    transporterName = "${transporter.transporterName[0]}",
    transporterAdd = "${transporter.transporterAdd[0]}",
    transporterVehNo = "${transporter.transporterVehNo[0]}"
    where transporterId= "${transporter.transporterId[0]}"`
console.log(firstquery);
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

exports.createTransporter = function (req, cb) {
  var coId = req.user.coId;
  var transporter = req.body;
  process.nextTick(function () {

    transporter.transporterName = transporter.transporterName ? [].concat(transporter.transporterName) : [''];
    transporter.transporterAdd = transporter.transporterAdd ? [].concat(transporter.transporterAdd) : [''];
    //transporter.transporterVehNo = transporter.transporterVehNo ? [].concat(transporter.transporterVehNo) : [''];
    transporter.totalVehno = transporter.totalVehno ? [].concat(transporter.totalVehno) : [''];
    var transporterVehNo = [];
    for(var i = 1; i <= transporter.totalVehno; i++) {
      transporterVehNo.push(transporter[`transporterVehNo[${i}]`]);
    }
  
    let firstquery = '';
    for(var i = 0; i < transporterVehNo.length; i++) {
      let query = `INSERT INTO transporters
      (transporterName,transporterAdd, transporterVehNo,createdDate,coId)
      VALUES ('${transporter.transporterName}','${transporter.transporterAdd}','${transporterVehNo[i]}'
      ,CURRENT_TIMESTAMP,'${coId}');`;
      firstquery =`${firstquery + query}`;
    }

    con.query(firstquery, function (err, result, fields) {
      if (result) result = JSON.parse(JSON.stringify(result));
      if (result.length>0) {
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