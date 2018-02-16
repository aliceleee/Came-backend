//logout function api
//arguments: req contains UserName and Access string 
//                                          which is an encrypted message about user password and login time
//            res contains two flags, Accept indicates whether user logout succeed or not
//                                           Reason indicates the reason for failure, 0 for success,
//                                           1 for database error
//                                           2 for user name error, user doesn't exist
//                                           3 for unmatched Access
//            callback
//once logout success, the Access field in the database will be reset as 0 

var DBManager = require('./DBManager');
var resDP = require('./resDataProcess');

module.exports.logout = function(req, res, callback){
    //verify succeed, clear Access field in database
    DBManager.updateDB('user', {Access: 0}, 'WHERE UserName = \'' + req.UserName + '\'', function(err){
            if(err){
            console.log(req.UserName + " Logout fail, clear Access field in database error: " + err.errno + " " + err.message);
            res.data.Accept = 0;  //logout fail
            res.data.Reason = 1;  //database error
            resDP.resDataProcess(req, res);
            return;
        }

        res.data.Accept = 1;  //logout succeed
        res.data.Reason = 0;  //logout succeed
        callback();
        return;
    });
}