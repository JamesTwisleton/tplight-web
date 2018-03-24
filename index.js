// handles HTTP requests
const http = require('http')
const url = require('url')
const TPLSmartDevice = require('tplink-lightbulb');
const convert = require('color-convert');
// file stream lib
const fs = require('fs')

const lounge = '192.168.1.6'
const light = new TPLSmartDevice(lounge)

/*Turns light On
@param color: hex color string
@param transition: optional transition time in milliseconds*/
function change_color(color, transition=0) {
    var opt = {}
    var colors = convert.hex.hsl(color)
    opt.hue = colors[0]
    opt.saturation = colors[1]
    opt.brightness = colors[2]
    light.power(true,transition,opt)
    .then(status => {
        console.log(status)
  })
  .catch(err => console.error(err))             
}

function get_file(name) {
    var file = fs.readFileSync(name, 'utf8')
    return file
}

change_color('#FF00FF')
console.log('changed color')

function onRequest(request, response) {
    var path = url.parse(request.url).pathname
    console.log(path)
    if (path === '/r/') {
        change_color('#FF0000')
    } else if (path == '/g/') {
        change_color('#00FF00')
    } else if (path === '/b/') {
        change_color('#0000FF')
    }
    response.write(get_file('index.html'))
    response.end()
}

http.createServer(onRequest).listen(8000);
