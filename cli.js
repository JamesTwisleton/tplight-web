const TPLSmartDevice = require('tplink-lightbulb')
const convert = require('color-convert')
const sleep = require('system-sleep')

const bulb = ['192.168.1.6']
const light = new TPLSmartDevice(bulb[0])
const mode = process.argv[2]
const arduino = (process.argv.length == 4 && process.argv[3] == '-r')
console.log(arduino)
const transition = 10200

function change_color(hue, sat, trans=0) {
	var opt = {}

	opt.hue = hue
	opt.saturation = sat
	opt.brightness = 100
	light.power(true, trans, opt).catch(err => console.error(err))             
	console.log('t2')
}

function toggle(setting) {
	light.power(setting, 0).catch(err => console.error(err))
}

function parse() {
	if (mode == 'on') {
		toggle(true)
	} else if (mode == 'off') {
		toggle(false)
	} else if (mode == 'white' || mode == 'warm') {
		change_color(0, 0)
	} else if (mode == 'cool') {
		change_color(240, 50)
	} else if (mode == 'red') {
		change_color(0, 100)
	} else if (mode == 'green') {
		change_color(120, 100)
	} else if (mode == 'blue') {
		change_color(240, 100)
	} else if (mode == 'purple') {
		change_color(300, 100)
	} else if (mode == 'relax') {
		change_color(240, 100)
		while (true) {
			change_color(0, 100, transition)
			sleep(transition)
			change_color(240, 100, transition)
			sleep(transition)
		}
	}
}

if (arduino) {
	var SerialPort = require('serialport')
	var port = new SerialPort('COM3', {
		baudRate: 9600
	})

	port.on('open', function () {
		console.log('open')

		port.on('data', function(data) {
			console.log('data received: ' + data);
		});

		// TODO: find lower bound of this delay
		sleep(5000)
		port.write('\x31')
		parse()
	});
} else {
	parse()
	console.log('t3')
}
console.log('t4')
