//login function api
//arguments: req contains UserName and Password
//            res contains three flags, Accept indicates whether login succeed or not
//                                             Reason indicates the reason for failure, 0 for success, 
//                                             1 for database error, 
//                                             2 for user name error, user doesn't exist
//                                             3 for unmatched password
//                                             Access is an encrypted message about user password and login time
//            callback function
//once login success, the login time will be set as the key to encrypt user's password, and this encrypted message
//is stored in the Access attribute in res, meanwhile, the Access field in the database will be updated

var DBManager = require('./DBManager');
var crypto = require('crypto');
var resDP = require('./resDataProcess');

module.exports.login = function(req, res, callback){
    console.log("in log in function!");

    DBManager.readFromDB('user', {Where: "WHERE UserName = \'" + req.UserName + "\'"}, function(err,result){
        if(err){
            console.log(req.UserName + " Log in fail, select from database error: " + err.errno + " " + err.message);
            res.data.Accept = 0;  //login fail
            res.data.Reason = 1;  //fail reason: database error
            resDP.resDataProcess(req, res);
            return;
        }
        if(result == ''){
            res.data.Accept = 0;  //login fail
            res.data.Reason = 2;  //user doesn't exist
            console.log("here user doesn't exsit!");
            resDP.resDataProcess(req, res);
            return;
        }
        if(result[0].Password == req.Password){
            //create Access 
            var timeKey = new Date().getTime().toString();    
            var md5 = crypto.createHmac('md5', timeKey);    
            md5.update(req.Password); 
            var Access = md5.digest('hex');

            //update Access in database
            DBManager.updateDB('user', {Access: Access}, 'WHERE UserName = \'' + req.UserName + '\'', function(err){
                if(err){
                    console.log(req.UserName + " Log in fail, update Access error: " + err.errno + " " + err.message);
                    res.data.Accept = 0;  //login fail
                    res.data.Reason = 1;  //other reasons: database error
                    resDP.resDataProcess(req, res);
                    return;
                }
                res.data.Accept = 1;  //login succeed
                res.data.Reason = 0;  //login succeed
                res.data.Access = Access;
                callback();
                return;
            });
            return;
        }
        res.data.Accept = 0;  //login fail
        res.data.Reason = 3;  //password error
        resDP.resDataProcess(req, res);
        return;
    });
}