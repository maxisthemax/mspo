exports.queryAllLands = function (coId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT a.*,b.custName,b.custIC FROM lands a LEFT JOIN customers b on a.custId = b.custId
    WHERE a.coId = ${coId} and a.disabled = 0 ORDER BY custId ASC,landId ASC`;
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

exports.queryAllLandsDisabled = function (coId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT a.*,b.custName,b.custIC FROM lands a LEFT JOIN customers b on a.custId = b.custId
    WHERE a.coId = ${coId} and a.disabled = 1 ORDER BY custId ASC,landId ASC`;
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

exports.disableDeleteLand = function (disableDelete, landId, cb) {
  process.nextTick(function () {
    var firstquery =""
    if (disableDelete == "disabled") {
      firstquery = `UPDATE lands SET disabled = 1 WHERE landId = ${landId}`;
    } else if (disableDelete == "restore") {
      firstquery = `UPDATE lands SET disabled = 0 WHERE landId = ${landId}`;
    } else if (disableDelete == "delete") {
      firstquery = `DELETE FROM lands WHERE landId = ${landId}`;
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

exports.queryLand = function (landId, cb) {
  process.nextTick(function () {
    var firstquery = `SELECT * FROM lands 
    WHERE landId=${landId} ORDER BY custId`;
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

exports.editLand = function (req, cb) {
  var land = req.body;
  process.nextTick(function () {

    land.landId = land.landId ? [].concat(land.landId) : [''];
    land.lotNo = land.lotNo ? [].concat(land.lotNo) : [''];
    land.titleNo = land.titleNo ? [].concat(land.titleNo) : [''];
    land.area = land.area ? [].concat(land.area) : [''];
    land.custId = land.custId ? [].concat(land.custId) : [''];
    land.usageOfLand = land.usageOfLand ? [].concat(land.usageOfLand) : [''];
    land.typeOfCondition = land.typeOfCondition ? [].concat(land.typeOfCondition) : [''];
    land.gpsLocationLng = land.gpsLocationLng ? [].concat(land.gpsLocationLng) : [''];
    land.gpsLocationLat = land.gpsLocationLat ? [].concat(land.gpsLocationLat) : [''];

    land.mukim = land.mukim ? [].concat(land.mukim) : [''];
    land.yearPlanted = land.yearPlanted ? [].concat(land.yearPlanted) : [''];
    land.isMSPO = land.isMSPO ? [].concat(land.isMSPO) : [''];

    let firstquery = `UPDATE lands SET 
    lotNo = "${land.lotNo[0]}",
    titleNo = "${land.titleNo[0]}",
    area = "${land.area[0]}",
    custId = "${land.custId[0]}",
    usageOfLand = "${land.usageOfLand[0]}",
    typeOfCondition = "${land.typeOfCondition[0]}",
    gpsLocationLng = "${land.gpsLocationLng[0]}",
    gpsLocationLat = "${land.gpsLocationLat[0]}",
    mukim = "${land.mukim[0]}", 
    yearPlanted = "${land.yearPlanted[0]}",
    isMSPO = "${land.isMSPO[0]}"
    where landId= "${land.landId[0]}"`

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

    land.landId = land.landId ? [].concat(land.landId) : [''];
    land.lotNo = land.lotNo ? [].concat(land.lotNo) : [''];
    land.titleNo = land.titleNo ? [].concat(land.titleNo) : [''];
    land.area = land.area ? [].concat(land.area) : [''];
    land.custId = land.custId ? [].concat(land.custId) : [''];
    land.usageOfLand = land.usageOfLand ? [].concat(land.usageOfLand) : [''];
    land.typeOfCondition = land.typeOfCondition ? [].concat(land.typeOfCondition) : [''];
    land.gpsLocationLng = land.gpsLocationLng ? [].concat(land.gpsLocationLng) : [''];
    land.gpsLocationLat = land.gpsLocationLat ? [].concat(land.gpsLocationLat) : [''];

    land.mukim = land.mukim ? [].concat(land.mukim) : [''];
    land.yearPlanted = land.yearPlanted ? [].concat(land.yearPlanted) : [''];
    land.isMSPO = land.isMSPO ? [].concat(land.isMSPO) : [''];

    let firstquery = `INSERT INTO lands 
    (lotNo,titleNo, area, custId, usageOfLand, typeOfCondition, gpsLocationLng, gpsLocationLat,coId,createdDate,
      mukim,yearPlanted,isMSPO)
    VALUES ('${land.lotNo}','${land.titleNo}','${land.area}','${land.custId}'
    ,'${land.usageOfLand}','${land.typeOfCondition}','${land.gpsLocationLng}','${land.gpsLocationLat}','${coId}','CURRENT_TIMESTAMP',
    '${land.mukim}','${land.yearPlanted}','${land.isMSPO}')`;

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