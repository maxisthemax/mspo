exports.queryAllCustomers = function (body, cb) {
  process.nextTick(function () {
    var firstquery = "SELECT * FROM `customers` WHERE 1 ORDER BY custId";
    con.query(firstquery, function (err, result, fields) {
      if (!err) result = (JSON.parse(JSON.stringify(result)));
      if (result && result.length) {
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