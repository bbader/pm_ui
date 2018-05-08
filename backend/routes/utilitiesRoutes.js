
var express = require("express");
var router  = express.Router();
fs = require('fs')

var DashBdData = require("../models/onestop");
var oracleQueries = require("../middleware/oracleQueries");


const { getJobViewer } = oracleQueries;


router.get("/jobViewer", getJobViewer, function (req, res) {
    res.render("utilities/jobViewer", { data: DashBdData });
});

router.get("/jobViewer/fe", getJobViewer, function (req, res) {
    return res.status(200).json(DashBdData);
});

router.get("/readlogfile", function(req, res) {
    //console.log(req.query.log);

    fs.readFile(req.query.log, 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    //console.log(data);
    res.render("utilities/readlogfile", { data: data });
    });

})



module.exports = router;