//function getRecommend api
//arguments: req contains lastUpdateTime, listPos
//           res contains Accept, Reason (10 for recommendList is updatings)
//                        DataList: array, each element is an object containing key-value pairs including 
//                                  PathID, CoverImg, Title, Intro, DetailIntro
//                        listPos: position in recommendList of next request for getRecommend
//                        lastUpdateTime: the global variable to indicate lastUpdateTime of recommendList in server

const DBManager = require('./DBManager');
const resDP = require('./resDataProcess');


var recommendList = [];         //recommendList used to store recommend data
                                //each element is an object contains ID(PathID), ImageURL(CoverImg),Title,Intro
                                //                                   Detail Intro
var updatingFlag = false;       //boolean: indicate whether recommendList is updating now
var nextPos = 0;                //int: indicate the start position in database of next updating
var lastUpdateTime = new Date().getTime();  

function initializeNextPos(){
    DBManager.readFromDB('path', {col: ['COUNT(*)'], Where: "WHERE Private = 0"}, function(err, result){
        if(err){
            console.log("initialize nextPos error, fetch total number error: " + err.errno + " " + err.message);
            return;
        }

        var totalNum;
        for(var name in result[0])
            totalNum = result[0][name];
        
        nextPos = Math.floor(Math.random() * totalNum);

        console.log("now nextPos: ", nextPos);
        return;
    });
}

function updateList(){

    //first mark updating flag
    updatingFlag = true;

    //clear old recommendList
    recommendList.length = 0;

    //fetch data from database to fill the recommendList
    //first get the total number of records in path table
    DBManager.readFromDB('path', {col: ['COUNT(PathID)'], Where: "WHERE Private = 0"}, function(err, result){
        if(err){
            console.log("get the total number of records when updating recommendList error: "
                         + err.errno + " " + err.message);
            updatingFlag = false;
            return;
        }
        
        var totalNum;

        for(var name in result[0])
            totalNum = result[0][name];
        
        DBManager.readFromDB('path', {col: ['PathID', 'CoverImg', 'Title', 'Intro', 'DetailIntro'], Where: 
                            "WHERE Private = 0", Limit: "LIMIT " + nextPos + ",50"}, function(err, results, field){
            if(err){
                console.log("fetch data from database when updating recommendList error: " + 
                            err.errno + " " + err.message);
                updatingFlag = false;
                return;
            }

            //traverse results, push all data to recommendList
            for(var i = 0; i < results.length; i++){
                var tempobj = {};
                //traverse result[i] to get every attribute
                for(var name in results[i])
                    tempobj[name] = results[i][name];
                
                recommendList.push(tempobj);
            }
            
            //modify nextPos
            if(nextPos + 50 >= totalNum)
                nextPos = 0;
            else
                nextPos += 50;
            
            //modify lastUpdateTime
            lastUpdateTime = new Date().getTime();

            //mark updating flag
            updatingFlag = false;

            return;
        });
    });
}

function getRecommend(req, res, next){
    
    //compare update time  
    if(Number(req.lastUpdateTime) < lastUpdateTime)
        req.listPos = 0;
    
    //check updating flag
    if(updatingFlag){
        res.data.Accept = 0;    //this request fail because of recommendList updating
        res.data.Reason = 10;   //recommendList is updating
        res.data.lastUpdateTime = lastUpdateTime;
        res.data.listPos = 0;
        resDP.resDataProcess(req, res);
        return;
    }

    //wait until updating flag is false
    res.data.DataList = [];

    //if listPos don't reach the end, and recommendList is not empty, then traverse to get data in recommendList
    if(req.listPos < recommendList.length){
        var i = req.listPos;
        for(var cnt = 0; i < recommendList.length && cnt < 10; i++, cnt++){
            var tempobj = {};
            //traverse each data entry in recommendList
            for(var name in recommendList[i])
                tempobj[name] = recommendList[i][name];
            
            res.data.DataList.push(tempobj);
        }

        //if request reach the end, update recommendList
        if(i >= recommendList.length){
            res.data.listPos = 0;
            res.data.lastUpdateTime = lastUpdateTime;
            res.data.Accept = 1;    //this request succeed
            res.data.Reason = 0;
            updateList();
            next();
            return;
        }
        else{
            res.data.listPos = i;
            res.data.lastUpdateTime = lastUpdateTime;
            res.data.Accept = 1;    //this request succeed
            res.data.Reason = 0;
            next();
            return;
        }
    } 

    //else the listPos reach the end or recommendList is empty
    //update recommendList and refetch
    updateList();
    getRecommend(req, res, next);
    return;
}

module.exports.recommendList = recommendList;
module.exports.updateList = updateList;
module.exports.getRecommend = getRecommend;
module.exports.initializeNextPos = initializeNextPos;