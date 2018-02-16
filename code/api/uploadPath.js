//function uploadPath api
//arguments: req contains UserName, Access, Path data, ID (NULL for create a file, not NULL for cover an 
//                                                      existing file)
//           res contains Accept flag(boolean), Reason (0 for success, 1 for database error, -1 for other reasons
//                                                      6 for path error: no such path in database), 
//                        ID for pathID in database
//           callback function
//in this function, path data will be writen to file first, and then pathURL will be update in database

var fileManager = require('./fileManager');
var DBManager = require('./DBManager');
var verifyForPath = require('./verifyForPath');
var resDP = require('./resDataProcess');

module.exports.uploadPath = function(req, res, callback){
    
    //define function writeToFile
    function writeToPathFile(dirPath){
        if(dirPath == -1){
            console.log(req.UserName + "uploadPath fail, create directory error: " + err.errno + " " + err.message);            
            res.data.Accept = 0; //upload fail
            res.data.Reason = 5; //file operation errors
            resDP.resDataProcess(req, res);
            return;
        }
        //URL parse?
        fileManager.writeToFile(dirPath + '/path.txt', req.Path, function(){
            //if ID is not null, no need for insert to database and fetch PathID
            if(req.ID){
                res.data.Accept = 1;    //upload succeed
                res.data.Reason = 0;    //upload succeed
                res.data.ID = req.ID;
                callback();
                return;
            }
            
            DBManager.insertIntoDB('path', {UserName: req.UserName, PathURL: dirPath + '/path.txt'}, function(err){
                if(err){
                    console.log(req.UserName + "uploadPath fail, insert URL into database error: " + err.errno + " " + err.message);
                    res.data.Accept = 0; //upload fail
                    res.data.Reason = 1; //database errors
                    resDP.resDataProcess(req, res);
                    return;
                }

                //insert succeed, read PathID from database
                
                DBManager.readFromDB('path', {col:['PathID'], Where:'WHERE UserName = \'' + req.UserName +
                '\' AND PathURL = \'' + dirPath + '\/path.txt\''}, function(err, result){
                    if(err){
                        console.log(req.UserName + "uploadPath fail, fetch PathID error: " + err.errno + " " + err.message);
                        res.data.Accept = 0; //upload fail
                        res.data.Reason = 1; //database error
                        resDP.resDataProcess(req, res);
                        return;  
                    }   
                    if(result == ''){
                        console.log(req.UserName + "uploadPath fail, no such path in database!");
                        res.data.Accept = 0; //upload fail
                        res.data.Reason = 6; //no such path
                        resDP.resDataProcess(req, res);
                        return;
                    }
                    res.data.Accept = 1;    //upload succeed
                    res.data.Reason = 0;    //upload succeed
                    res.data.ID = result[0].PathID;
                    callback();
                    return;
                });
            });
        });
    }

    function reWriteFile(){
        fileManager.getPathDir(req.ID, writeToPathFile);
        return;
    }
      
    //ID == NULL, create a new file
    if(!req.ID)
        fileManager.createPathDir(req.UserName, writeToPathFile);
    else
        verifyForPath.verifyForPath(req, res, reWriteFile);
};