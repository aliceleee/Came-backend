//function verify api
//arguments: req contains UserName and Access, res contains Accept flag and Reason
//                                     Reason: 1 for database error, 2 for username error, 3 for Access error
//                                             4 for necessary information can't be empty
//if verification success, call callback function, else end the middleware cycle

const DBManager = require('./DBManager');
const resDP = require('./resDataProcess');

module.exports.verify = function verify(req, res, callback){
    
    if(!req.UserName || !req.Access){
        res.data.Accept = 0;    //verify fail
        res.data.Reason = 4;    //necessary information can't be empty
        resDP.resDataProcess(req, res);
        return;
    }
    
    DBManager.readFromDB('user', {col: ['Access'], Where: "WHERE UserName = \'" + req.UserName + "\'"}, function(err, result){
        if(err){
            res.data.Accept = 0;    //verify fail
            res.data.Reason = 1;    //database error
            console.log("verify fail, database error: " + err.errno + " " + err.message);
            resDP.resDataProcess(req, res);     //end the middleware cycle
            return;
        }
        if(result == ''){
            res.data.Accept = 0;    //verify fail
            res.data.Reason = 2;    //user name error, user doesn't exist
            resDP.resDataProcess(req, res);     //end the middleware cycle
            return;
        }
        if(req.Access != result[0].Access){
            res.data.Accept = 0;    //verify fail
            res.data.Reason = 3;    //Access doesn't match
            resDP.resDataProcess(req, res);     //end the middleware cycle
            return;
        }

        //verify succeed!
        callback();
    });
}