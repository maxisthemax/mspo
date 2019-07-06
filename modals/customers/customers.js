exports.queryAllCustomers = function(coId, cb) {
    process.nextTick(function() {
        var firstquery = `SELECT * FROM customers WHERE coId = ${coId} and disabled = 0 ORDER BY custId`;
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
exports.queryAllCustomersDisabled = function(coId, cb) {
    process.nextTick(function() {
        var firstquery = `SELECT * FROM customers WHERE coId = ${coId} and disabled = 1 ORDER BY custId`;
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

exports.queryCustomers = function(custId, cb) {
    process.nextTick(function() {
        var firstquery = `SELECT * FROM customers WHERE 1 and custId=${custId} ORDER BY custId`;
        con.query(firstquery, function(err, result, fields) {
            //console.log(result);
            if (result) result = JSON.parse(JSON.stringify(result));
            if (result && result.length) {
                return cb(null, result);
            } else {
                return cb(err, null);
            }
        });
    });
}

exports.createCustomer = function(req, cb) {
    var coId = req.user.coId;
    var cust = req.body;
    process.nextTick(function() {

        cust.custNo = cust.custNo ? [].concat(cust.custNo) : [''];
        cust.custName = cust.custName ? [].concat(cust.custName) : [''];
        cust.custIC = cust.custIC ? [].concat(cust.custIC) : [''];
        cust.custTel = cust.custTel ? [].concat(cust.custTel) : [''];
        cust.custAdd1 = cust.custAdd1 ? [].concat(cust.custAdd1) : [''];
        cust.custAdd2 = cust.custAdd2 ? [].concat(cust.custAdd2) : [''];
        cust.custAdd3 = cust.custAdd3 ? [].concat(cust.custAdd3) : [''];


        let firstquery = "INSERT INTO `customers` (`coId`,`custNo`, `custName`, `custIC`, `custTel`, `custAdd1`, `custAdd2`, `custAdd3`, `deactivated`, `createdDate`) VALUES (" +
            "" + coId + "," +
            "'" + cust.custNo[0] + "'," +
            "'" + cust.custName[0] + "'," +
            "'" + cust.custIC[0] + "'," +
            "'" + cust.custTel[0] + "'," +
            "'" + cust.custAdd1[0] + "'," +
            "'" + cust.custAdd2[0] + "'," +
            "'" + cust.custAdd3[0] + "'," +
            "'" + "0" + "'," +
            "" + "CURRENT_TIMESTAMP" +
            ")";
        //(firstquery);
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

exports.disableDeleteCustomer = function(disableDelete, custId, cb) {
    process.nextTick(function() {
        var firstquery = ""
        if (disableDelete == "disabled") {
            firstquery = `UPDATE customers SET disabled = 1 WHERE custId = ${custId}`;
        } else if (disableDelete == "restore") {
            firstquery = `UPDATE customers SET disabled = 0 WHERE custId = ${custId}`;
        } else if (disableDelete == "delete") {
            firstquery = `DELETE FROM customers WHERE custId = ${custId}`;
        }

        con.query(firstquery, function(err, result, fields) {
            if (result) {
                return cb(null, result);
            } else {
                return cb(err, null);
            }
        });
    });
}


exports.editCustomer = function(cust, cb) {
    process.nextTick(function() {

        cust.custId = cust.custId ? [].concat(cust.custId) : [''];
        cust.custNo = cust.custNo ? [].concat(cust.custNo) : [''];
        cust.custName = cust.custName ? [].concat(cust.custName) : [''];
        cust.custIC = cust.custIC ? [].concat(cust.custIC) : [''];
        cust.custTel = cust.custTel ? [].concat(cust.custTel) : [''];
        cust.custAdd1 = cust.custAdd1 ? [].concat(cust.custAdd1) : [''];
        cust.custAdd2 = cust.custAdd2 ? [].concat(cust.custAdd2) : [''];
        cust.custAdd3 = cust.custAdd3 ? [].concat(cust.custAdd3) : [''];


        let firstquery = "UPDATE `customers` SET" +
            "`custNo` = '" + cust.custNo[0] + "'," +
            "`custName` ='" + cust.custName[0] + "'," +
            "`custIC` = '" + cust.custIC[0] + "'," +
            "`custTel` = '" + cust.custTel[0] + "'," +
            "`custAdd1` = '" + cust.custAdd1[0] + "'," +
            "`custAdd2` = '" + cust.custAdd2[0] + "'," +
            "`custAdd3` = '" + cust.custAdd3[0] + "'" +
            " where custId=" + cust.custId[0];

        con.query(firstquery, function(err, result, fields) {
            if (result) result = JSON.parse(JSON.stringify(result));
            //console.log(result);
            if (result) {
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