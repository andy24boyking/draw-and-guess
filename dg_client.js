var IP = "192.168.1.126";
var socket = io.connect("http://"+IP+":8888");
var draw;
var name = "";
var sessionid = 0;
var content="";
var roomlist = [];
var currentRoomId = 0;
var status = 0; //0：未登录，1：房间列表界面，2：游戏界面

function onLoad() {
	draw = new Drawbox(document.getElementById('myCanvas'));
	draw.init();

	socket.on("connect", function() {
		console.log("connected..");
		sessionid = socket.socket.sessionid;
	});
	socket.on("initroomlist", function(list) {
		roomlist = list;
	});
	//更新新加用户
	socket.on('newuser', function(newname) {
		if(status != 0) {
			/*content += "<span id='name'>"+newname.newname+"</span> 上线！<br/>";
			document.getElementById("content").innerHTML = content;
			setScroll();*/
		}
	});

	//有人退出的处理
	socket.on('exit2', function(exit) {
		//通知有人退出
		/*content += "<span id='name'>"+exit.name+"</span> 离开聊天室！<br/>";
		document.getElementById("content").innerHTML = content;

		setScroll();*/
	});

	//断开连接
	socket.on('disconnect', function(){
		console.log('disconnected....');
		content = "错误: 已断开与服务器的连接";
		document.getElementById("content").innerHTML = content;
	});

	//房间列表更新处理
	socket.on("roomchange", function(list) {
		roomlist = list;
		if(1 == status) {
			updateRoomlist();
		}else if(2 == status) {
			updateCurrentRoomPlayersList();
		}
	});
}

function login() {
	name = document.getElementById("username").value;
	//记录登录名
	socket.emit("username", {username: name});
	console.log(sessionid);
	document.getElementById("uname").innerHTML = "欢迎 "+name+" 加入游戏!";

	//登陆界面跳转
	document.getElementById("login").style.display = "none";
	document.getElementById("room").style.display = "";
	updateRoomlist();
	status = 1;
}

//滚动条置于聊天窗口底部
function setScroll() {
	document.getElementById("content").scrollTop = document.getElementById("content").scrollHeight;
}

//创建房间
function createRoom() {
	document.getElementById("createroom").style.display = "";
}
function ok() {
	var playNum = document.getElementById("playNum").value;
	socket.emit("createRoom", playNum);
	status = 2;
	document.getElementById("room").style.display = "none";
	document.getElementById("dg").style.display = "";
}

//更新房间列表
function updateRoomlist() {
	var text = "";
	for(var i in roomlist) {
		var count = 0;
		for(var k in roomlist[i])
			if(roomlist[i][k] != null && roomlist[i][k] != "")
				count++;
		text += "<a onclick='enterRoom("+i+","+count+")'> Room "+i+" , "+count+"/"+roomlist[i].length+"</a><br/>";
	}
	document.getElementById("list").innerHTML = text;
}

//进入房间
function enterRoom(i, count) {
	if(count == roomlist[i].length)
		alert("该房间已满！");	
	else {
		status = 2;
		socket.emit("enterroom", i);
		for(var j = 0; j < roomlist[i].length; j++) {
			if(roomlist[i][j] == null || roomlist[i][j] == "") {
				roomlist[i][j] == sessionid;
				break;
			}
		}
		currentRoomId = i;

		document.getElementById("room").style.display = "none";
		document.getElementById("dg").style.display = "";
		updateCurrentRoomPlayersList();
	}
}

//退出房间
function exitRoom() {
	socket.emit("exitroom", currentRoomId)
	status = 1;
	document.getElementById("room").style.display = "";
	document.getElementById("dg").style.display = "none";
}

//更新当前房间内用户列表
function updateCurrentRoomPlayersList() {
	var text = "";

	for(var k in roomlist[currentRoomId])
		if(roomlist[currentRoomId][k] != null && roomlist[currentRoomId][k] != "")
			text += roomlist[currentRoomId][k]+" ";
		else
			text += "null ";

	document.getElementById("currentRoomlist").innerHTML = text;
}