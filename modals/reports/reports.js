exports.queryLandsWithMpobs = function (coId,cb) {
  process.nextTick(function () {
    var firstquery = `SELECT a.*,b.custName,c.mpobLicNo FROM lands a LEFT JOIN customers b 
    ON a.custId = b.custId LEFT JOIN mpobs c ON FIND_IN_SET(a.landId,c.landId) > 0 where b.coId=${coId} 
    AND a.disabled=0 AND b.disabled=0`;
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

function addescape(str) {
  var strconv = '';
  strconv = str;
  if (typeof strconv === 'string') {
    strconv = strconv.replace("'", "''");
  }
  return strconv;
}