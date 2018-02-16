var mysql = require('mysql');

var config = {
    host: '127.0.0.1',
    user: 'root',
    password: '129',
    database: 'came'
};

function DBConnect(){
    var conn = mysql.createConnection(config);
    conn.connect(function(err){
        if(err){
            console.error("Database connect error: " + err.errno + " " + err.message);
            return;
        }
    });
    return conn;
}

function DBCommit(sql, callback = function(){}){
    var conn = DBConnect();
    conn.query(sql, callback);
}

//readFromgDB
//arguments: table:string; [callback([err,[result,[field]]]), [options]]
//                          options: col array,default ['*']
//                                   Where sql string,default null
//                                   Order sql string,default null
//                                   Limit sql string,default null
//when caller doesn't have options argument, but has callback argument, caller needs an object {}
//eg: readFromDB('user', {}, function(){...});

var readFromDBDefaultOptions = {col: ['*'], Where: null, Order: null, Limit: null};
function readFromDB(table, options = {col: ['*'], Where: null, Order: null, Limit: null}, callback = function(){}){
    //process argument options
    for(var name in readFromDBDefaultOptions)
        options[name] = options[name] || readFromDBDefaultOptions[name];

    //console.log("options: ", options);  
    var sql = 'SELECT ';
    //SELECT statement, after the last col, append a space instead of a comma
    var i = 0
    for(; i < options.col.length - 1; i++){
        sql = sql + options.col[i] + ',';
    }
    sql = sql + options.col[i] + ' ';

    sql = sql + 'FROM ' + table + ' ';

    //WHERE statement
    if(options.Where){
        sql = sql + options.Where + ' ';
    }
    //ORDER statement
    if(options.Order){
        sql = sql + options.Order + ' ';
    }
    //LIMIT statement
    if(options.Limit){
        sql = sql + options.Limit + ' ';
    }
    //console.log(sql);   
    DBCommit(sql,callback);
}

//insertIntoDB
//only one row per call
//arguments: table:string; values object: column as key, value as attribute value
//                          [callback([err,[result,[field]]])]

function insertIntoDB(table, values, callback = function(){}){
    var sql = 'INSERT INTO ' + table;
    var col = '(';
    var val = '(';
    for(var name in values){
        col = col + name + ',';
        val = val + '\'' + values[name] + '\',';
    }
    col = col.substring(0,col.length - 1);
    val = val.substring(0,val.length - 1);
    col += ')';
    val += ')';

    sql = sql + col + ' VALUES' +  val;
    //console.log(sql);   
    DBCommit(sql, callback);
}

//updateDB
//only one table per update, but multiple columns can be set
//arguments: table string
//            set: object, col names as key, update value as value
//            Where: sql string, default null, where statement

function updateDB(table, set, Where = null, callback = function(){}){
    var sql = 'UPDATE ' + table + ' SET ';
    for(var name in set){
        sql = sql + name + '=\'' + set[name] + '\',';
    }
    sql = sql.substring(0,sql.length-1) + ' ';
    if(Where)
        sql += Where;
    //console.log(sql);   
    DBCommit(sql,callback);
}

//deleteDB
//arguments: table string, Where string

function deleteDB(table, Where = null, callback = function(){}){
    var sql = 'DELETE FROM ' + table + ' ';

    if(Where)
        sql += Where;
    
    DBCommit(sql, callback);
}

//module.exports.DBCommit = DBCommit;
module.exports.readFromDB = readFromDB;
module.exports.insertIntoDB = insertIntoDB;
module.exports.updateDB = updateDB;
module.exports.deleteDB = deleteDB;