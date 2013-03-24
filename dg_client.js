var IP = "10.12.52.223";
var socket = io.connect("http://"+IP+":8888");
var draw;
var name = "";
//var id = 0;
var content='';
var status = 0;

function onLoad() {
	draw = new Drawbox(document.getElementById('myCanvas'));
	draw.init();

	socket.on("connect", function() {
		console.log("connected..");
		socket.send("hi");
	});

	//更新新加用户
	socket.on('newuser', function(newname) {
		if(1 == status) {
			//在列表中更新
			/*var sel = document.getElementById("selectUser");
			sel.options.add(new Option(newname.newname, newname.id));*/
			//在对话框中提示
			content += "<span id='name'>"+newname.newname+"</span> 上线！<br/>";
			document.getElementById("content").innerHTML = content;

			setScroll();
		}
	});

	//有人退出的处理
	socket.on('exit2', function(exit) {
		//通知有人退出
		content += "<span id='name'>"+exit.name+"</span> 离开聊天室！<br/>";
		document.getElementById("content").innerHTML = content;

		setScroll();
		//更新用户列表
		/*var selt = document.getElementById("selectUser");
		for(var j = 0; j < selt.options.length; j++) {
			if (exit.id == selt.options[j].value) {
				selt.options.remove(j);
			}
		}*/
	});

	//断开连接
	socket.on('disconnect', function(){
		console.log('disconnected....');
		content = "错误: 已断开与服务器的连接";
		document.getElementById("content").innerHTML = content;
	});
}

function login() {
	name = document.getElementById("username").value;
	//记录登录名
	socket.emit('username', {username: name});
	document.getElementById("uname").innerHTML = "欢迎 "+name+" 加入游戏!";

	//登陆界面跳转
	document.getElementById("login").style.display = "none";
	document.getElementById("dg").style.display = "";
	status = 1;
}