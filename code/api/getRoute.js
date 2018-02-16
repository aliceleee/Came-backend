//function getRoute api
//arguments: req contains UserName, Access, ID 
//           res contains Accept flag(boolean), Reason (0 for success, 1 for database error, -1 for other reasons
//                                                      6 for no such path in database, 7 for no authority), 
//                        Like(bool), Likes, Dislikes, CoverImg(URL), Title, Intro, DetailIntro, Path, ContentList
//                        ContentList = [{'Location': , 'HTMLURL': }]
//           next function
//Three database operation together, and ready flag for each one, the last one that finish the operation should
//call next. Besides, when error occurs, check res.data.Reason first, if Reason is not 0(initialized value or 
//success value), call resDP, else, other error handler have end this cycle

const DBManager = require('./DBManager');
const resDP = require('./resDataProcess');
const fs = require('fs');

module.exports.getRoute = function(req, res, next){
    var pathDataReady = false;
    var contentListReady = false;
    var likeRecordReady = false;

    //initialize res.data.Reason
    res.data.Reason = 0;

    DBManager.readFromDB('path', {Where: "WHERE PathID = " + req.ID}, function(err, result){
        
        //if error occured and Reason attribute is 0 or undefined(original), then end cycle, otherwise don't
        //call resDP, because other error handler may send res to user
        if(err && !res.data.Reason){
            res.data.Accept = 0;    //getRoute fail
            res.data.Reason = 1;    //database error
            resDP.resDataProcess(req, res);
            return;
        }
        
        res.data.Likes = result[0].Likes;
        res.data.Dislikes = result[0].Dislikes;
        res.data.CoverImg = result[0].CoverImg;
        res.data.Title = result[0].Title;
        res.data.Intro = result[0].Intro;
        res.data.DetailIntro = result[0].DetailIntro;

        //get path data
        fs.readFile(result[0].PathURL, function(err, bufferData){
            if(err && !res.data.Reason){
                res.data.Accept = 0;    //getRoute fail
                res.data.Reason = 5;    //file operation error
                resDP.resDataProcess(req, res);
                return;
            }

            res.data.Path = bufferData.toString('utf8');
            pathDataReady = true;
            if(contentListReady && likeRecordReady){
                res.data.Accept = 1;    //getRoute succeed
                res.data.Reason = 0;    //getRoute succeed
                next();
            }   
        });
    });

    DBManager.readFromDB('contentpt', {col: ['Location', 'HTMLURL'], Where: 'WHERE PathID = ' + req.ID}, function(err, results){
        if(err && !res.data.Reason){
            res.data.Accept = 0;    //getRoute fail
            res.data.Reason = 1;    //database error
            resDP.resDataProcess(req, res);
            return;
        }

        if(results == ''){
            // no content point
            res.data.ContentList = [];
            contentListReady = true;
            if(pathDataReady){
                res.data.Accept = 1;    //getRoute succeed
                res.data.Reason = 0;    //getRoute succeed
                next();
                return;
            }
        }

        res.data.ContentList = [];
        for(var i = 0; i < results.length; i++){
            var contentPt = {};
            contentPt['Location'] = results[i].Location;
            contentPt['HTMLURL'] = results[i].HTMLURL;
            res.data.ContentList.push(contentPt);
        }
        contentListReady = true;
        if(pathDataReady && likeRecordReady){
            res.data.Accept = 1;    //getRoute succeed
            res.data.Reason = 0;    //getRoute succeed
            next();
            return;
        }
    });

    DBManager.readFromDB('likerecord', {Where: 'WHERE UserName = \'' + req.UserName + 
                        '\' AND PathID = ' + req.ID}, function(err, result){
        if(err && !res.Reason){
            res.data.Accept = 0;    //getRoute fail
            res.data.Reason = 1;    //database error
            resDP.resDataProcess(req, res);
            return;
        }

        if(result == '')
            res.data.Like = 0;  //user haven't liked this route
        else
            res.data.Like = 1;
        
        likeRecordReady = true;
        if(pathDataReady && contentListReady){
            res.data.Accept = 1;    //getRoute succeed
            res.data.Reason = 0;    //getRoute succeed
            next();
            return;
        }
    });
}