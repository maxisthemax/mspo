exports.queryCompany = function (coId, cb) {
    process.nextTick(function () {
        var firstquery = `SELECT * FROM company WHERE coId = ${coId} Limit 1`;
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

exports.saveCompany = function (comp, cb) {

    comp.compname = comp.compname ? [].concat(comp.compname) : [''];
    comp.compadd = comp.compadd ? [].concat(comp.compadd) : [''];
    comp.comptel = comp.comptel ? [].concat(comp.comptel) : [''];
    comp.coId = comp.coId ? [].concat(comp.coId) : [''];
    process.nextTick(function () {
        var firstquery = `UPDATE company SET 
        coName = "${comp.compname}",
        coAdd = "${comp.compadd}",
        coTel = "${comp.comptel}" where coId =${comp.coId}`;

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

// exports.queryAllMsposDisabled = function(coId, cb) {
//     process.nextTick(function() {
//         var firstquery = `SELECT a.*,b.custName,b.custIC FROM mspos a LEFT JOIN customers b on a.custId = b.custId
//     WHERE a.coId = ${coId} and a.disabled = 1 ORDER BY custId ASC,mspoId ASC`;
//         //console.log(firstquery);
//         con.query(firstquery, function(err, result, fields) {
//             if (result) result = JSON.parse(JSON.stringify(result));
//             if (result && result.length) {
//                 return cb(null, result);
//             } else {
//                 return cb(err, null);
//             }
//         });
//     });
// }
// exports.queryMspo = function(mspoId, cb) {
//     process.nextTick(function() {
//         var firstquery = `SELECT * FROM mspos 
//     WHERE mspoId=${mspoId} ORDER BY custId`;
//         //console.log(firstquery);
//         con.query(firstquery, function(err, result, fields) {
//             if (result) result = JSON.parse(JSON.stringify(result));
//             if (result && result.length) {
//                 return cb(null, result);
//             } else {
//                 return cb(err, null);
//             }
//         });
//     });
// }


exports.createCompany = function (req, cb) {

    var comp = req.body;
    //console.log(mspo);
    process.nextTick(function () {

        comp.compname = comp.compname ? [].concat(comp.compname) : [''];
        comp.compadd = comp.compadd ? [].concat(comp.compadd) : [''];
        comp.comptel = comp.comptel ? [].concat(comp.comptel) : [''];
        comp.username = comp.username ? [].concat(comp.username) : [''];
        comp.password = comp.password ? [].concat(comp.password) : [''];

        let firstquery = `INSERT INTO company 
    (coName,coAdd,coTel, deactivated, createdDate)
    VALUES ('${comp.compname}','${comp.compadd}','${comp.comptel}','0',CURRENT_TIMESTAMP)`;

        //console.log(firstquery);
        con.query(firstquery, function (err, result, fields) {
            if (result) result = JSON.parse(JSON.stringify(result));
            if (result && result.insertId) {
                var thisId = result.insertId;
                let secondquery = `INSERT INTO USERS (username,userpassword,displayname,deactivated,administrator,coId) VALUES (
                        '${comp.username}','${comp.password}','${comp.compname}','0','1',${thisId})`;
                    console.log(secondquery);    
                con.query(secondquery, function (err, result, fields) {
                    if (result) result = JSON.parse(JSON.stringify(result));
                    if (result && result.insertId) {
                        return cb(null, result);
                    } else {
                        return cb(err, null);
                    }
                });
            } else {
                return cb(err, null);
            }
        });
    });
}
// exports.disableDeleteMspo = function (disableDelete, mspoId, cb) {
//       process.nextTick(function () {
//         var firstquery =""
//         if (disableDelete == "disabled") {
//           firstquery = `UPDATE mspos SET disabled = 1 WHERE mspoId = ${mspoId}`;
//         } else if (disableDelete == "restore") {
//           firstquery = `UPDATE mspos SET disabled = 0 WHERE mspoId = ${mspoId}`;
//         } else if (disableDelete == "delete") {
//           firstquery = `DELETE FROM mspos WHERE mspoId = ${mspoId}`;
//         }
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



// exports.editMspo = function (req, cb) {
//   var mspo = req.body;
//   process.nextTick(function () {

//     mspo.mspoId = mspo.mspoId ? [].concat(mspo.mspoId) : [''];
//     mspo.mspoCertNo = mspo.mspoCertNo ? [].concat(mspo.mspoCertNo) : [''];
//     mspo.expiredDate = mspo.expiredDate ? [].concat(mspo.expiredDate) : [''];
//     mspo.custId = mspo.custId ? [].concat(mspo.custId) : [''];
//     mspo.mspoStandard = mspo.mspoStandard ? [].concat(mspo.mspoStandard) : [''];

//     let firstquery = `UPDATE mspos SET 
//     mspoCertNo = "${mspo.mspoCertNo[0]}",
//     expiredDate = "${mspo.expiredDate[0]}",
//     standard = "${mspo.mspoStandard[0]}",
//     custId = "${mspo.custId[0]}"
//     where mspoId= "${mspo.mspoId[0]}"`

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