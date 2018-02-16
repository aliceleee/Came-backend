//function uploadPathText api
//arguments: req contains UserName, Access, ID, Title, Intro, DetailIntro
//           res contains Accept flag, Reason 0 for success, 1 for database error, 6 for PathID error                                            
//                        ID for PathID
//           callback function
//in this function, text information about this path (according to PathID) will be 
//insert into the database

const DBManager = require('./DBManager');
const resDP = require('./resDataProcess');

module.exports.uploadPathText = function uploadPathText(req, res, callback){
    
    //verify succeed
    //verify for path succeed

    DBManager.updateDB('path', {Title: req.Title, Intro: req.Intro, DetailIntro: req.DetailIntro}, 
                    'WHERE PathID = ' + req.ID, function(err){
        if(err){
            console.log("uploadPathText fail, error: " + err.errno + " " + err.message);
            res.data.Accept = 0;    //uploadPathText fail
            res.data.Reason = 1;    //database error
            res.data.ID = req.ID;
            resDP.resDataProcess(req, res);
            return;
        }
        res.data.Accept = 1;    //uploadPathText succeed
        res.data.Reason = 0;    //uploadPathText succeed
        res.data.ID = req.ID;
        callback();
        return;
    });
}