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
	this.timeout_draw =	0;

}
Drawbox.prototype =	{
	mousedown: function	(e)	{
		this.drawing = true;
		this.his.push({
			x: e.layerX
			, y: e.layerY

		});
	}
	, mouseup: function	(e)	{
		this.drawing = false;
		this.his.push({
			x: e.layerX
			, y: e.layerY
			//是否中止，鼠标放开时，记录状态，防止“连笔”
			, end: 1
		});
	}
	, mousemove: function (e) {
		//document.getElementById('myCanvas').style.cursor = "crosshair";
		var	_this =	this;
		if (_this.drawing) {
			//将坐标不断存入历史记录
			_this.his.push({
				x: e.layerX
				, y: e.layerY
			});
			_this.context.beginPath();
			var	l =	_this.his.length;
			if (!_this.his[l - 1].end) {
				_this.context.moveTo(_this.his[l - 2].x, _this.his[l - 2].y);
				_this.context.lineTo(_this.his[l - 1].x, _this.his[l - 1].y);
				_this.context.stroke();
			}

			//console.log(e.layerX+' '+e.layerX);
		}
	}
	, init:	function ()	{
		var	_this =	this;
		_this.canvas.addEventListener('mousemove', function	(e)	{ _this.mousemove(e) },	false);
		_this.canvas.addEventListener('mousedown', function	(e)	{ _this.mousedown(e) },	false);
		_this.canvas.addEventListener('mouseup', function (e) {	_this.mouseup(e) },	false);
	}
	//清空
	, clear: function (noClearHis) {
		var	_this =	this;
		clearTimeout(_this.timeout_draw);
		//清空
		_this.context.clearRect(0, 0, 3000,	3000);
		if (!noClearHis) {
			//清除历史记录
			_this.his.length = 0;
		}
	}
	//重绘
	/*, reDraw: function () {
		var	_this =	this;
		_this.clear(true);
		var	i =	0;
		var	length = _this.his.length;
		clearTimeout(_this.timeout_draw);
		if (length < 2)	{ return; }
		function draw()	{
			if (!_this.his[i].end) {
				_this.context.moveTo(_this.his[i].x, _this.his[i].y);
				_this.context.lineTo(_this.his[i + 1].x, _this.his[i + 1].y);
				_this.context.stroke();
			}
			_this.timeout_draw = setTimeout(function ()	{
				if (i <	length - 1)	{
					draw();
				}
			}, 10);
			++i;
		}
		draw();
	}*/
};

var draw;

function onLoad() {
	draw = new Drawbox(document.getElementById('myCanvas'));
	draw.init();
}