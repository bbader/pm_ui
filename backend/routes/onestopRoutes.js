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



const {  getCPVer, getCurrentTime, getCpuData, getPMVer, getMemData, getFileSystemData, getOSInfo, getLoadData, getNetworkData, getNetworkConnectionData, getUserData, getProcessData, adminCommands, adminRestartPM } = middleware; // destructuring assignment
const { getTableSpace, getParameters, getLongRunningQueries, getReservationTable, getAppliedRounds, checkRounds, checkMaxProcesses, checkGRStatus, checkLocks, checkActivity } = middleware2;

router.get("/adminRestartPM", adminRestartPM, function (req, res) {
    return res.status(200).json(DashBdData.shellCmdOutput);
});

router.post("/adminCommands", adminCommands,  function (req, res) {
    return res.status(200).json(DashBdData.shellCmdOutput);
});

router.get("/dashboard", getCPVer, getNetworkData, getCurrentTime, getCpuData, getPMVer, getMemData, getFileSystemData, getOSInfo, getLoadData, getUserData, function (req, res) {
    res.render("utilities/onestop/dashboard", { data: DashBdData });
});

router.get("/dashboard/fe", getCPVer, getNetworkData, getCurrentTime, getCpuData, getPMVer, getMemData, getFileSystemData, getOSInfo, getLoadData, getUserData, function (req, res) {
    return res.status(200).json(DashBdData);
});

router.get("/getProcesses", getProcessData, function (req, res) {
    if (req.query.backend === "true" ) { 
        res.render("utilities/onestop/NO_VIEW_FOR_THIS_YET", {
            data: DashBdData.sqlResult
        }); 
    } else {
     return res.status(200).json(DashBdData.processes); }
});

router.get("/getNetwork", getNetworkData, getNetworkConnectionData, function (req, res) {
    if (req.query.backend === "true" ) { 
        res.render("utilities/onestop/NO_VIEW_FOR_THIS_YET", {
            data: DashBdData
        }); 
    } else {
     return res.status(200).json(DashBdData); }
});

router.get("/oracleTableSpace", getTableSpace, function (req, res) {
    if (req.query.backend === "true" ) { 
        res.render("utilities/onestop/oracleTableSpace", {
            data: DashBdData.sqlResult
        }); 
    } else {
     return res.status(200).json(DashBdData.sqlResult); }
});

router.get("/oracleParameters", getParameters, function (req, res) {
    if (req.query.backend === "true" ) { 
        res.render("utilities/onestop/oracleParameters", {
            data: DashBdData.sqlResult
        });
    } else {
        return res.status(200).json(DashBdData.sqlResult); }   
});

router.get("/oracleLongRunning", getLongRunningQueries, function (req, res) {
    if (req.query.backend === "true" ) { 
        res.render("utilities/onestop/oracleLongRunning", {
            data: DashBdData.sqlResult
        });
    } else {
        return res.status(200).json(DashBdData.sqlResult); }   
});

router.get("/oracleQueryReservation", getReservationTable, function (req, res) {
    if (req.query.backend === "true" ) { 
        res.render("utilities/onestop/oracleQueryReservation", {
            data: DashBdData.sqlResult
        });
    } else {
        return res.status(200).json(DashBdData.sqlResult); }   
});

router.get("/oraclegetAppliedRounds", getAppliedRounds, function (req, res) {
    if (req.query.backend === "true" ) { 
        res.render("utilities/onestop/oracleGetAppliedRounds", {
            data: DashBdData.sqlResult
        });
    } else {
        return res.status(200).json(DashBdData.sqlResult); }   
});

router.get("/oraclecheckRounds", checkRounds, function (req, res) {
    if (req.query.backend === "true" ) { 
        res.render("utilities/onestop/oraclecheckRounds", {
            data: DashBdData.sqlResult
        });
    } else {
        return res.status(200).json(DashBdData.sqlResult); }   
});

router.get("/oraclecheckMaxProcesses", checkMaxProcesses, function (req, res) {
    if (req.query.backend === "true" ) { 
        res.render("utilities/onestop/oraclecheckMaxProcesses", {
            data: DashBdData.sqlResult
        });
    } else {
        return res.status(200).json(DashBdData.sqlResult); }   
});

router.get("/oraclecheckGRStatus", checkGRStatus, function (req, res) {
    if (req.query.backend === "true" ) { 
        res.render("utilities/onestop/oraclecheckGRStatus", {
            data: DashBdData.sqlResult
        });
    } else {
        return res.status(200).json(DashBdData.sqlResult); }   
});

router.get("/oraclecheckLocks", checkLocks, function (req, res) {
    if (req.query.backend === "true" ) { 
        res.render("utilities/onestop/oraclecheckLocks", {
            data: DashBdData.sqlResult
        });
    } else {
        return res.status(200).json(DashBdData.sqlResult); }   
});

router.get("/oraclecheckActivity", checkActivity, function (req, res) {
    if (req.query.backend === "true" ) { 
        res.render("utilities/onestop/oraclecheckActivity", {
            data: DashBdData.sqlResult
        });
    } else {
        return res.status(200).json(DashBdData.sqlResult); }   
});

module.exports = router;