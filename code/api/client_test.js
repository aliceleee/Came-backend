const http = require('http');
const querystring = require('querystring');

const userInfo = {"UserName": "SymenYang", 
                  //"Password":"129"
                  "Access": "b38001a19687af1df9a06c5b63882188",
                  "ID": "16",
                  "Like": "1",
                  "testdata": "recommend"
                  //"Path": "this time we watch a movie!"
                  //"Title": "movie tonight",
                  //"Intro": "intresting movie, i love it~",
                  //"DetailIntro": "Today, we balabalabalabalabalabalabalabala"
                };

var Alice = {"UserName": "Alice", 
                //"Password":"129"
                "Access": "713c2c12386a4c791d395fcb69b56a7d",
                "ID": "26"
                //"Path": "modify write to file function!"
                //"Like": "1"
                //"lastUpdateTime": "1513234393956",
                //"listPos": "10"
              };

const createPathData = {"UserName": "Alice",
                        "Access": "713c2c12386a4c791d395fcb69b56a7d",
                        "Path": "modify write to file function!",
                        "ID": null
                        };

var options = {
    port: 3000,
    method: 'POST',
    path: '/uploadPathCover',
    headers: {
        "Content-Type": 'application/x-www-formurlencoded'
    }
};

var req = http.request(options, function(res){
    var body = '';
    res.on('data',function(chunk){
        body += chunk;
    });
    res.on('end', function(){
        body = body.toString('utf8');
        body = JSON.parse(body);
        console.log(body);
        //console.log("PathID ", body.ID);
        //req.write(JSON.stringify(createPathData));
        //req.end();
        });
});

var userInfoString = JSON.stringify(userInfo);
//req.write(userInfoString);
req.write(JSON.stringify(Alice));
//req.write(JSON.stringify(createPathData));
req.end();
