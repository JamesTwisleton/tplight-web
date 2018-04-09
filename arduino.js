var SerialPort = require('serialport')
var sleep = require('system-sleep');

var port = new SerialPort('COM3', {
	baudRate: 9600
})

port.on("open", function () {
	console.log("open")

	port.on("data", function(data) {
		console.log("data received: " + data);
	});

	sleep(5000)
	port.write('\x31')
});
