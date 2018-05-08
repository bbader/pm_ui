

/* This var is used to hold the data retrieved from the 
system information npm module. */
var data = {
    cpu_data: {},
    pm_ver: {
        major: String,
        minor: String,
        sp: String,
        cp: String
    },
    currentTime: String,
    upTime: String,
    curr_load: {},
    mem_data: {},
    network_data: {},
    network_stats: [],
    network_connection: {},
    fileSystem: {},
    userData: {},
    systemLoad: {},
    processes: {},
    diskInfo: {},
    osInfo: {},
    sqlMetadata: String,
    sqlResult: String
};

module.exports = data ;