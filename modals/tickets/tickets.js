exports.queryAllTickets = function (coId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT *,a.priceMt AS ticketPriceMt FROM tickets a LEFT JOIN company b ON a.coId = b.coId 
    LEFT JOIN customers c ON c.custId = a.custId 
    LEFT JOIN buyers d ON d.buyerId = a.buyerId 
    LEFT JOIN transporters e ON e.transporterId = a.transporterId
    LEFT JOIN lands f ON f.landId = a.landId
    where a.coId = ${coId} and a.disabled = 0`;
    //console.log(firstquery);
    con.query(firstquery, function (err, result, fields) {
      //console.log(result);
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

exports.queryAllTicketsDisabled = function (coId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT *,a.priceMt AS ticketPriceMt FROM tickets a LEFT JOIN company b ON a.coId = b.coId 
    LEFT JOIN customers c ON c.custId = a.custId 
    LEFT JOIN buyers d ON d.buyerId = a.buyerId 
    LEFT JOIN transporters e ON e.transporterId = a.transporterId
    LEFT JOIN lands f ON f.landId = a.landId
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

exports.disableDeleteTicket = function (disableDelete, ticketId, cb) {
  process.nextTick(function () {
    var firstquery =""
    if (disableDelete == "disabled") {
      firstquery = `UPDATE tickets SET disabled = 1 WHERE ticketId = ${ticketId}`;
    } else if (disableDelete == "restore") {
      firstquery = `UPDATE tickets SET disabled = 0 WHERE ticketId = ${ticketId}`;
    } else if (disableDelete == "delete") {
      firstquery = `DELETE FROM tickets WHERE ticketId = ${ticketId}`;
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

exports.queryTicket = function (ticketId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT *,a.priceMt AS ticketPriceMt FROM tickets a
    LEFT JOIN transporters e ON e.transporterId = a.transporterId
    WHERE ticketId=${ticketId}`;

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

exports.editTicket = function (req, cb) {
  var ticket = req.body;
  process.nextTick(function () {

    ticket.ticketDate = ticket.ticketDate ? [].concat(ticket.ticketDate) : [''];
    ticket.ticketNo = ticket.ticketNo ? [].concat(ticket.ticketNo) : [''];
    ticket.vehicleNo = ticket.vehicleNo ? [].concat(ticket.vehicleNo) : [''];
    ticket.buyerId = ticket.buyerId ? [].concat(ticket.buyerId) : [''];
    ticket.firstWeight = ticket.firstWeight ? [].concat(ticket.firstWeight) : [''];
    ticket.secondWeight = ticket.secondWeight ? [].concat(ticket.secondWeight) : [''];
    ticket.deduction = ticket.deduction ? [].concat(ticket.deduction) : [''];
    ticket.nettWeight = ticket.nettWeight ? [].concat(ticket.nettWeight) : [''];
    ticket.priceMt = ticket.priceMt ? [].concat(ticket.priceMt) : [''];
    ticket.totalPrice = ticket.totalPrice ? [].concat(ticket.totalPrice) : [''];
    ticket.oer = ticket.oer ? [].concat(ticket.oer) : [''];
    ticket.custId = ticket.custId ? [].concat(ticket.custId) : [''];
    ticket.ticketId = ticket.ticketId ? [].concat(ticket.ticketId) : [''];
    ticket.transporterId = ticket.transporterId ? [].concat(ticket.transporterId) : [''];
    ticket.landId = ticket.landId ? [].concat(ticket.landId) : [''];
    let firstquery = `UPDATE tickets SET 
    ticketDate = "${ticket.ticketDate[0]}",
    ticketNo = "${ticket.ticketNo[0]}",
    vehicleNo = "${ticket.vehicleNo[0]}",
    buyerId = "${ticket.buyerId[0]}",
    firstWeight = "${ticket.firstWeight[0]}",
    secondWeight = "${ticket.secondWeight[0]}",
    deduction = "${ticket.deduction[0]}",
    nettWeight = "${ticket.nettWeight[0]}",
    priceMt = "${ticket.priceMt[0]}",
    totalPrice = "${ticket.totalPrice[0]}",
    oer = "${ticket.oer[0]}",
    custId = "${ticket.custId[0]}",
    transporterId = "${ticket.transporterId[0]}",
    landId = "${ticket.landId[0]}"
    where ticketId= "${ticket.ticketId[0]}"`
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

exports.createTicket = function (req, cb) {
  var coId = req.user.coId;
  var ticket = req.body;

  process.nextTick(function () {

    ticket.ticketDate = ticket.ticketDate ? [].concat(ticket.ticketDate) : [''];
    ticket.ticketNo = ticket.ticketNo ? [].concat(ticket.ticketNo) : [''];
    ticket.vehicleNo = ticket.vehicleNo ? [].concat(ticket.vehicleNo) : [''];
    ticket.buyerId = ticket.buyerId ? [].concat(ticket.buyerId) : [''];
    ticket.firstWeight = ticket.firstWeight ? [].concat(ticket.firstWeight) : [''];
    ticket.secondWeight = ticket.secondWeight ? [].concat(ticket.secondWeight) : [''];
    ticket.deduction = ticket.deduction ? [].concat(ticket.deduction) : [''];
    ticket.nettWeight = ticket.nettWeight ? [].concat(ticket.nettWeight) : [''];
    ticket.priceMt = ticket.priceMt ? [].concat(ticket.priceMt) : [''];
    ticket.totalPrice = ticket.totalPrice ? [].concat(ticket.totalPrice) : [''];
    ticket.oer = ticket.oer ? [].concat(ticket.oer) : [''];
    ticket.custId = ticket.custId ? [].concat(ticket.custId) : [''];
    ticket.transporterId = ticket.transporterId ? [].concat(ticket.transporterId) : [''];
    ticket.landId = ticket.landId ? [].concat(ticket.landId) : [''];

    let firstquery = `INSERT INTO tickets 
    (ticketDate,ticketNo, vehicleNo, buyerId, firstWeight, secondWeight, deduction, nettWeight,priceMt,totalPrice,oer,coId,createdDate,custId,transporterId,landId)
    VALUES ('${ticket.ticketDate}','${ticket.ticketNo}','${ticket.vehicleNo}','${ticket.buyerId}'
    ,'${ticket.firstWeight}','${ticket.secondWeight}','${ticket.deduction}','${ticket.nettWeight}','${ticket.priceMt}'
    ,'${ticket.totalPrice}','${ticket.oer}','${coId}','CURRENT_TIMESTAMP',${ticket.custId},'${ticket.transporterId[0]}','${ticket.landId[0]}')`;
    //console.log(firstquery);
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