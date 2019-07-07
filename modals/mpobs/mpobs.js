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
    WHERE a.coId = ${coId} and a.disabled = 1 ORDER BY custId ASC,mpobId ASC`;
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
        //console.log(mpob);
        process.nextTick(function() {

            mpob.mpobLicNo = mpob.mpobLicNo ? [].concat(mpob.mpobLicNo) : [''];
            mpob.expiredDate = mpob.expiredDate ? [].concat(mpob.expiredDate) : [''];
            mpob.custId = mpob.custId ? [].concat(mpob.custId) : [''];


            let firstquery = `INSERT INTO mpobs 
    (mpobLicNo,expiredDate, custId, createdDate, disabled, coId)
    VALUES ('${mpob.mpobLicNo}','${mpob.expiredDate}','${mpob.custId}',CURRENT_TIMESTAMP,'0','${coId}')`;

            //console.log(firstquery);

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
exports.disableDeleteMpob = function (disableDelete, mpobId, cb) {
      process.nextTick(function () {
        var firstquery =""
        if (disableDelete == "disabled") {
          firstquery = `UPDATE mpobs SET disabled = 1 WHERE mpobId = ${mpobId}`;
        } else if (disableDelete == "restore") {
          firstquery = `UPDATE mpobs SET disabled = 0 WHERE mpobId = ${mpobId}`;
        } else if (disableDelete == "delete") {
          firstquery = `DELETE FROM mpobs WHERE mpobId = ${mpobId}`;
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



exports.editMpob = function (req, cb) {
  var mpob = req.body;
  process.nextTick(function () {

    mpob.mpobId = mpob.mpobId ? [].concat(mpob.mpobId) : [''];
    mpob.mpobLicNo = mpob.mpobLicNo ? [].concat(mpob.mpobLicNo) : [''];
    mpob.expiredDate = mpob.expiredDate ? [].concat(mpob.expiredDate) : [''];
    mpob.custId = mpob.custId ? [].concat(mpob.custId) : [''];
 
    let firstquery = `UPDATE mpobs SET 
    mpobLicNo = "${mpob.mpobLicNo[0]}",
    expiredDate = "${mpob.expiredDate[0]}",
    custId = "${mpob.custId[0]}"
    where mpobId= "${mpob.mpobId[0]}"`

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