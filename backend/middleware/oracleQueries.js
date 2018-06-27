
var sqlData     = require("../models/onestop");
var database    = require('./database.js');
var jwt         = require('jsonwebtoken');
var config      = require("../public/dbconfig");

exports.getTableSpace = function(req, res, next) {
    database.simpleExecute(
        'SELECT /* + RULE */  df.tablespace_name "Tablespace", ' +
        'df.bytes / (1024 * 1024) "Size (MB)", ' +
        'SUM(fs.bytes) / (1024 * 1024) "Free (MB)", ' +
        'Nvl(Round(SUM(fs.bytes) * 100 / df.bytes),1) "% Free", ' +
        'Round((df.bytes - SUM(fs.bytes)) * 100 / df.bytes) "% Used" ' +
        'FROM dba_free_space fs, ' +
        '(SELECT tablespace_name,SUM(bytes) bytes ' +
        'FROM dba_data_files ' +
        'GROUP BY tablespace_name) df ' +
        'WHERE fs.tablespace_name (+)  = df.tablespace_name ' +
        'GROUP BY df.tablespace_name,df.bytes ' +
        'UNION ALL ' +
        'SELECT /* + RULE */ df.tablespace_name tspace, ' +
        'fs.bytes / (1024 * 1024), ' +
        'SUM(df.bytes_free) / (1024 * 1024), ' +
        'Nvl(Round((SUM(fs.bytes) - df.bytes_used) * 100 / fs.bytes), 1), ' +
        'Round((SUM(fs.bytes) - df.bytes_free) * 100 / fs.bytes) ' +
        'FROM dba_temp_files fs, ' +
        '(SELECT tablespace_name,bytes_free,bytes_used ' +
        'FROM v$temp_space_header ' +
        'GROUP BY tablespace_name,bytes_free,bytes_used) df ' +
        'WHERE fs.tablespace_name (+)  = df.tablespace_name ' +
        'GROUP BY df.tablespace_name,fs.bytes,df.bytes_free,df.bytes_used ' +
        'ORDER BY 4 DESC ',
    {},
    {
        outFormat: database.OBJECT
    })
    .then( results => {
        //console.log(results);
        sqlData.sqlResult = results;
        next();
    })
    .catch( err => {
        next(err);
    });
}

exports.getParameters = function(req, res, next) {
    database.simpleExecute('select name, type, value from V$PARAMETER',
        {},
        {
            outFormat: database.OBJECT
        })
        .then ( results => {
            // console.log(results);
            sqlData.sqlResult = results;
            next();
        })
        .catch( err => {
            next(err);
        });
}

exports.getLongRunningQueries = function(req, res, next) {
    database.simpleExecute(
        "SELECT sid, to_char(start_time, 'hh24:mi:ss') stime, " +
        'message,( sofar/totalwork)* 100 percent ' +
        'FROM v$session_longops ' +
        'WHERE sofar/totalwork < 1 ',
    {},
    {
        outFormat: database.OBJECT
    })
    .then( results => {
        console.log(results);
        sqlData.sqlResult = results;
        next();
    })
    .catch( err => {
        next(err);
    });
}

exports.getReservationTable = function(req, res, next) {
    database.simpleExecute(
        'select OWNER_NAME, '+
        'CONTROLLER_IP, CONTROLLER_PORT, RESERVATION_TYPE, ' +
        'TARGET_ID, TIME_EXPIRES, TIME_RESERVED HEADING, ' +
        'UNIQUE_ID from support.dsw_res_storage order by TIME_RESERVED ',
    {},
    {
        outFormat: database.OBJECT
    })
    .then( results => {
        //console.log(results);
        sqlData.sqlResult = results;
        next();
    })
    .catch( err => {
        next(err);
    });
}

exports.getAppliedRounds = function(req, res, next) {
    database.simpleExecute(
        'select name, date_supplied, date_applied ' +
        'from support.patch_history ' +
        "where name like 'Tests for:%' " +
        'order by date_applied  desc ',
        {},
        {
            outFormat: database.OBJECT
        })
        .then( results => {
            //console.log(results);
            sqlData.sqlResult = results;
            next();
        })
        .catch( err => {
            next(err);
        });    
}

exports.checkRounds = function(req, res, next) {
    database.simpleExecute(
        'select COMPLETION_DATE,VERSION from support.pds_version order by completion_date desc ',
        {},
        {
            outFormat: database.OBJECT
        })
        .then( results => {
            //console.log(results);
            sqlData.sqlResult = results;
            next();
        })
        .catch( err => {
            next(err);
        });    
}

exports.checkMaxProcesses = function(req, res, next) {
    database.simpleExecute(
        'select resource_name, initial_allocation, CURRENT_UTILIZATION, max_utilization ' +
        'from gv$resource_limit ' +
        "where resource_name in ('processes', 'sessions') " ,
        {},
        {
            outFormat: database.OBJECT
        })
        .then( results => {
            //console.log(results);
            sqlData.sqlResult = results;
            next();
        })
        .catch( err => {
            next(err);
        });    
}

exports.checkGRStatus = function(req, res, next) {
    database.simpleExecute(
        'select JOB_PROCESS_NUM, START_DATE, JOB_STATUS,NAME, DATA_SET_ID from  support.group_reimb_job WHERE start_date > TRUNC(SYSDATE) - 90 order by START_DATE DESC ',
        {},
        {
            outFormat: database.OBJECT
        })
        .then( results => {
            //console.log(results);
            sqlData.sqlResult = results;
            next();
        })
        .catch( err => {
            next(err);
        });    
}

exports.checkLocks = function(req, res, next) {
    database.simpleExecute(
        'select ' +
        'object_name, ' +
        'object_type, ' +
        'session_id, ' +
        'type, ' +
        'lmode, ' +
        'request, ' +
        'block, ' +
        'ctime ' +
        'from ' +
        'v$locked_object, all_objects, v$lock ' +
        'where ' +
        'v$locked_object.object_id = all_objects.object_id AND ' +
        'v$lock.id1 = all_objects.object_id AND ' +
        'v$lock.sid = v$locked_object.session_id ' +
        'order by ' +
        'session_id, ctime desc, object_name ',
        {},
        {
            outFormat: database.OBJECT
        })
        .then( results => {
            //console.log(results);
            sqlData.sqlResult = results;
            next();
        })
        .catch( err => {
            next(err);
        });    
}

exports.checkActivity = function(req, res, next) {
    database.simpleExecute(
        'select S.USERNAME, s.sid, s.osuser, t.sql_id, sql_text ' +
        'from v$sqltext_with_newlines t,V$SESSION s ' +
        'where t.address = s.sql_address ' +
        'and t.hash_value = s.sql_hash_value ' +
        "and s.status = 'ACTIVE' " +
        "and s.username <> 'SYSTEM' " +
        'order by s.sid,t.piece ',
        {},
        {
            outFormat: database.OBJECT
        })
        .then( results => {
            sqlData.sqlResult = results;
            next();
        })
        .catch( err => {
            next(err);
        });    
}


async function getJobViewer(req, res, next) {
    await database.simpleExecute(
        'SELECT FINISH_DATE, ' +
        'FINISH_STATUS, ' +
        'JOB_DEFINITION_ID, ' +
        'JOB_MGR_PID, ' +
        'JOB_NAME, ' +
        'JOB_NUMBER, ' +
        'JOB_STEP_ID, ' +
        'JOB_TYPE_ID, ' +
        'LOG_FILES, ' +
        'OWNER_ID, ' +
        'PDS_FUNCTION_ID, ' +
        'PERCENT_COMPLETE, ' +
        'SCHEDULED_DATE, ' +
        'SECONDARY_USER_ID, ' +
        'START_DATE, ' +
        'STATUS, ' +
        'STATUS_MESSAGE, ' +
        "UNIQUE_ID FROM pds_job order by unique_id",
    {},
    {
        outFormat: database.OBJECT
    })
    .then( async results => {
        sqlData.sqlMetadata = results.metaData;
        sqlData.sqlResult = results.rows;

        await getLogFileName(sqlData.sqlResult);
        await getJobTypeName(sqlData.sqlResult);
        await getOwnereName(sqlData.sqlResult);
        await getFunctionName(sqlData.sqlResult);
        await setStatus(sqlData.sqlResult);
        await setFinishStatus(sqlData.sqlResult);
        //console.log(sqlData.sqlResult);
        next();
    })
    .catch( err => {
        next(err);
    });
}

async function getLogFileName(results) {
    var fileLoc = "";
    for (let i of results) {
        if (i.LOG_FILES != null) {
            var logFile = i.LOG_FILES.split(" ");

            for (var uid in logFile) {
                sql = "SELECT fl.location, pjf.file_name, pjf.description FROM pds_job_file pjf, pds_file_location fl WHERE pjf.file_location_id = fl.unique_id AND pjf.unique_id = " + logFile[uid] 

                await database.simpleExecute(sql, {}, { outFormat: database.OBJECT } )
                .then( results2 => {
                    i.LOG_FILES = results2.rows[0].FILE_NAME ;
                    switch (results2.rows[0].LOCATION) {
                        case "DSW_AUDIT":
                            fileLoc = process.env.DSW_AUDIT;
                            break;
                        case "DSW_OSLOG":
                            fileLoc = process.env.DSW_OSLOG;
                            break;
                        case "EXPWGT_OUTPUT_DIR":
                            fileLoc = process.env.EXPWGT_OUTPUT_DIR;
                            break;
                        case "EXPWGT_AUDIT_DIR":
                            fileLoc = process.env.EXPWGT_AUDIT_DIR;
                            break;
                        default:
                            console.log("No environment variable defined");
                            fileLoc = "/"
                    }
                    switch (uid) {
                        case "0":
                            i.LOG_FILE_URL1 = fileLoc + "/" + results2.rows[0].FILE_NAME ;
                            i.LOG_FILE_DESC1 = results2.rows[0].DESCRIPTION;
                            break;
                        case "1":
                            i.LOG_FILE_URL2 = fileLoc + "/" + results2.rows[0].FILE_NAME ;
                            i.LOG_FILE_DESC2 = results2.rows[0].DESCRIPTION;
                            break;
                        case "2":
                            i.LOG_FILE_URL3 = fileLoc + "/" + results2.rows[0].FILE_NAME ;
                            i.LOG_FILE_DESC3 = results2.rows[0].DESCRIPTION;
                            break;
                        case "3":
                            i.LOG_FILE_URL4 = fileLoc + "/" + results2.rows[0].FILE_NAME ;
                            i.LOG_FILE_DESC4 = results2.rows[0].DESCRIPTION;
                            break;
                        case "4":
                            i.LOG_FILE_URL5 = fileLoc + "/" + results2.rows[0].FILE_NAME ;
                            i.LOG_FILE_DESC5 = results2.rows[0].DESCRIPTION;
                            break;
                    }
                })
    
            }
        } // end of if
    }
};

async function getJobTypeName(results) {
    for (let i of results) {
        sql = "SELECT name FROM misc_account_type WHERE unique_id = " + i.JOB_TYPE_ID 
        await database.simpleExecute(sql, {}, { outFormat: database.OBJECT } )
        .then( results2 => {
            //console.log(results2);
            i.JOB_TYPE_ID = results2.rows[0].NAME;
        })
    }
};

async function getOwnereName(results) {
    for (let i of results) {
        sql = "SELECT longname FROM secprincipal WHERE uniqueid = '" +  i.OWNER_ID + "'" 
        await database.simpleExecute(sql, {}, { outFormat: database.OBJECT } )
        .then( results2 => {
            //console.log(results2);
            i.OWNER_ID = results2.rows[0].LONGNAME;
        })
    }
};

async function getFunctionName(results) {
    for (let i of results) {
        sql = "SELECT name FROM pds_function WHERE unique_id = " + i.PDS_FUNCTION_ID
        await database.simpleExecute(sql, {}, { outFormat: database.OBJECT } )
        .then( results2 => {
            //console.log(results2);
            i.PDS_FUNCTION_ID = results2.rows[0].NAME;
        })
    }
};

async function setStatus(results) {
    for (let i of results) {
        switch(i.STATUS) {
            case 1:
                i.STATUS = "Running"
                break;
            case 2:
                i.STATUS = "Completed"
                break;
            case 3:
                i.STATUS = "Scheduled"
                break;
            default:
                console.log("Unkknown status")
        }
    }
};

async function setFinishStatus(results) {
    for (let i of results) {
        switch (i.FINISH_STATUS) {
            case 0:
                i.FINISH_STATUS = "Success"
                break;
            case 1:
                i.FINISH_STATUS = "Fail"
                break;
            case 2:
                i.FINISH_STATUS = "Interrupted"
                break;
            case 3:
                i.FINISH_STATUS = "Canceled"
                break;
            case 4:
                i.FINISH_STATUS = "Skipped"
                break;
            case 9:
                i.FINISH_STATUS = "No Status"
                break;
            default:
            console.log("Unkknown status")
        }
    }
};


module.exports = exports;
module.exports.getJobViewer = getJobViewer;

