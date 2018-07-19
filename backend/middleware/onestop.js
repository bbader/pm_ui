

var DashBdData = require("../models/onestop");
var si         = require('systeminformation');
var fs         = require('fs');
var convert    = require('convert-seconds');
var format     = require('date-format');
var converter  = require('byte-converter').converterBase10;
var database   = require('./database.js');

exports.getCPVer = function(req, res, next) {
    database.simpleExecute('select pds.latest() from dual ',
    {},
    {
        outFormat: database.OBJECT
    })
    .then( results => {
        try {
            var a = results.split("/");
            var b = a[2].split("(");
            DashBdData.pm_ver.cp = b[1].split("--")[0];
        }
        catch(e) {
            DashBdData.pm_ver.cp = "NONE";
        }
        next();
    })
    .catch( err => {
        next(err);
    });
}


// The exports in this file are:
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

// Time and Uptim
// var timedata = si.time();
// console.log(timedata);
// var d = format('hh:mm:ss', new Date(timedata.current));
// console.log("Current Time: " + d);
// var uptime = convert( parseInt(timedata.uptime));
// console.log(uptime);
// console.log("uptime: " +  uptime.hours + " hours " + uptime.minutes + " minutes " + uptime.seconds + " seconds" );
exports.getCurrentTime = function (req, res, next) {
    var timedata = si.time();
    DashBdData.currentTime = format('hh:mm:ss', new Date(timedata.current));
    DashBdData.upTime = convert( parseInt(timedata.uptime));
    next();
};

// Cpu data
// manufacturer
// brand
// speed
// speedmin
// speedmax
// cores
// vendor
// family
// Model
// stepping
// revision
// voltage
// cache
// cache.l1d
// cache.l1i
// cache.l2
// cache.l3
exports.getCpuData = function (req, res, next) {
    si.cpu() 
        .then (data2 => {
            DashBdData.cpu_data = data2,
            next() }
        )
        .catch(error => console.error(error));
    };

// Get the pm version from /apg/pdsver.dat
exports.getPMVer = function(req,res, next) {
    fs.readFile('/apg/pdsver.dat', 'utf8', function(err, contents) {
        DashBdData.pm_ver.major = contents.substr(0,2);
        DashBdData.pm_ver.minor = contents.substr(2,1);
        DashBdData.pm_ver.sp = contents.substr(3,2);
        next();
    });
};

// Get current system load
// avgload
// currentload
// currentload_user
// currentload_system
// currentload_nice
// currentload_idle
// currentload_irq
// raw_currentload
// cpus[]
exports.getLoadData = function(req, res, next) {
    si.currentLoad() 
        .then (data => {
            DashBdData.curr_load = data,
            next();
    })
    .catch(error => console.log(error));
};

// Get memory data
// total        total memory in bytes
// free         not used in bytes
// used         used (incl. buffers/cache)
// active       used actively (excl. buffers/cache)
// buffcache    used by buffers+cache
// available    potentially available (total - active)
// swaptotal
// swapused
// swapfree
exports.getMemData = function(req, res, next) {
    si.mem() 
        .then (data => {
            DashBdData.mem_data = data,
            DashBdData.mem_data.total = converter(DashBdData.mem_data.total, 'B', 'GB').toPrecision(4),
            DashBdData.mem_data.free = converter(DashBdData.mem_data.free, 'B', 'GB').toPrecision(4),
            DashBdData.mem_data.used = converter(DashBdData.mem_data.used, 'B', 'GB').toPrecision(4),
            DashBdData.mem_data.active = converter(DashBdData.mem_data.active, 'B', 'GB').toPrecision(4),
            DashBdData.mem_data.buffcache = converter(DashBdData.mem_data.buffcache, 'B', 'GB').toPrecision(4),
            DashBdData.mem_data.available = converter(DashBdData.mem_data.available, 'B', 'GB').toPrecision(4),
            DashBdData.mem_data.swaptotal = converter(DashBdData.mem_data.swaptotal, 'B', 'GB').toPrecision(4),
            DashBdData.mem_data.swapused = converter(DashBdData.mem_data.swapused, 'B', 'GB').toPrecision(4),
            DashBdData.mem_data.swapfree = converter(DashBdData.mem_data.swapfree, 'B', 'GB').toPrecision(4),
            next();
    })
    .catch(error => console.log(error));
}

// Get netowrk data
// array of network interfaces
// [0].iface
// [0].ip4
// [0].ip6	
// [0].mac
// [0].internal

// NetworkStats
// iface
// operstate
// rx
// tx
// rx_sec
// tx_sec
// ms

exports.getNetworkData =  async function (req, res, next) {
    DashBdData.network_stats = [];
    si.networkInterfaces()
        .then (async data => {
            for (let i of data) {
                const data2 = await si.networkStats(i.iface)
                .then(data2 => {
                    DashBdData.network_stats.push(data2)
                })}
            DashBdData.network_data = data,
            next();
        })
        .catch(error => console.log(error));
}


// Get netowrk connection data
// [0].protocol
// [0].localaddress
// [0].localport
// [0].peeraddress
// [0].peerport
// [0].state
exports.getNetworkConnectionData = function (req, res, next) {
    si.networkConnections()
        .then(data => {
            DashBdData.network_connection = data,
            next();
        })
        .catch(error => console.log(error));
}

// Get file system info
// returns array of mounted file systems
// [0].fs
// [0].type
// [0].size
// [0].used
// [0].use
// [0].mount
exports.getFileSystemData = function (req, res, next) {
    si.fsSize()
        .then(data => {
            for (let i of data) {
                i.size = converter(i.size, 'B', 'GB').toPrecision(4),
                i.used = converter(i.used, 'B', 'GB').toPrecision(4)    
            }
            DashBdData.fileSystem = data,
            next();
        })
        .catch(error => console.log(error));
    
    si.fsStats()
        .then(data => {
            DashBdData.fileSystemStats = data,
            next();
        })
        .catch(error => console.log(error));

    si.disksIO()
        .then(data => {
            DashBdData.diskIO = data,
            next();
        })
        .catch(error => console.log(error));
}

// Get user information
// [0].user
// [0].tty
// [0].date
// [0].time
// [0].ip
// [0].command
exports.getUserData = function (req, res, next) {
    si.users()
    .then(data => {
        DashBdData.userData = data,
        next();
    })
    .catch(error => console.log(error));
}

// Get current load on system
// avgload
// currentload
// currentload_user
// currentload_system
// currentload_nice
// currentload_idle
// currentload_irq
// raw_currentload...
// cpus[]
exports.getCurrentSystemLoad = function (req, res, next) {
    si.currentLoad()
    .then(data => {
        DashBdData.curr_load = data,
        next();
    })
    .catch(error => console.log(error));
}

// Get System Processes
// all
// running
// blocked
// sleeping
// unknown
// list[]
// ...[0].pid	    process PID
// ...[0].name	    process name
// ...[0].pcpu     process % CPU usage
// ...[0].pcpuu	process % CPU usage (user)
// ...[0].pcpus	process % CPU usage (system)
// ...[0].pmem	    process memory %
// ...[0].priority	process priotity
// ...[0].mem_vsz	process virtual memory size
// ...[0].mem_rss	process mem resident set size
// ...[0].nice		process nice value
// ...[0].started	process start time
// ...[0].state	process state (e.g. sleeping)
// ...[0].tty	    tty from which process was started
// ...[0].user		user who started process
// ...[0].command  process starting command

exports.getProcessData = function (req, res, next) {
    si.processes()
        .then(data => {
            DashBdData.processes = data
            next();
        })
        .catch(error => console.log(error));
}

// Get disk Info
// rIO			read IOs on all mounted drives
// wIO			write IOs on all mounted drives
// tIO			write IOs on all mounted drives
// rIO_sec		read IO per sec (* see notes)
// wIO_sec		write IO per sec (* see notes)
// tIO_sec		total IO per sec (* see notes)
// ms			interval length (for per second values)
exports.getDiskInfo = function (req, res, next) {
    si.disksIO()
        .then(data => {
            DashBdData.diskInfo = data,
            next();
        })
        .catch(error => console.log(error));
}

// getOSInfo
// platform
// distro
// release	
// codename
// kernel
// arch
// hostname
// logofile
exports.getOSInfo = function (req, res, next) {
    si.osInfo()
        .then(data => {
            DashBdData.osInfo = data,
            next();
        })
        .catch(error => console.log(error));
}


module.exports = exports;