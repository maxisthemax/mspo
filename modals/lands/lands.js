exports.queryAllLands = function (coId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT a.*,b.custName,b.custIC FROM lands a LEFT JOIN customers b on a.custId = b.custId
    WHERE a.coId = ${coId} ORDER BY custId`;
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

exports.queryLand = function (lotId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT * FROM lands 
    WHERE lotId=${lotId} ORDER BY custId`;
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
// exports.queryCustomers = function (custId, cb) {
//   process.nextTick(function () {
//     var firstquery = `SELECT * FROM customers WHERE 1 and custId=${custId} ORDER BY custId`;
//     con.query(firstquery, function (err, result, fields) {
//       console.log(result);
//       if (result) result = JSON.parse(JSON.stringify(result));
//       if (result && result.length) {
//         return cb(null, result);
//       }
//       else {
//         return cb(err, null);
//       }
//     });
//   });
// }
exports.editLand = function (req, cb) {
  var land = req.body;
  process.nextTick(function () {

    land.lotId = land.lotId ? [].concat(land.lotId) : [''];
    land.lotNo = land.lotNo ? [].concat(land.lotNo) : [''];
    land.titleNo = land.titleNo ? [].concat(land.titleNo) : [''];
    land.area = land.area ? [].concat(land.area) : [''];
    land.custId = land.custId ? [].concat(land.custId) : [''];
    land.usageOfLand = land.usageOfLand ? [].concat(land.usageOfLand) : [''];
    land.typeOfCondition = land.typeOfCondition ? [].concat(land.typeOfCondition) : [''];
    land.gpsLocationLng = land.gpsLocationLng ? [].concat(land.gpsLocationLng) : [''];
    land.gpsLocationLat = land.gpsLocationLat ? [].concat(land.gpsLocationLat) : [''];


    let firstquery = `UPDATE lands SET 
    lotNo = "${land.lotNo[0]}",
    titleNo = "${land.titleNo[0]}",
    area = "${land.area[0]}",
    custId = "${land.custId[0]}",
    usageOfLand = "${land.usageOfLand[0]}",
    typeOfCondition = "${land.typeOfCondition[0]}",
    gpsLocationLng = "${land.gpsLocationLng[0]}",
    gpsLocationLat = "${land.gpsLocationLat[0]}"
    where lotId= "${land.lotId[0]}"`

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

exports.createLand = function (req, cb) {
  var coId = req.user.coId;
  var land = req.body;
  process.nextTick(function () {

    land.lotId = land.lotId ? [].concat(land.lotId) : [''];
    land.lotNo = land.lotNo ? [].concat(land.lotNo) : [''];
    land.titleNo = land.titleNo ? [].concat(land.titleNo) : [''];
    land.area = land.area ? [].concat(land.area) : [''];
    land.custId = land.custId ? [].concat(land.custId) : [''];
    land.usageOfLand = land.usageOfLand ? [].concat(land.usageOfLand) : [''];
    land.typeOfCondition = land.typeOfCondition ? [].concat(land.typeOfCondition) : [''];
    land.gpsLocationLng = land.gpsLocationLng ? [].concat(land.gpsLocationLng) : [''];
    land.gpsLocationLat = land.gpsLocationLat ? [].concat(land.gpsLocationLat) : [''];

    let firstquery = `INSERT INTO lands 
    (lotNo,titleNo, area, custId, usageOfLand, typeOfCondition, gpsLocationLng, gpsLocationLat,coId,createdDate)
    VALUES ('${land.lotNo}','${land.titleNo}','${land.area}','${land.custId}'
    ,'${land.usageOfLand}','${land.typeOfCondition}','${land.gpsLocationLng}','${land.gpsLocationLat}','${coId}','CURRENT_TIMESTAMP')`;

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