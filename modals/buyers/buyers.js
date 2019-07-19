exports.queryAllBuyers = function (coId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT *,CASE WHEN a.buyerCategory = 1 THEN 'Oil Mil' WHEN a.buyerCategory = 2 THEN 'Dealer' ELSE '' END AS categoryname FROM buyers a where a.coId = ${coId} and disabled = 0`;

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

exports.queryAllBuyersDisabled = function (coId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT *,CASE WHEN a.buyerCategory = 1 THEN 'Oil Mil' WHEN a.buyerCategory = 2 THEN 'Dealer' ELSE '' END AS categoryname FROM buyers a where a.coId = ${coId} and disabled = 1`;
    //console.log(firstquery);
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

exports.disableDeleteBuyer = function (disableDelete, buyerId, cb) {
  process.nextTick(function () {
    var firstquery = ""
    if (disableDelete == "disabled") {
      firstquery = `UPDATE buyers SET disabled = 1 WHERE buyerId = ${buyerId}`;
    } else if (disableDelete == "restore") {
      firstquery = `UPDATE buyers SET disabled = 0 WHERE buyerId = ${buyerId}`;
    } else if (disableDelete == "delete") {
      firstquery = `DELETE FROM buyers WHERE buyerId = ${buyerId}`;
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

exports.queryBuyer = function (buyerId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT * FROM buyers 
    WHERE buyerId=${buyerId}`;
    //console.log(firstquery);
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

exports.editBuyer = function (req, cb) {
  var buyer = req.body;
  process.nextTick(function () {

    buyer.mspoLicNo = buyer.mspoLicNo ? [].concat(buyer.mspoLicNo) : [''];
    buyer.mpobLicNo = buyer.mpobLicNo ? [].concat(buyer.mpobLicNo) : [''];
    buyer.buyerName = buyer.buyerName ? [].concat(buyer.buyerName) : [''];
    buyer.buyerAddress = buyer.buyerAddress ? [].concat(buyer.buyerAddress) : [''];
    buyer.buyerCategory = buyer.buyerCategory ? [].concat(buyer.buyerCategory) : [''];
    buyer.buyerId = buyer.buyerId ? [].concat(buyer.buyerId) : [''];

    let firstquery = `UPDATE buyers SET 
    buyerName = "${buyer.buyerName[0]}",
    buyerAddress = "${buyer.buyerAddress[0]}",
    buyerCategory = "${buyer.buyerCategory[0]}",
    mspoLicNo = "${buyer.mspoLicNo[0]}",
    mpobLicNo = "${buyer.mpobLicNo[0]}"
    where buyerId= "${buyer.buyerId[0]}"`

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

exports.createBuyer = function (req, cb) {
  var coId = req.user.coId;
  var buyer = req.body;

  process.nextTick(function () {

    buyer.mspoLicNo = buyer.mspoLicNo ? [].concat(buyer.mspoLicNo) : [''];
    buyer.mpobLicNo = buyer.mpobLicNo ? [].concat(buyer.mpobLicNo) : [''];
    buyer.buyerName = buyer.buyerName ? [].concat(buyer.buyerName) : [''];
    buyer.buyerAddress = buyer.buyerAddress ? [].concat(buyer.buyerAddress) : [''];
    buyer.buyerCategory = buyer.buyerCategory ? [].concat(buyer.buyerCategory) : [''];

    let firstquery = `INSERT INTO buyers 
    (buyerName,buyerAddress, buyerCategory,coId,createdDate,mspoLicNo,mpobLicNo)
    VALUES ('${buyer.buyerName}','${buyer.buyerAddress}','${buyer.buyerCategory}'
    ,'${coId}',CURRENT_TIMESTAMP,'${buyer.mspoLicNo}','${buyer.mpobLicNo}')`;

    con.query(firstquery, function (err, result, fields) {
      if (result) result = JSON.parse(JSON.stringify(result));
      if (result && result.insertId) {
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