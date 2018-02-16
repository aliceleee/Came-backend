//register function api
//arguments: req contains UserName and Password
//            res contains two flags, Accept indicates whether register succeed or not
//                                           Reason indicates the reason for failure, 0 for success, 
//                                           1 for database error, 2 for user name error
//                                           4 for necessary information can't be empty
//            callback contains a function

var DBManager = require('./DBManager');
var resDP = require('./resDataProcess');

//res one of the argument or the argument of the callback function?

module.exports.register = function (req, res, callback){
    DBManager.insertIntoDB('user', {UserName: req.UserName, Password: req.Password}, function(err){
        if(err){
            if(err.errno == 1062 || err.errno == 23000){
                res.data.Accept = 0;  //register failed
                res.data.Reason = 2;  //because of duplication of UserName
                resDP.resDataProcess(req, res);
                return;
            }
            res.data.Accept = 0;  //register failed
            res.data.Reason = 1;  //database error
            console.log(req.UserName + " Register fail, insert data error: " + err.no + " " + err.message);
            resDP.resDataProcess(req, res);
            return;
        }
        res.data.Accept = 1;  //register succeed
        res.data.Reason = 0;  //register succeed
        callback();
    });
}