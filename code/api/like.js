//function like api
//arguments: req contains UserName, Access, ID, Like(int, 1 for like, -1 for dislike)
//           res contains Accept flag(boolean), Reason (0 for success, 1 for database error, 
//                                                      8 for liked/disliked before)
//           next function

const DBManager = require('./DBManager');
const resDP = require('./resDataProcess');

module.exports.like = function(req, res, next){

    DBManager.insertIntoDB('likerecord', {UserName: req.UserName, PathID: req.ID, LikeOrDislike: req.Like}, function(err){
        if(err){
            if(err.errno == 1062 || err.errno == 23000){
                res.data.Accept = 0;    //like/dislike fail
                res.data.Reason = 8;    //liked/disliked before
                resDP.resDataProcess(req,res);
                return;
            }
            res.data.Accept = 0;    //like/dislike fail
            res.data.Reason = 1;    //database error
            resDP.resDataProcess(req, res);
            return;
        }
        res.data.Accept = 1;    //like/dislike succeed
        res.data.Reason = 0;    //like/dislike succeed
        next();
        return;
    });
        
    DBManager.readFromDB('path', {col: ['Likes', 'Dislikes'], Where: "WHERE PathID = " + req.ID}, function(err, result){
        if(err)
            return;
        if(req.Like > 0){
            DBManager.updateDB('path', {Likes: Number(result[0].Likes)+ 1}, "WHERE PathID = " + req.ID);
            return;
        }
        DBManager.updateDB('path', {DisLikes: Number(result[0].DisLikes) + 1}, "WHERE PathID = " + req.ID);
        return;
    });

}