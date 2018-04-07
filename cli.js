const TPLSmartDevice = require('tplink-lightbulb')
const convert = require('color-convert')

const bulb = ['192.168.1.6']
const light = new TPLSmartDevice(bulb[0])
const mode = process.argv[2]

function change_color(color, transition=0) {
	var colors = convert.hex.hsl(color)
	var opt = {}

	opt.hue = colors[0]
	opt.saturation = colors[1]
	opt.brightness = 100
	light.power(true,transition,opt).catch(err => console.error(err))             
}

function off() {
	light.power(false,0).catch(err => console.error(err))
}

if (mode == 'on' || mode == 'white') {
	change_color('ffffff')
} else if (mode == 'off') {
	off()
} else if (mode == 'red' || mode == 'sexy') {
	change_color('ff0000')
} else if (mode == 'green' || mode == '420') {
	change_color('00ff00')
} else if (mode == 'blue') {
	change_color('0000ff')
} else if (mode == 'purple') {
	change_color('a020f0')
}
