const TPLSmartDevice = require('tplink-lightbulb')
const convert = require('color-convert')

const bulb = ['192.168.1.6']
const light = new TPLSmartDevice(bulb[0])
const mode = process.argv[2]

function change_color(hue, sat) {
	var opt = {}

	opt.hue = hue
	opt.saturation = sat
	opt.brightness = 100
	light.power(true, 0, opt).catch(err => console.error(err))             
}

function set(setting) {
	light.power(setting, 0).catch(err => console.error(err))
}

if (mode == 'on') {
	set(true)
} else if (mode == 'off') {
	set(false)
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
}
