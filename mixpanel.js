/**
 * Imports
 */
const TPLSmartDevice = require('tplink-lightbulb');
const convert = require('color-convert');
var sleep = require('system-sleep');
var config = require('./config/config');

/**
 * Bulb setup
 */
const bulb = [config.colorBulbIP];
const port_no = config.portNumber;
const light = new TPLSmartDevice(bulb[0])


/**
 * Pattern globals
 */
 // static or cycling
var cycling = false
// which pattern
var patternMode = 0
var patternModeCount = 4
var transition = 1000
var globalColor = '000000'

/**
 * Express server setup.
 */
'use strict';
var express = require('express');
var app = express();
app.use(express.static(`${__dirname}/public`));
app.get('/', function(req, res){
    res.set("Connection", "close");
    res.send(index.html);
});
app.get('/style.css',function(req,res){ 
    res.set("Connection", "close");
    res.send(style.css);
});
app.get('/client.js',function(req,res){
    res.set("Connection", "close");
    res.send(client.js);
});
app.get('/jscolor.js',function(req,res){
    res.set("Connection", "close");
    res.send(jscolor.js);
});
app.get('/speedup', function(req, res){
    if (transition >= 50) {
        transition -= 50
        console.log("speed up")
        res.set("Connection", "close");
        res.send(transition.toString());
    }
});
app.get('/slowdown', function(req, res){
    if (transition < 5000) {
        transition += 50
        res.set("Connection", "close");
        res.send(transition.toString());
    }
});
app.get('/transition', function(req, res) {
    res.set("Connection", "close");   
    res.send(transition.toString());
});
app.get('/color', function(req, res) {
    res.set("Connection", "close");
    res.send(globalColor);
});
app.get('/changetransition', function(req, res) { 
    console.log(req.query.transition)   
    transition = parseInt(req.query.transition)
});

app.get('/changecolor', function(req, res) {
    console.log("color change")
    change_color(req.query.color)
    res.set("Connection", "close");
    res.send(transition.toString());
});

app.get('/start', function(req, res) {
    console.log("start invoked")
    cycling = true
    cycle_colors()
    res.set("Connection", "close");
    res.send(transition.toString());
});
app.get('/stop', function(req, res) {
    console.log("stop invoked")
    cycling = false
    res.set("Connection", "close");
    res.send(transition.toString());
});
app.get('/mode', function(req, res) {    
    next_mode()
    res.set("Connection", "close");
    res.send(transition.toString());
});

app.listen(port_no)

/**
 * Changes light color
 * 
 * @param {*} color hex color string 
 * @param {*} transition optional transition time in milliseconds
 */
function change_color(color, brightness=100, transition=0) {
    globalColor = color;
    var opt = {};
    var colors = convert.hex.hsl(color)
    opt.hue = colors[0]
    opt.saturation = colors[1]
    opt.brightness = brightness
    light.power(true,transition,opt)
    .then(status => {
        // just commented out so
        // I could see other output
        // console.log(status)
  })
  .catch(err => console.error(err))             
}

function cycle_colors() {
    do{
        switch (patternMode) {
            // whole rgb
            case 0:
                change_color('ff0000', 100, transition)
                sleep(transition)
                change_color('00ff00', 100, transition)
                sleep(transition)
                change_color('0000ff', 100, transition)
                sleep(transition)
                break
            // red and blue
            case 1:
                change_color('ff0000', 100, transition)
                sleep(transition)
                change_color('0000ff', 100, transition)
                sleep(transition)
                break
            // blue and white
            case 2:
                change_color('0000ff', 100, transition)
                sleep(transition)
                change_color('ffffff', 100, transition)
                sleep(transition)
                break
            // white strobe
            case 3:            
                change_color('ffffff', 100, transition)
                sleep(transition)
                change_color('000000', 0, transition)
                sleep(transition)
                break
            }
    } while (cycling == true);
}

function next_mode() {
    patternMode = (patternMode + 1) % patternModeCount
}
