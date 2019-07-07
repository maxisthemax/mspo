exports.queryAllMspos = function(coId, cb) {
    process.nextTick(function() {
        var firstquery = `SELECT a.*,b.custName,b.custIC FROM mspos a LEFT JOIN customers b on a.custId = b.custId
    WHERE a.coId = ${coId} and a.disabled = 0 ORDER BY custId ASC,mspoId ASC`;
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

exports.queryAllMsposDisabled = function(coId, cb) {
    process.nextTick(function() {
        var firstquery = `SELECT a.*,b.custName,b.custIC FROM mspos a LEFT JOIN customers b on a.custId = b.custId
    WHERE a.coId = ${coId} and a.disabled = 1 ORDER BY custId ASC,mspoId ASC`;
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
exports.queryMspo = function(mspoId, cb) {
    process.nextTick(function() {
        var firstquery = `SELECT * FROM mspos 
    WHERE mspoId=${mspoId} ORDER BY custId`;
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


exports.createMspo = function(req, cb) {
        var coId = req.user.coId;
        var mspo = req.body;
        //console.log(mspo);
        process.nextTick(function() {

            mspo.mspoCertNo = mspo.mspoCertNo ? [].concat(mspo.mspoCertNo) : [''];
            mspo.expiredDate = mspo.expiredDate ? [].concat(mspo.expiredDate) : [''];
            mspo.custId = mspo.custId ? [].concat(mspo.custId) : [''];
            mspo.mspoStandard = mspo.mspoStandard ? [].concat(mspo.mspoStandard) : [''];

            let firstquery = `INSERT INTO mspos 
    (mspoCertNo,expiredDate,standard, custId, createdDate, disabled, coId)
    VALUES ('${mspo.mspoCertNo}','${mspo.expiredDate}','${mspo.mspoStandard}','${mspo.custId}',CURRENT_TIMESTAMP,'0','${coId}')`;

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
exports.disableDeleteMspo = function (disableDelete, mspoId, cb) {
      process.nextTick(function () {
        var firstquery =""
        if (disableDelete == "disabled") {
          firstquery = `UPDATE mspos SET disabled = 1 WHERE mspoId = ${mspoId}`;
        } else if (disableDelete == "restore") {
          firstquery = `UPDATE mspos SET disabled = 0 WHERE mspoId = ${mspoId}`;
        } else if (disableDelete == "delete") {
          firstquery = `DELETE FROM mspos WHERE mspoId = ${mspoId}`;
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



exports.editMspo = function (req, cb) {
  var mspo = req.body;
  process.nextTick(function () {

    mspo.mspoId = mspo.mspoId ? [].concat(mspo.mspoId) : [''];
    mspo.mspoCertNo = mspo.mspoCertNo ? [].concat(mspo.mspoCertNo) : [''];
    mspo.expiredDate = mspo.expiredDate ? [].concat(mspo.expiredDate) : [''];
    mspo.custId = mspo.custId ? [].concat(mspo.custId) : [''];
    mspo.mspoStandard = mspo.mspoStandard ? [].concat(mspo.mspoStandard) : [''];

    let firstquery = `UPDATE mspos SET 
    mspoCertNo = "${mspo.mspoCertNo[0]}",
    expiredDate = "${mspo.expiredDate[0]}",
    standard = "${mspo.mspoStandard[0]}",
    custId = "${mspo.custId[0]}"
    where mspoId= "${mspo.mspoId[0]}"`

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