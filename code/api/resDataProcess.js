const qs = require('querystring');

module.exports.resDataProcess = function resDataProcess(req, res){
    var data = {};
    data = res.data;
    //console.log("data in res:    " + data);
    //data = qs.stringify(data);
    //res.write(data);
    res.write(JSON.stringify(data));
    
    //console.log("res data: ", res.data);
    
    res.end();
}

