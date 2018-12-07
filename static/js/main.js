var rotation = 0,
	loopFrame,
	centerX,
	centerY,
	twoPI = Math.PI * 2;

var canvas = document.getElementById('canvas'),
	canvasContext = canvas.getContext('2d');

var vid = document.createElement('video');
var track;

var results = [];

var width, height;

var rgbData;

var socket = io.connect('http://127.0.0.1:8080');

function startwebcam2() {
	vid.setAttribute('autoplay', true);
	window.vid = vid;

	if (navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({ video: true })
			.then(function (stream) {
				vid.srcObject = stream;
				track = stream.getTracks()[0];
				setInterval(updateRGB, 300);
			})
			.catch(function (err0r) {
				console.log("Something went wrong!");
			});
	}
}

function loop() {
	loopFrame = requestAnimationFrame(loop);
	canvasContext.save();
	canvasContext.scale(-1, 1);
	canvasContext.drawImage(vid, 0, 0, width * -1, height);

	drawOnCanvas();

	//ctx.strokeRect(10, 20, 100, 200);
	//ctx.restore();
}

function drawOnCanvas() {
	canvasContext.strokeStyle = "red";
	canvasContext.lineWidth = 5;
	for (var i = 0; i < results.length; i++) {
		name = results[i][0];
		position = results[i][1];
		canvasContext.strokeRect(position[3], position[0], position[1] - position[3], position[2] - position[0]);
		canvasContext.font = "bold 30px Geogia";
		canvasContext.textAlign = "center";
		canvasContext.fillStyle = "red";
		canvasContext.fillText(name, (position[3] + (position[1] - position[3]) / 2), position[0] - 2);
	}
}

function startLoop() {
	loopFrame = loopFrame || requestAnimationFrame(loop);
}


vid.addEventListener('loadedmetadata', function () {
	width = canvas.width = vid.videoWidth;
	height = canvas.height = vid.videoHeight;
	centerX = width / 2;
	centerY = height / 2;
	startLoop();
});

function updateRGB() {
	var data = canvasContext.getImageData(0, 0, width, height).data;
	rgbData = [];
	var rows = [];
	var count = 0;
	for (var i = 0; i < data.length; i += 4) {
		if (count == width) {
			rgbData = rgbData.concat([rows.slice()]);
			rows = [];
			count = 0;
		}
		rows.push([data[i], data[i + 1], data[i + 2]]);
		count += 1;
	}
	//broadCastImage();
}

function broadCastImage() {
	//updateRGB();
	socket.emit("my broadcast event", { data: rgbData });
	return false;
}

function connect() {
	socket.on('my response', function (msg) {
		broadCastImage();
		results = msg['data'];
	});

	$('#poke').click(broadCastImage);
}

function onload() {
	startwebcam2();
	connect();
	//setInterval(updateRGB, 300);
	
	document.getElementById("loading").style.display="none";
}