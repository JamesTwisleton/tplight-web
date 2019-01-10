'use strict';
/**
 * Imports
 */
const TPLSmartDevice = require('tplink-lightbulb');
const convert = require('color-convert');
const sleep = require('system-sleep');
const config = require('./config/config');
var app = require('express')();
const express = require('express');
var server = require('http').Server(app);
var io = require('socket.io')(server);

/**
 * Globals
*/
const bulb = [config.colorBulbIP];
const port_no = config.portNumber;
const light = new TPLSmartDevice(bulb[0]);
var patterns = config.patterns;
var cyclingOn = false;
var fadeOn = false;
var currentPattern = 0;
var bpm = 60;
var transition = 60000 / bpm;
var fadeRatio = config.fadeRatio;
var fade = Math.round(transition / fadeRatio);
var bpmMin = config.bpmMin;
var bpmMax = config.bpmMax;

/**
 * Express server and socket setup.
 */
server.listen(port_no);
app.use(express.static(`${__dirname}/public`));
io.on('connection', function (socket) {
    socket.emit('init', {
        cycling: cyclingOn,
        fade: fadeOn,
        currentPattern: currentPattern,
        bpm: bpm,
        patterns: patterns
    });
    socket.on('speedup', function (data) {
        speed_up();
    });
    socket.on('slowdown', function (data) {
        slow_down();
    });
    socket.on('cyclingon', function (data) {
        cyclingOn = true;
        cycle();
    });
    socket.on('cyclingoff', function (data) {
        cyclingOn = false;
    });
    socket.on('fadeon', function (data) {
        fade_on();
    });
    socket.on('fadeoff', function (data) {
        fade_off();
    });
    socket.on('changepattern', function (data) {
        console.log(data);
    });
});

function speed_up() {
    if (bpm < bpmMax) {
        bpm = bpm + 5;
        transition = 60000 / bpm;
        fade = Math.round(transition / fadeRatio);
        console.log("Speeding up to " + bpm + " bpm.");
        io.sockets.emit('bpmUpdate', bpm);
    }

}

function slow_down() {
    if (bpm > bpmMin) {
        bpm = bpm - 5;
        transition = 60000 / bpm;
        fade = Math.round(transition / fadeRatio);
        console.log("Slowing down to " + bpm + " bpm.");    
        io.sockets.emit('bpmUpdate', bpm);

    }
    
}

function fade_on() {
    console.log("Turning fade on.");
    fadeOn = true;
}

function fade_off() {
    console.log("Turning fade off.");
    fadeOn = false;
}

function cycle() {
    do {
        run_pattern(currentPattern);
    } while (cyclingOn == true);
}

function run_pattern(pattern) {
    for (i = 0; i < 8; i++) {
        change_color(patterns[pattern][i]);
        sleep(transition);
    }
}

/**
 * Changes light color
 * 
 * @param {*} color hex color string 
 * @param {*} transition optional transition time in milliseconds
 */
function change_color(color, brightness = 100, transition = 0) {
    var opt = {};
    var colors = convert.hex.hsl(color);
    opt.hue = colors[0];
    opt.saturation = colors[1];
    opt.brightness = brightness;

    if (fadeOn == false) {
        transition = 0;
    } else {
        transition = fade;
    }
    light.power(true, transition, opt)
        .then(status => {
            //console.log(status)
        })
        .catch(err => console.error(err))
}
