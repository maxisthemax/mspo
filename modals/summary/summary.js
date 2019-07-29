exports.querySummary = function(req, cb) {
    queryCustId = req.body.custId;
    process.nextTick(function() {
        var firstquery = `
        select * FROM customers where custId = ${queryCustId};
        select * FROM lands a LEFT JOIN customers b on a.custId = b.custId where a.custId = ${queryCustId};
        select a.*,(SELECT GROUP_CONCAT(lotNo) FROM lands WHERE FIND_IN_SET(landId,a.landId) > 0)as 
        lotNos,c.mspoId,c.mspoCertNo,c.expiredDate as MSPOExpiredDate,c.standard FROM mpobs a LEFT JOIN customers b 
        on a.custId = b.custId LEFT JOIN mspos c on a.mspoId = c.mspoId WHERE a.custId = ${queryCustId} 
        ORDER BY a.mpobLicNo ASC;
        select a.* FROM mspos a LEFT JOIN mpobs b on b.mspoId = b.mspoId where b.custId = ${queryCustId} GROUP BY a.mspoId;
        select * FROM tickets a LEFT JOIN buyers c on a.buyerId = c.buyerId LEFT JOIN customers b on a.custId = b.custId where a.custId = ${queryCustId};`
        console.log(firstquery);
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

function addescape(str) {
    var strconv = '';
    strconv = str;
    if (typeof strconv === 'string') {
        strconv = strconv.replace("'", "''");
    }
    return strconv;
}