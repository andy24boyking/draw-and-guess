var baseServer = require("../baseServer");
//启动http服务器
server = baseServer.start();

var userlist=[];

//创建websocket连接
var socket = require('socket.io').listen(server);

socket.on("connection", function(es){
});