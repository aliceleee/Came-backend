//function like api
//arguments: req contains UserName, Access, ID
//           res contains Accept flag(boolean), Reason (0 for success, 1 for database error
//                                                      9 for not liked/disliked yet)
//           next function

const DBManager = require('./DBManager');
const resDP = require('./resDataProcess');

module.exports.cancelLike = function(req, res, next){

    DBManager.readFromDB('likerecord', {Where: "WHERE UserName = \'" + req.UserName + "\' AND PathID = " + req.ID},
                        function(err, result){
        if(err){
            res.data.Accept = 0;    //cancelLike fail
            res.data.Reason = 1;    //database error
            resDP.resDataProcess(req, res);
            return;
        }
        if(result == ''){
            res.data.Accept = 0;    //cancelLike fail
            res.data.Reason = 9;    //not liked/disliked yet
            resDP.resDataProcess(req, res);
            return;
        }
        
        DBManager.deleteDB('likerecord', "WHERE UserName = \'" + req.UserName + "\' AND PathID = " + req.ID, function(err){
            if(err){
                res.data.Accept = 0;    //cancelLike fail
                res.data.Reason = 1;    //database error
                resDP.resDataProcess(req, res);
                return;
            }
            res.data.Accept = 1;    //cancelLike succeed
            res.data.Reason = 0;    //cancelLike succeed
            next();
            return;
        });

        DBManager.readFromDB('path', {col: ['Likes'], Where: "Where PathID = " + req.ID}, function(err, result){
            DBManager.updateDB('path', {Likes: Number(result[0].Likes) - 1}, "WHERE PathID = " + req.ID);
        });
    });
}