
var express = require("express");
var router  = express.Router();
fs = require('fs')

var DashBdData = require("../models/onestop");
var oracleQueries = require("../middleware/oracleQueries");
var customObject = require("../middleware/customobject");
var pmUsers = require("../middleware/pmusers");
var jobViewerUtils = require("../middleware/jobViewerUtils");
var logs = require("../middleware/logs");

const { getLogFileList } = logs;
router.post("/getLogFileList", getLogFileList, function (req, res) {
    return res.status(200).json(DashBdData.logFiles);
});

const { JV_DeleteJob } = jobViewerUtils;

router.post("/deleteLogEntry", JV_DeleteJob, function (req, res) {
    return res.status(200).json(DashBdData.sqlResult);
});

const { PMUsers } = pmUsers;

router.get("/pmusers", PMUsers, function (req, res) {
    return res.status(200).json(DashBdData.sqlResult);
});

const { getCOTableList, truncateCOTableList } = customObject ;

router.get("/customobject", getCOTableList, function (req, res) {
    return res.status(200).json(DashBdData.sqlResult);
});

router.post("/customobject", truncateCOTableList, function (req, res) {
    return res.status(200).json(DashBdData.sqlResult);
});

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


router.get("/readlogfile/fe", function(req, res) {
    //console.log(req.query.log);

    fs.readFile(req.query.log, 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    //console.log(data);
    return res.status(200).json(data);
    });

})



module.exports = router;