const fs = require('fs');
const path = require('path');
var glob = require("glob")


var alarm_daydir = "public/reports/alarm/day/";
var alarm_weekdir = "public/reports/alarm/week/";
var alarm_monthdir = "public/reports/alarm/month/";


var alarm_dir = [];
var alarmdayarr = [];
var alarmweekarr = [];
var alarmmontharr = [];
module.exports = {
    getHomePage: (req, res) => {
        var trend_daydir = "public/reports/trends/day/";
        var trend_weekdir = "public/reports/trends/week/";
        var trend_monthdir = "public/reports/trends/month/";

        var trend_dir = [];
        var trenddayarr = [];
        var trendweekarr = [];
        var trendmontharr = [];        
        getDirectories(trend_daydir, function (err, dayres) {
            for (var i = 0; i < dayres.length; i++) {
                daynew = dayres[i].replace('public/', '');
                trenddayarr.push({ dayfullpath: daynew, dayfilename: path.basename(daynew) });
            }
            trend_dir['day'] = trenddayarr;
            getDirectories(trend_weekdir, function (err, weekres) {
                for (var i = 0; i < weekres.length; i++) {
                    weeknew = weekres[i].replace('public/', '');
                    trendweekarr.push({ weekfullpath: weeknew, weekfilename: path.basename(weeknew) });
                }
                trend_dir['week'] = trendweekarr;
                getDirectories(trend_monthdir, function (err, monthres) {
                    for (var i = 0; i < monthres.length; i++) {
                        monthnew = monthres[i].replace('public/', '');
                        trendmontharr.push({ monthfullpath: monthnew, monthfilename: path.basename(monthnew) });
                    }
                    trend_dir['month'] = trendmontharr;
                    //console.log(trend_dir['day']);
                    res.render('home.ejs', {
                        user: req.user,
                        successFlash: req.flash('success'),
                        errorFlash: req.flash('error'),
                        dir: trend_dir
                    });
                });
            });
        });
    }
};
var getDirectories = function (src, callback) {
    glob(src + '/**/*', callback);
};

// //requiring path and fs modules
// const path = require('path');
// const fs = require('fs');
// //joining path of directory 
// const directoryPath = path.join(__dirname, 'Documents');
// //passsing directoryPath and callback function
// fs.readdir(directoryPath, function (err, files) {
//     //handling error
//     if (err) {
//         return console.log('Unable to scan directory: ' + err);
//     } 
//     //listing all files using forEach
//     files.forEach(function (file) {
//         // Do whatever you want to do with the file
//         console.log(file); 
//     });
// });