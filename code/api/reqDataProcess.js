//function reqDataProcess 
//process the req data, and add attribute in data to req

const qs = require('querystring');

module.exports.reqDataProcess = function reqDataProcess(req, res, next){
        
        for(var name in req.body){
            req[name] = req.body[name];
        }

        res.data = {};  //define res.data as object to prepare for the rest operations

        //console.log("req body:", req.body);
        //console.log("UserName in req body:", req.body.UserName);
        //console.log("after all processing, req.UserName:", req.UserName);

        next();
}