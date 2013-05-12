var baseServer = require("./baseServer");
//启动http服务器
server = baseServer.start();

var userlist = [];
var roomlist = [];

//创建websocket连接
var io = require('socket.io').listen(server, {log: false});

io.sockets.on("connection", function(es) {
	console.log("connected..");
	es.emit("initroomlist", roomlist);
	//记录登录名
	es.on("username", function(username) {
		//插入至用户名表
		/*var id = */addUser(username.username, es.id);

		/*//提供当前用户名列表
		es.emit('namelist', {userlist: userlist, id: id});
		//向已有用户广播新用户登录
		es.broadcast.emit('newuser', {newname: username.username, id: id});*/
	});

	//断开连接
	es.on('disconnect', function(){
		console.log(' disconnected...'+es.id);
		delUser(es.id);//从用户列表中将该用户删除
		//通知有人退出
		//es.broadcast.emit('exit2', { id: data.id, name: userlist[data.id][1]});
	});


	//创建房间
	es.on("createRoom", function(num) {
		var room = new Array(parseInt(num));
		room[0] = es.id;
		addRoom(room);

		es.emit("roomchange", roomlist);
		es.broadcast.emit("roomchange", roomlist);
	});
	//有人加入房间
	es.on("enterroom", function(roomid) {
		enterRoom(roomid, es.id);

		es.broadcast.emit("roomchange", roomlist);
	});
	//退出房间
	es.on("exitroom", function(roomid) {
		var exitr = exitroom(roomid, es.id);
		
		es.emit("roomchange", roomlist);
		es.broadcast.emit("roomchange", roomlist);
	});
	
	es.on("his", function(data) {
		es.broadcast.emit("toDraw", {his: data.his});
	});
	es.on("clear", function(data) {
		es.broadcast.emit("clearAll", {id: data.id});
	});
});

//添加用户至用户列表
function addUser(name, id) {
	for(var k = 0; k < userlist.length; k++) {
		if(userlist[k] == undefined) {
			userlist[k] = [id, name];
			return k;
		}
	}
	var user = [id, name];
	userlist.push(user);

	return userlist.length - 1;
}

//从用户列表中删除用户
function delUser(id) {
	for(var k in userlist) {
		if(id == userlist[k][0]) {
			delete userlist[k];
			break;
		}
	}
}

//增加一个房间
function addRoom(room) {
	for(var k = 0; k < roomlist.length; k++)
		if(roomlist[k] == undefined)
			roomlist[k] = room;

	roomlist.push(room);
}
//加入房间
function enterRoom(roomid, id) {
	for(var i = 0; i < roomlist[roomid].length; i++) {
		if(roomlist[roomid][i] == null || roomlist[roomid][i] == "") {
			roomlist[roomid][i] == id;
			return;
		}
	}
}
//从房间中退出
function exitroom(roomid, id) {
	var count = 0;

	for(var i = 0; i < roomlist[roomid].length; i++) {
		if(roomlist[roomid][i] == id) {
			roomlist[roomid][i] = "";
			break;
		}
	}

	for(var i = 0; i < roomlist[roomid].length; i++) {
		if(roomlist[roomid][i] != null && roomlist[roomid][i] != "")
			count++;
	}

	if(count == 0) {
		delete roomlist[roomid];
		return 0;
	}else
		return 1;
}