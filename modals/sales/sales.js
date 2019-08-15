exports.queryAllSales = function (coId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT * FROM sales a LEFT JOIN company b ON a.coId = b.coId
    LEFT JOIN buyers d ON d.buyerId = a.buyerId 
    LEFT JOIN transporters e ON e.transporterId = a.transporterId
    where a.coId = ${coId} and a.disabled = 0`;
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

exports.queryAllSalesDisabled = function (coId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT * FROM sales a LEFT JOIN company b ON a.coId = b.coId 
    LEFT JOIN buyers d ON d.buyerId = a.buyerId 
    LEFT JOIN transporters e ON e.transporterId = a.transporterId
    where a.coId = ${coId} and a.disabled = 1`;
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

exports.disableDeleteSale = function (disableDelete, saleId, cb) {
  process.nextTick(function () {
    var firstquery =""
    if (disableDelete == "disabled") {
      firstquery = `UPDATE sales SET disabled = 1 WHERE saleId = ${saleId}`;
    } else if (disableDelete == "restore") {
      firstquery = `UPDATE sales SET disabled = 0 WHERE saleId = ${saleId}`;
    } else if (disableDelete == "delete") {
      firstquery = `DELETE FROM sales WHERE saleId = ${saleId}`;
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

exports.querySale = function (saleId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT * FROM sales a
    LEFT JOIN transporters e ON e.transporterId = a.transporterId
    WHERE saleId=${saleId}`;
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

exports.editSale = function (req, cb) {
  var sale = req.body;
  process.nextTick(function () {

    sale.saleDate = sale.saleDate ? [].concat(sale.saleDate) : [''];
    sale.saleNo = sale.saleNo ? [].concat(sale.saleNo) : [''];
    sale.vehicleNo = sale.vehicleNo ? [].concat(sale.vehicleNo) : [''];
    sale.buyerId = sale.buyerId ? [].concat(sale.buyerId) : [''];
    sale.firstWeight = sale.firstWeight ? [].concat(sale.firstWeight) : [''];
    sale.secondWeight = sale.secondWeight ? [].concat(sale.secondWeight) : [''];
    sale.deduction = sale.deduction ? [].concat(sale.deduction) : [''];
    sale.nettWeight = sale.nettWeight ? [].concat(sale.nettWeight) : [''];
    sale.priceMt = sale.priceMt ? [].concat(sale.priceMt) : [''];
    sale.totalPrice = sale.totalPrice ? [].concat(sale.totalPrice) : [''];
    sale.oer = sale.oer ? [].concat(sale.oer) : [''];
    sale.saleId = sale.saleId ? [].concat(sale.saleId) : [''];
    sale.transporterId = sale.transporterId ? [].concat(sale.transporterId) : [''];
    let firstquery = `UPDATE sales SET 
    saleDate = "${sale.saleDate[0]}",
    saleNo = "${sale.saleNo[0]}",
    vehicleNo = "${sale.vehicleNo[0]}",
    buyerId = "${sale.buyerId[0]}",
    firstWeight = "${sale.firstWeight[0]}",
    secondWeight = "${sale.secondWeight[0]}",
    deduction = "${sale.deduction[0]}",
    nettWeight = "${sale.nettWeight[0]}",
    priceMt = "${sale.priceMt[0]}",
    totalPrice = "${sale.totalPrice[0]}",
    oer = "${sale.oer[0]}",
    transporterId = "${sale.transporterId[0]}"
    where saleId= "${sale.saleId[0]}"`

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

exports.createSale = function (req, cb) {
  var coId = req.user.coId;
  var sale = req.body;

  process.nextTick(function () {

    sale.saleDate = sale.saleDate ? [].concat(sale.saleDate) : [''];
    sale.saleNo = sale.saleNo ? [].concat(sale.saleNo) : [''];
    sale.vehicleNo = sale.vehicleNo ? [].concat(sale.vehicleNo) : [''];
    sale.buyerId = sale.buyerId ? [].concat(sale.buyerId) : [''];
    sale.firstWeight = sale.firstWeight ? [].concat(sale.firstWeight) : [''];
    sale.secondWeight = sale.secondWeight ? [].concat(sale.secondWeight) : [''];
    sale.deduction = sale.deduction ? [].concat(sale.deduction) : [''];
    sale.nettWeight = sale.nettWeight ? [].concat(sale.nettWeight) : [''];
    sale.priceMt = sale.priceMt ? [].concat(sale.priceMt) : [''];
    sale.totalPrice = sale.totalPrice ? [].concat(sale.totalPrice) : [''];
    sale.oer = sale.oer ? [].concat(sale.oer) : [''];
    sale.transporterId = sale.transporterId ? [].concat(sale.transporterId) : [''];
    let firstquery = `INSERT INTO sales 
    (saleDate,saleNo, vehicleNo, buyerId, firstWeight, secondWeight, deduction, nettWeight,priceMt,totalPrice,oer,coId,createdDate,transporterId)
    VALUES ('${sale.saleDate}','${sale.saleNo}','${sale.vehicleNo}','${sale.buyerId}'
    ,'${sale.firstWeight}','${sale.secondWeight}','${sale.deduction}','${sale.nettWeight}','${sale.priceMt}'
    ,'${sale.totalPrice}','${sale.oer}','${coId}','CURRENT_TIMESTAMP',${sale.transporterId})`;

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