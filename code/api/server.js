const reqDP = require('./reqDataProcess');
const resDP = require('./resDataProcess');
const verify = require('./verify');
const verifyForPath = require('./verifyForPath');
const recommend = require('./recommend'); 
const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const uploadPath = require('./uploadPath');
const uploadPathText = require('./uploadPathText');
const uploadHTML = require('./uploadContentPTHTML');
const uploadImg = require('./uploadImg');
const getRoute = require('./getRoute');
const like = require('./like');
const cancelLike = require('./cancelLike');
const express = require('express');
const bodyParser = require('body-parser');
const Multiparty = require('connect-multiparty');
const Buffer = require('buffer');

const server = express();

//resources 
server.use(express.static('resources/contentHTML'));
server.use(express.static('resources/img'));
 
server.use(bodyParser.urlencoded( {extended: true}));
server.use(bodyParser.json());
server.use(bodyParser.raw());
server.use(bodyParser.text());

//route
server.post('/api/getRecommend',reqDP.reqDataProcess, recommend.getRecommend);

server.post('/api/register',reqDP.reqDataProcess, register.register);

server.post('/api/login',reqDP.reqDataProcess, login.login);

server.post('/api/logout',reqDP.reqDataProcess, verify.verify);
server.post('/api/logout', logout.logout);

server.post('/api/uploadPath',reqDP.reqDataProcess, verify.verify);
server.post('/api/uploadPath', uploadPath.uploadPath);

server.post('/api/uploadPathText', function(req, res, next){
    //upload function, mark edit flag
    req.edit = 1;
    next();
}, reqDP.reqDataProcess,verify.verify);
server.post('/api/uploadPathText', function(req, res, next){
    //upload function, mark edit flag
    req.edit = 1;
    next();
}, verifyForPath.verifyForPath);
server.post('/api/uploadPathText',uploadPathText.uploadPathText);

var multiparty = Multiparty();
server.post('/api/uploadImg', multiparty, reqDP.reqDataProcess, verify.verify);
server.post('/api/uploadImg', uploadImg.uploadImg);

server.post('/api/uploadContentPTHTML', reqDP.reqDataProcess,verify.verify);
server.post('/api/uploadContentPTHTML', function(req, res, next){
    //upload function, mark edit flag
    req.edit = 1;
    next();
}, verifyForPath.verifyForPath);
server.post('/api/uploadContentPTHTML', uploadHTML.uploadContentPTHTML);

server.post('/api/uploadCover', multiparty, reqDP.reqDataProcess, verify.verify);
server.post('/api/uploadCover', function(req, res, next){
    //mark edit flag
    req.edit = 1;
    next();
}, verifyForPath.verifyForPath);
server.post('/api/uploadCover', uploadImg.uploadCover);

server.post('/api/getRoute', reqDP.reqDataProcess/*,verify.verify*/);
server.post('/api/getRoute', function(req, res, next){
    //mark edit flag
    req.edit = 0;
    next();
}, verifyForPath.verifyForPath);
server.post('/api/getRoute', getRoute.getRoute);

server.post('/api/like', reqDP.reqDataProcess,verify.verify);
server.post('/api/like', function(req, res, next){
    //mark edit flag
    req.edit = 0;
    next();
}, verifyForPath.verifyForPath);
server.post('/api/like', like.like);

server.post('/api/cancelLike',reqDP.reqDataProcess, verify.verify);
server.post('/api/ancelLike', function(req, res, next){
    //mark edit flag
    req.edit = 0;
    next();
}, verifyForPath.verifyForPath);
server.post('/api/cancelLike', cancelLike.cancelLike);

server.use(resDP.resDataProcess);

server.listen(3000, function(){
    console.log("server is listening at port 3000!");
    recommend.initializeNextPos();
    recommend.updateList();
});

