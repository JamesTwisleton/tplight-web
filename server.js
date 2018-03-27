/**
 * Instance variable setup
 */
const TPLSmartDevice = require('tplink-lightbulb');
const convert = require('color-convert');
var sleep = require('system-sleep');
const bulb = '192.168.1.6'
//const bulb2 = '192.168.1.7'
const light = new TPLSmartDevice(bulb)
var mode = 0
var modeCount = 2
var transition = 1000
var cycling = false
var globalColor = '000000'

/**
 * Express server setup.
 */
'use strict';
var express = require('express');
var app = express();
app.use(express.static(`${__dirname}/public`));
app.get('/', function(req, res){
    res.send(index.html);
});
app.get('/style.css',function(req,res){ 
    res.send(style.css);
});
app.get('/client.js',function(req,res){
    res.send(client.js);
});
app.get('/jscolor.js',function(req,res){
    res.send(jscolor.js);
});
app.get('/speedup', function(req, res){
    if (transition >= 50) {
        transition -= 50
    }
    res.send(transition.toString());
});
app.get('/slowdown', function(req, res){
    if (transition <= 5000){
        transition += 50    
        res.send(transition.toString());
    }
});
app.get('/transition', function(req, res){    
    res.send(transition.toString());
});
app.get('/color', function(req, res){    
    res.send(globalColor);
});
app.get('/changetransition', function(req, res){    
    transition = req.query.transition
});

app.get('/changecolor', function(req, res){    
    change_color(req.query.color) 
});

app.get('/start', function(req, res){    
    console.log("start invoked")
    cycling=true
    mode=0 
    cycle_colors()
});
app.get('/stop', function(req, res){    
    cycling=false
    console.log("stop invoked")
});
app.get('/mode', function(req, res){    
    next_mode()
});

app.listen(3000);

/**
 * Changes light color
 * 
 * @param {*} color hex color string 
 * @param {*} transition optional transition time in milliseconds
 */
function change_color(color, transition=0) {
    globalColor = color;
    var opt = {};
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
    do{
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
    }while(cycling==true);
}

function next_mode(){
    if(mode==modeCount){
        mode=0
    }else{
        mode+=1
    }
}
