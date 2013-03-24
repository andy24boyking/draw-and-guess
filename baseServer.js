var http = require("http"), 
    fs = require("fs"), 
    path = require("path"), 
    url = require("url"),
    os = require('os');
var ifaces = os.networkInterfaces();
var IP = "";

//获取本机IP地址
for (var dev in ifaces) {
	ifaces[dev].forEach(function(details) {
		if (details.family == 'IPv4' && details.address != '127.0.0.1') {
			IP = details.address;
		}
	});
}

//创建http服务器，并确立文件映射
function start() {
	var server = http.createServer(function(req, res) {
		var pathname = url.parse(req.url).pathname;

		var filepath = path.join("./", pathname);

		console.log("pathname: "+pathname);
		console.log("filepath: "+filepath);

		var stream = fs.createReadStream(filepath, {flags : "r", encoding : null}); 
		stream.on("error", function() { 
			res.writeHead(404); 
			res.end(); 
		}); 
		stream.pipe(res); 
	}); 
	server.on("error", function(error) {
		console.log(error);
	});
	server.listen(8888, IP);

	console.log("Http server has started.");

	return server; //这是重点！！！你都不返回，别人用个毛啊
}

exports.start = start;
exports.IP = IP;
