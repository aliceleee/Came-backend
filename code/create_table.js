let mysql = require('mysql');

let conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '129',
    database: 'came'
});

conn.connect(function(err){
    if(err)
        console.log('error: ' + err.message);
    else
        console.log("connection success!");
    
    return;
});

//USER TABLE 
let statement = "CREATE TABLE user(" + 
                "UserName CHAR(16) NOT NULL," +
                "Password CHAR(128) NOT NULL,"+
                "Access CHAR(64) NOT NULL DEFAULT 0,"+
                "PRIMARY KEY(UserName))";
conn.query(statement,function(err, results, fields){
    if(err)
        console.log("error: " + err.message);
    return;
});
//PATH TABLE 
statement = "CREATE TABLE path(" + 
            "PathID INT UNSIGNED AUTO_INCREMENT," +
            "UserName CHAR(16) NOT NULL," + 
            "PathURL CHAR(255) NOT NULL," +
            "CoverImg CHAR(255) NOT NULL DEFAULT 0," +
            "Title CHAR(40)," +
            "Intro CHAR(120)," +
            "DetailIntro VARCHAR(2400)," + 
            "Likes INT UNSIGNED NOT NULL DEFAULT 0," +
            "Dislikes INT UNSIGNED NOT NULL DEFAULT 0," +
            "Private BOOLEAN NOT NULL DEFAULT FALSE," +
            "PRIMARY KEY(PathID)," +
            "FOREIGN KEY(UserName) REFERENCES user(UserName))";
conn.query(statement, function(err, results, fields){
    if(err)
        console.log("error: " + err.message);
    return;
});
//CONTENTPT TABLE
statement = "CREATE TABLE contentpt(" +
            "ID INT UNSIGNED AUTO_INCREMENT," +
            "PathID INT UNSIGNED NOT NULL," +
            "HTMLURL CHAR(255) NOT NULL," +
            "Location CHAR(25)," +
            "PRIMARY KEY(ID)," +
            "FOREIGN KEY(PathID) REFERENCES path(PathID))";
conn.query(statement, function(err, results, fields){
    if(err)
        console.log("error: " + err.message);
    return;
});     
//LIKERECORD TABLE 
statement = "CREATE TABLE likerecord(" +
            "UserName CHAR(16) NOT NULL," +
            "PathID INT UNSIGNED NOT NULL," +
            "LikeOrDislike INT NOT NULL," +
            "PRIMARY KEY(UserName, PathID)," +
            "FOREIGN KEY(UserName) REFERENCES user(UserName)," +
            "FOREIGN KEY(PathID) REFERENCES path(PathID))";
conn.query(statement, function(err, results, fields){
    if(err)
        console.log("error: " + err.message);
    return;
});  

conn.end(function(err){
    if(err)
        console.log("error: " + err.message);
    else    
        console.log("connection close!");
    return;
});
 /*             
CREATE TABLE likerecord(
    ID INT UNSIGNED AUTO_INCREMENT,
    UserName CHAR(16) NOT NULL,
    PathID INT UNSIGNED NOT NULL,
    Like INT NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(UserName) REFERENCES user(UserName),
    FOREIGN KEY(PathID) REFERENCES path(PathID));*/