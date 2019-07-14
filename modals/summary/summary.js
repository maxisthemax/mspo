exports.querySummary = function(req, cb) {
    queryCustId = req.body.custId;
    process.nextTick(function() {
        var firstquery = `
        select * FROM customers where custId = ${queryCustId};
        select * FROM lands a LEFT JOIN customers b on a.custId = b.custId where a.custId = ${queryCustId};
        select * FROM mpobs a LEFT JOIN customers b on a.custId = b.custId where a.custId = ${queryCustId};
        select * FROM mspos a LEFT JOIN customers b on a.custId = b.custId where a.custId = ${queryCustId};`
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