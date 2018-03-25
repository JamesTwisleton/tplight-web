// handles HTTP requests
const http = require('http')
const url = require('url')
// global.jQuery = global.$ = require('jquery')
// const bootstrap = require('bootstrap')
const TPLSmartDevice = require('tplink-lightbulb');
const convert = require('color-convert');
// system sleep function
var sleep = require('system-sleep');
// file stream lib
const fs = require('fs')

const lounge = '192.168.1.6'
const light = new TPLSmartDevice(lounge)

var mode = 0
var modeCount = 2
var transition = 1000

/*Changes light color
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

function cycle_colors() {
    while (true) {
        switch (mode) {
            case 0:
                change_color('ff0000', transition)
                sleep(transition)
                change_color('00ff00', transition)
                sleep(transition)
                change_color('0000ff', transition)
                sleep(transition)
                break
            case 1:
                change_color('0000ff', transition)
                sleep(transition)
                change_color('ffffff', transition)
                sleep(transition)
                break
            case 2:
                change_color('ffffff')
                sleep(transition)
                change_color('000000')
                sleep(transition)
                break
            }
    }
}

function get_file(name) {
    var file = fs.readFileSync(name, 'utf8')
    return file
}

function next_mode(){
    if(mode==modeCount){
        mode=0
    }else{
        mode+=1
    }
}
function onRequest(request, response) {
    var path = url.parse(request.url).pathname
    console.log(path)
    if (path === '/r/') {
        change_color('#FF0000')
    } else if (path == '/g/') {
        change_color('#00FF00')
    } else if (path === '/b/') {
        change_color('#0000FF')
    } else if (path === '/u/') {
        transition += 100
    } else if (path === '/d/') {
        if (transition > 0) {
            transition -= 100
        }
    } else if (path == '/style.css') {
        response.write(get_file('style.css'))
        response.end()
        return
    } else if (path === '/m/'){
        next_mode()
    }
    response.write(get_file('index.html'))
    response.end()
}

function changeTransition(changeAmount){

}

http.createServer(onRequest).listen(8000);
cycle_colors()
