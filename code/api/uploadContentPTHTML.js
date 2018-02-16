//function uploadPathContentPTHTML api
//arguments: req contains UserName, Access, PathID, HTML data, Location
//           res contains Accept, Reason                        

const DBManager = require('./DBManager');
const fileManager = require('./fileManager');
const resDP = require('./resDataProcess');

module.exports.uploadContentPTHTML = function(req, res, next){

    //using userName, PathID and time to generate file name
    var fileName = req.UserName + req.ID + new Date().getTime();

    fileManager.writeToFile('./code/resources/contentHTML/' + fileName, req.HTML, function(){
        DBManager.insertIntoDB('contentpt', {PathID: req.ID, HTMLURL: '/' + fileName, Location: req.Location},
         function(err){
            if(err){
                res.data.Accept = 0;    //uploadContentPTHTML fail
                res.data.Reason = 1;    //database error
                resDP.resDataProcess(req, res);
                return;
            }
            res.data.Accept = 1;    //uploadContentPTHTML succeed
            res.data.Reason = 0;    
            next();
            return;
        });
    });
}