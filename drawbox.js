//绘图板
function Drawbox(canvas) {
	this.canvas	= canvas;
	this.context = this.canvas.getContext("2d");
	//线条宽度
	this.context.lineWidth = 2;
	//线条颜色
	this.context.strokeStyle = 'black';
	//线条圆角
	this.context.lineCap = "round";
	//状态
	this.drawing = false;
	//历史记录
	this.his = [];
}

Drawbox.prototype =	{
	mousedown: function	(e)	{
		var _this = this;

		_this.drawing = true;
		_this.his.push({
			x: e.offsetX
			, y: e.offsetY

		});
	}
	, mouseup: function	(e)	{
		var _this = this;

		_this.drawing = false;
		_this.his.push({
			x: e.offsetX
			, y: e.offsetY
			, end: 1
		});
		_this.his.length = 0;
	}
	, mousemove: function (e) {
		var	_this =	this;
		if (_this.drawing) {
			//将坐标不断存入历史记录
			_this.his.push({
				x: e.offsetX
				, y: e.offsetY
			});
			socket.emit("his", {his: _this.his});
			_this.context.beginPath();
			var	l =	_this.his.length;
			if (!_this.his[l - 1].end) {
				_this.context.moveTo(_this.his[l - 2].x, _this.his[l - 2].y);
				_this.context.lineTo(_this.his[l - 1].x, _this.his[l - 1].y);
				_this.context.stroke();
			}
		}
	}
	, init:	function ()	{
		var	_this =	this;
		_this.canvas.addEventListener('mousemove', function	(e)	{ _this.mousemove(e) },	false);
		_this.canvas.addEventListener('mousedown', function	(e)	{ _this.mousedown(e) },	false);
		_this.canvas.addEventListener('mouseup', function (e) {	_this.mouseup(e) },	false);

		socket.on("toDraw", function(data) {
			_this.context.beginPath();
			var	l =	data.his.length;
			if (!data.his[l - 1].end) {
				_this.context.moveTo(data.his[l - 2].x, data.his[l - 2].y);
				_this.context.lineTo(data.his[l - 1].x, data.his[l - 1].y);
				_this.context.stroke();
			}
		});

		socket.on("clearAll", function(data){
			draw.clear();
		});
	}
	//清空
	, clear: function () {
		var	_this =	this;
		//清空
		_this.context.clearRect(0, 0, 600, 400);
		//清除历史记录
		_this.his.length = 0;
	}
	, clearAll: function() {
		var id = 0;
		socket.emit("clear", {id: id});
	}
	//设置线条颜色
	, setColor: function (color) {
		var _this = this;
		_this.context.strokeStyle = color;
	}
	//设置线条宽度
	, setLineWidth: function (lwidth) {
		var _this = this;
		_this.context.lineWidth = lwidth;
	}
};