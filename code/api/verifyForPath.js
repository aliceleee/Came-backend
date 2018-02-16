//function verifyForPath api
//arguments: req contains UserName, Access, ID
//           res contains Accept flag and Reason
//           Reason: 1 for database error, 2 for username not existing, 3 for Access error,
//                   4 for necessary information empty, 6 for path not existing,
//                   7 for no authority to operate path
//if verification success, call callback function, else end the middleware cycle

const DBManager = require('./DBManager');
const resDP = require('./resDataProcess');

module.exports.verifyForPath = function verifyForPath(req, res, next){
    
    //necessary information can't be empty
    if(!req.ID){
        res.data.Accept = 0;    //verify fail
        res.data.Reason = 4;    //necessary information can't be empty
        res.data.ID = req.ID;
        resDP.resDataProcess(req, res);
        return;
    }

    DBManager.readFromDB('path', {col: ['UserName', 'Private'], Where: 'WHERE PathID = ' + req.ID}, function(err, result){
        if(err){
            res.data.Accept = 0;    //verify fail
            res.data.Reason = 1;    //database error
            res.data.ID = req.ID;
            resDP.resDataProcess(req, res);
            return;
        }
        if(result == ''){
            res.data.Accept = 0;    //verify fail
            res.data.Reason = 6;    //path doesn't exist
            res.data.ID = req.ID;
            resDP.resDataProcess(req, res);
            return;
        }
        if((result[0].UserName != req.UserName && result[0].Private == 1) || 
            (result[0].UserName != req.UserName && req.edit == 1)){
            res.data.Accept = 0;    //verify fail
            res.data.Reason = 7;    //no authority
            res.data.ID = req.ID;
            resDP.resDataProcess(req, res);
            return;
        }
        next();
    });
}