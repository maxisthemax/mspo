exports.queryAllMpobs = function(coId, cb) {
    process.nextTick(function() {
        var firstquery = `SELECT a.*,b.custName,b.custIC FROM mpobs a LEFT JOIN customers b on a.custId = b.custId
    WHERE a.coId = ${coId} and a.disabled = 0 ORDER BY custId ASC,mpobId ASC`;
        //console.log(firstquery);
        con.query(firstquery, function(err, result, fields) {
            if (result) result = JSON.parse(JSON.stringify(result));
            if (result && result.length) {
                return cb(null, result);
            } else {
                return cb(err, null);
            }
        });
    });
}

exports.queryAllMpobsDisabled = function(coId, cb) {
    process.nextTick(function() {
        var firstquery = `SELECT a.*,b.custName,b.custIC FROM mpobs a LEFT JOIN customers b on a.custId = b.custId
    WHERE a.coId = ${coId} and a.disabled = 1 ORDER BY custId ASC,landId ASC`;
        //console.log(firstquery);
        con.query(firstquery, function(err, result, fields) {
            if (result) result = JSON.parse(JSON.stringify(result));
            if (result && result.length) {
                return cb(null, result);
            } else {
                return cb(err, null);
            }
        });
    });
}
exports.queryMpob = function(mpobId, cb) {
    process.nextTick(function() {
        var firstquery = `SELECT * FROM mpobs 
    WHERE mpobId=${mpobId} ORDER BY custId`;
        //console.log(firstquery);
        con.query(firstquery, function(err, result, fields) {
            if (result) result = JSON.parse(JSON.stringify(result));
            if (result && result.length) {
                return cb(null, result);
            } else {
                return cb(err, null);
            }
        });
    });
}


exports.createMpob = function(req, cb) {
        var coId = req.user.coId;
        var mpob = req.body;
        console.log(mpob);
        process.nextTick(function() {

            mpob.mpobLicNo = mpob.mpobLicNo ? [].concat(mpob.mpobLicNo) : [''];
            mpob.expiredDate = mpob.expiredDate ? [].concat(mpob.expiredDate) : [''];
            mpob.custId = mpob.custId ? [].concat(mpob.custId) : [''];


            let firstquery = `INSERT INTO mpobs 
    (mpobLicNo,expiredDate, custId, createdDate, disabled, coId)
    VALUES ('${mpob.mpobLicNo}','${mpob.expiredDate}','${mpob.custId}',CURRENT_TIMESTAMP,'0','${coId}')`;

            console.log(firstquery);

            con.query(firstquery, function(err, result, fields) {
                if (result) result = JSON.parse(JSON.stringify(result));
                if (result && result.insertId) {
                    return cb(null, result);
                } else {
                    return cb(err, null);
                }
            });
        });
    }
    // exports.disableDeleteLand = function (disableDelete, landId, cb) {
    //   process.nextTick(function () {
    //     var firstquery =""
    //     if (disableDelete == "disabled") {
    //       firstquery = `UPDATE lands SET disabled = 1 WHERE landId = ${landId}`;
    //     } else if (disableDelete == "restore") {
    //       firstquery = `UPDATE lands SET disabled = 0 WHERE landId = ${landId}`;
    //     } else if (disableDelete == "delete") {
    //       firstquery = `DELETE FROM lands WHERE landId = ${landId}`;
    //     }

//     con.query(firstquery, function (err, result, fields) {
//       if (result) {
//         return cb(null, result);
//       }
//       else {
//         return cb(err, null);
//       }
//     });
//   });
// }



// exports.editLand = function (req, cb) {
//   var land = req.body;
//   process.nextTick(function () {

//     land.landId = land.landId ? [].concat(land.landId) : [''];
//     land.lotNo = land.lotNo ? [].concat(land.lotNo) : [''];
//     land.titleNo = land.titleNo ? [].concat(land.titleNo) : [''];
//     land.area = land.area ? [].concat(land.area) : [''];
//     land.custId = land.custId ? [].concat(land.custId) : [''];
//     land.usageOfLand = land.usageOfLand ? [].concat(land.usageOfLand) : [''];
//     land.typeOfCondition = land.typeOfCondition ? [].concat(land.typeOfCondition) : [''];
//     land.gpsLocationLng = land.gpsLocationLng ? [].concat(land.gpsLocationLng) : [''];
//     land.gpsLocationLat = land.gpsLocationLat ? [].concat(land.gpsLocationLat) : [''];


//     let firstquery = `UPDATE lands SET 
//     lotNo = "${land.lotNo[0]}",
//     titleNo = "${land.titleNo[0]}",
//     area = "${land.area[0]}",
//     custId = "${land.custId[0]}",
//     usageOfLand = "${land.usageOfLand[0]}",
//     typeOfCondition = "${land.typeOfCondition[0]}",
//     gpsLocationLng = "${land.gpsLocationLng[0]}",
//     gpsLocationLat = "${land.gpsLocationLat[0]}"
//     where landId= "${land.landId[0]}"`

//     con.query(firstquery, function (err, result, fields) {
//       if (result) result = JSON.parse(JSON.stringify(result));
//       //console.log(result);
//       if (result) {
//         return cb(null, result);
//       }
//       else {
//         return cb(err, null);
//       }
//     });
//   });
// }




function addescape(str) {
    var strconv = '';
    strconv = str;
    if (typeof strconv === 'string') {
        strconv = strconv.replace("'", "''");
    }
    return strconv;
}