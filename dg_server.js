var baseServer = require("./baseServer");
//启动http服务器
server = baseServer.start();

var userlist=[];
var idCount = 0;
//创建websocket连接
var socket = require('socket.io').listen(server, {log: false});

socket.on("connection", function(es) {
	es.on("message", function(data) {
		console.log("recv "+data);
	});
	//记录登录名
	es.on('username', function(username) {
		console.log('username: '+username.username);

		//插入至用户名表
		var id = addUser(username.username);
		//提供当前用户名列表
		es.emit('namelist', {userlist: userlist, id: id});
		//向已有用户广播新用户登录
		es.broadcast.emit('newuser', {newname: username.username, id: id});
	});

	//断开连接
	es.on('disconnect', function(){
		console.log(' disconnected...');
	});

	es.on('exit', function(data) {
		console.log('exit: '+data.id);
		//通知有人退出
		es.broadcast.emit('exit2', { id: data.id, name: userlist[data.id][1]});
		//处理用户列表
		delUser(data.id);//从用户列表中将该用户删除
		
	});

	es.on("his", function(data) {
		es.broadcast.emit("toDraw", {his: data.his});
	});
	es.on("clear", function(data) {
		es.broadcast.emit("clearAll", {id: data.id});
	});
});

//添加用户至用户列表
function addUser(name) {
	for(var k in userlist) {
		if('' == userlist[k][1]) {
			userlist[k][1] = name;
			return k;
		}
	}
	var user = [idCount, name];
	userlist.push(user);
	idCount++;
	return (idCount-1);
}

//从用户列表中删除用户
function delUser(id) {
	for(var k in userlist) {
		if(id == userlist[k][0]) {
			userlist[k][1] = '';
			break;
		}
	}
}