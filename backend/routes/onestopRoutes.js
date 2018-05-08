var express = require("express");
var router  = express.Router();

var DashBdData = require("../models/onestop");
var middleware = require("../middleware/onestop");
var middleware2 = require("../middleware/oracleQueries");

// getCurrentTime
// getCpuData
// getPMVer
// getLoadData
// getMemData
// getNetworkData
// getNetworkConnectionData
// getFileSystemData
// getUserData
// getCurrentSystemLoad
// getProcessData
// getDiskInfo
// getOSInfo


const {  getCPVer, getCurrentTime, getCpuData, getPMVer, getMemData, getFileSystemData, getOSInfo, getLoadData, getNetworkData, getUserData } = middleware; // destructuring assignment
const { getTableSpace, getParameters, getLongRunningQueries, getReservationTable, getAppliedRounds, checkRounds, checkMaxProcesses, checkGRStatus, checkLocks, checkActivity } = middleware2;

router.get("/dashboard", getCPVer, getNetworkData, getCurrentTime, getCpuData, getPMVer, getMemData, getFileSystemData, getOSInfo, getLoadData, getUserData, function (req, res) {
    res.render("utilities/onestop/dashboard", { data: DashBdData });
});

router.get("/dashboard/fe", getCPVer, getNetworkData, getCurrentTime, getCpuData, getPMVer, getMemData, getFileSystemData, getOSInfo, getLoadData, getUserData, function (req, res) {
    return res.status(200).json(DashBdData);
});


router.get("/oracleTableSpace", getTableSpace, function (req, res) {
    res.render("utilities/onestop/oracleTableSpace", {
        data: DashBdData.sqlResult
    });
});

router.get("/oracleParameters", getParameters, function (req, res) {
    res.render("utilities/onestop/oracleParameters", {
        data: DashBdData.sqlResult
    });
});

router.get("/oracleLongRunning", getLongRunningQueries, function (req, res) {
    res.render("utilities/onestop/oracleLongRunning", {
        data: DashBdData.sqlResult
    });
});

router.get("/oracleQueryReservation", getReservationTable, function (req, res) {
    res.render("utilities/onestop/oracleQueryReservation", {
        data: DashBdData.sqlResult
    });
});

router.get("/oraclegetAppliedRounds", getAppliedRounds, function (req, res) {
    res.render("utilities/onestop/oracleGetAppliedRounds", {
        data: DashBdData.sqlResult
    });
});

router.get("/oraclecheckRounds", checkRounds, function (req, res) {
    res.render("utilities/onestop/oraclecheckRounds", {
        data: DashBdData.sqlResult
    });
});

router.get("/oraclecheckMaxProcesses", checkMaxProcesses, function (req, res) {
    res.render("utilities/onestop/oraclecheckMaxProcesses", {
        data: DashBdData.sqlResult
    });
});

router.get("/oraclecheckGRStatus", checkGRStatus, function (req, res) {
    res.render("utilities/onestop/oraclecheckGRStatus", {
        data: DashBdData.sqlResult
    });
});

router.get("/oraclecheckLocks", checkLocks, function (req, res) {
    res.render("utilities/onestop/oraclecheckLocks", {
        data: DashBdData.sqlResult
    });
});

router.get("/oraclecheckActivity", checkActivity, function (req, res) {
    res.render("utilities/onestop/oraclecheckActivity", {
        data: DashBdData.sqlResult
    });
});

module.exports = router;