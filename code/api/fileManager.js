var fs = require('fs');
var DBManager = require('./DBManager');

//createPathDir
//arguments: UserName,callback function(dirPath as argument)
//create a directory using UserName and time as directory name

function createPathDir(UserName, callback){
    var dirName = UserName + new Date().getTime().toString();
    if(fs.existsSync('./code/resources/path')){
        fs.mkdirSync('./code/resources/path/' + dirName)
        callback('./code/resources/path/' + dirName);
        return;
    }
    callback(-1);
}

//getPathDir
//arguments: PathID, callback
//                    callback contains a dirPath as argument
//no return value

function getPathDir(PathID,callback){
    var PathURL = 0;
    var dirPath = 0;

    DBManager.readFromDB('path', {col: ['PathURL'], Where: 'WHERE PathID = ' + PathID}, function(err, result){
        if(err){
            PathURL = -1;
            console.log("getPathDir fail, readFromDB error: " + err.errno + " " + err.message);
            callback(-1);
            return;
        }
        PathURL = result[0].PathURL;
        
        if(PathURL == -1){
            callback(-1);
            return;
        }
        else{
            PathURL = PathURL.toString();
            if(PathURL.substring(PathURL.length - 9, PathURL.length) == '/path.txt')
                dirPath = PathURL.substring(0, PathURL.length - 9);
            callback(dirPath);
            return;
        }
    });
}

//writeToFile 
//arguments: dirPath, data, callback function 
//feed in a directory path, and create or rewrite path.txt file in this directory

function writeToFile(filePath, data, callback = function(){}){

    var fileStream = fs.createWriteStream(filePath);
    
    fileStream.on('error', function(err){
        console.log("writeToFile fail, error: " + err.errno + " " + err.message);   //how to process error
    });
    fileStream.end(data, 'utf8', callback);
}

module.exports.createPathDir = createPathDir;
module.exports.getPathDir = getPathDir;
module.exports.writeToFile = writeToFile;
