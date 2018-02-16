//function uploadImg api
//arguments: req contains UserName, Access, files(contains object file)
//           res contains Accept, Reason(11 for no file received or format error), ImgURL
//function uploadCover api
//arguments: req contains UserName, Access, ID(PathID), files(contains object file)
//           res contains Accept, Reason, ID, ImgURL


const fs = require('fs');
const resDP = require('./resDataProcess');
const DBManager = require('./DBManager');

function uploadImg(req, res, next){
    if(!req.files){
        res.data.Accept = 0;    //uploadImg fail
        res.data.Reason = 11;   //no file received or format error
        res.data.ImgURL = null;
        resDP.resDataProcess(req, res);
        return;
    }

    var tempFilePath = req.files.file.path;  console.log("temp file path: ", tempFilePath);
    var ImgURL = '/' + req.files.file.originalFilename;
    var writeStream = fs.createWriteStream('./code/resources/img' + ImgURL);
    var readStream = fs.createReadStream(tempFilePath);

    readStream.pipe(writeStream);

    writeStream.on('close', function(){
        
        //delete temp file
        fs.unlinkSync(tempFilePath);
        
        res.data.Accept = 1;
        res.data.Reason = 0;
        res.data.ImgURL = ImgURL;
        next();
        return;
    });
}

function uploadCover(req, res, next){
    
    function DBoperation(){
        if(!res.data.ImgURL){
            res.data.Accept = 0;    //uploadCover fail
            res.data.Reason = -1;   //other reasons
            resDP.resDataProcess(req, res);
            return;
        }

        DBManager.updateDB('path', {CoverImg: res.data.ImgURL}, "WHERE PathID = " + req.ID, function(err){
            if(err){
                console.log("upload cover fail, update database error: " + err.errno + " " + err.message);
                res.data.Accept = 0;    //uploadCover fail
                res.data.Reason = 1;    //database error
                resDP.resDataProcess(req, res);
                return;
            }

            next();
        });        
    }
    
    uploadImg(req, res, DBoperation);
}

module.exports.uploadImg = uploadImg;
module.exports.uploadCover = uploadCover;