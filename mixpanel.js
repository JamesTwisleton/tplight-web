'use strict';
/**
 * Imports
 */
const TPLSmartDevice = require('tplink-lightbulb');
const convert = require('color-convert');
const sleep = require('system-sleep');
const config = require('./config/config');
const express = require('express');
const app = express();

/**
 * Bulb setup
 */
const bulb = [config.colorBulbIP];
const port_no = config.portNumber;
const light = new TPLSmartDevice(bulb[0]);

/**
 * Pattern globals
*/
var cyclingOn = false;
var patternMode = 0;
var patternModeCount = 4;
var bpm = 60;
var transition = 60000 / bpm;
var fade = transition / 5;
var fadeOn = false;
var globalColor = '000000';

var colors = [
    ['ff0000', '00ff00', '0000ff','ff0000', '00ff00', '0000ff','ff0000', '00ff00'],
    ['000000', 'ff0000', '000000','ff0000', '000000', 'ff0000','000000', 'ff0000'],
    ['000000', '00ff00', '000000','00ff00', '000000', '00ff00','000000', '00ff00'],
    ['000000', '0000ff', '000000','0000ff', '000000', '0000ff','000000', '0000ff'],
];
/**
 * Express server setup.
 */
app.use(express.static(`${__dirname}/public`));
app.get('/', function (req, res) {
    res.set("Connection", "close");
    res.send(index.html);
});
app.get('/speedup', function (req, res) {
    speed_up();
    res.set("Connection", "close");
    res.send(bpm.toString());

});
app.get('/slowdown', function (req, res) {
    slow_down();
    res.set("Connection", "close");
    res.send(bpm.toString());

});
app.get('/transition', function (req, res) {
    res.set("Connection", "close");
    res.send(bpm.toString());
});
app.get('/bpm', function (req, res) {
    res.set("Connection", "close");
    res.send(bpm.toString());
});
app.get('/color', function (req, res) {
    res.set("Connection", "close");
    res.send(globalColor);
});
app.get('/changetransition', function (req, res) {
    console.log(req.query.transition)
    transition = parseInt(req.query.transition)
});
app.get('/changecolor', function (req, res) {
    console.log("color change")
    change_color(req.query.color);
    res.set("Connection", "close");
    res.send(bpm.toString());
});
app.get('/start', function (req, res) {
    console.log("start invoked")
    cyclingOn = true
    cycle_colors()
    res.set("Connection", "close");
    res.send(bpm.toString());
});
app.get('/stop', function (req, res) {
    console.log("stop invoked")
    cyclingOn = false
    res.set("Connection", "close");
    res.send(bpm.toString());
});
app.get('/mode', function (req, res) {
    next_mode()
    res.set("Connection", "close");
    res.send(bpm.toString());
});
app.get('/fadeon', function (req, res) {
    fade_on();
    res.set("Connection", "close");
    res.send(bpm.toString());
});
app.get('/fadeoff', function (req, res) {
    fade_off();
    res.set("Connection", "close");
    res.send(bpm.toString());
});
app.get('/cycling', function (req, res) {
    res.set("Connection", "close");
    res.send(cyclingOn);
});
app.get('/fading', function (req, res) {
    res.set("Connection", "close");
    res.send(fadeOn);
});
app.get('/changepattern', function (req, res) {
    patternMode = parseInt(req.query.pattern);
    console.log(patternMode);
    console.log("pattern change : " + req.query.pattern);
    res.set("Connection", "close");
    res.send(bpm.toString());
});
app.get('/colors', function (req, res) {
    var patternRequested = parseInt(req.query.pattern);
    console.log(patternRequested);
    res.set("Connection", "close");
    res.send(colors[patternRequested].toString());
});

app.listen(port_no)

function speed_up() {
    if (bpm < 200) {
        bpm = bpm + 1;
        transition = 60000 / bpm;
        fade = transition / 3;
        console.log("speed up");
    }
}

function slow_down() {
    if (bpm > 10) {
        bpm = bpm - 1;
        transition = 60000 / bpm;
        fade = transition / 3;
        console.log("slow down");
    }
}

function fade_on() {
    console.log("fade on");
    fadeOn = true;
}

function fade_off() {
    console.log("fade off");
    fadeOn = false;
}

/**
 * Changes light color
 * 
 * @param {*} color hex color string 
 * @param {*} transition optional transition time in milliseconds
 */
function change_color(color, brightness = 100, transition = 0) {
    globalColor = color;
    var opt = {};
    var colors = convert.hex.hsl(color);
    opt.hue = colors[0];
    opt.saturation = colors[1];
    opt.brightness = brightness;

    if (fadeOn == false) {
        transition = 0;
    }
    light.power(true, transition, opt)
        .then(status => {
            // just commented out so
            // I could see other output
            //console.log(status)
        })
        .catch(err => console.error(err))
        .catch(err => console.error(err))
        .catch(err => console.error(err))
}

function cycle_colors() {
    do {
        console.log("pattern mode: " + patternMode);
        switch (patternMode) {
            // whole rgb
            case 0:
                change_color(colors[0][0], 100, fade)
                sleep(transition)
                change_color(colors[0][1], 100, fade)
                sleep(transition)
                change_color(colors[0][2], 100, fade)
                sleep(transition)
                change_color(colors[0][3], 100, fade)
                sleep(transition)
                change_color(colors[0][4], 100, fade)
                sleep(transition)
                change_color(colors[0][5], 100, fade)
                sleep(transition)
                change_color(colors[0][6], 100, fade)
                sleep(transition)
                change_color(colors[0][7], 100, fade)
                sleep(transition)
                break
            // red and blue
            case 1:
                change_color(colors[1][0], 100, fade)
                sleep(transition)
                change_color(colors[1][1], 100, fade)
                sleep(transition)
                change_color(colors[1][2], 100, fade)
                sleep(transition)
                change_color(colors[1][3], 100, fade)
                sleep(transition)
                change_color(colors[1][4], 100, fade)
                sleep(transition)
                change_color(colors[1][5], 100, fade)
                sleep(transition)
                change_color(colors[1][6], 100, fade)
                sleep(transition)
                change_color(colors[1][7], 100, fade)
                sleep(transition)
                break
            // blue and white
            case 2:
                change_color(colors[2][0], 100, fade)
                sleep(transition)
                change_color(colors[2][1], 100, fade)
                sleep(transition)
                change_color(colors[2][2], 100, fade)
                sleep(transition)
                change_color(colors[2][3], 100, fade)
                sleep(transition)
                change_color(colors[2][4], 100, fade)
                sleep(transition)
                change_color(colors[2][5], 100, fade)
                sleep(transition)
                change_color(colors[2][6], 100, fade)
                sleep(transition)
                change_color(colors[2][7], 100, fade)
                sleep(transition)
                break
            // white strobe
            case 3:
                change_color(colors[3][0], 100, fade)
                sleep(transition)
                change_color(colors[3][1], 100, fade)
                sleep(transition)
                change_color(colors[3][2], 100, fade)
                sleep(transition)
                change_color(colors[3][3], 100, fade)
                sleep(transition)
                change_color(colors[3][4], 100, fade)
                sleep(transition)
                change_color(colors[3][5], 100, fade)
                sleep(transition)
                change_color(colors[3][6], 100, fade)
                sleep(transition)
                change_color(colors[3][7], 100, fade)
                sleep(transition)
                break
            case 4:
                change_color(colors[4][0], 100, fade)
                sleep(transition)
                change_color(colors[4][1], 100, fade)
                sleep(transition)
                change_color(colors[4][2], 100, fade)
                sleep(transition)
                change_color(colors[4][3], 100, fade)
                sleep(transition)
                change_color(colors[4][4], 100, fade)
                sleep(transition)
                change_color(colors[4][5], 100, fade)
                sleep(transition)
                change_color(colors[4][6], 100, fade)
                sleep(transition)
                change_color(colors[4][7], 100, fade)
                sleep(transition)
                break
            case 5:
                change_color(colors[5][0], 100, fade)
                sleep(transition)
                change_color(colors[5][1], 100, fade)
                sleep(transition)
                change_color(colors[5][2], 100, fade)
                sleep(transition)
                change_color(colors[5][3], 100, fade)
                sleep(transition)
                change_color(colors[5][4], 100, fade)
                sleep(transition)
                change_color(colors[5][5], 100, fade)
                sleep(transition)
                change_color(colors[5][6], 100, fade)
                sleep(transition)
                change_color(colors[5][7], 100, fade)
                sleep(transition)
                break
        }
    } while (cyclingOn == true);
}

// function cycle_colors() {
//     do {
//         switch (patternMode) {
//             // whole rgb
//             case 0:
//                 change_color('ff0000', 100, fade)
//                 sleep(transition)
//                 change_color('00ff00', 100, fade)
//                 sleep(transition)
//                 change_color('0000ff', 100, fade)
//                 sleep(transition)
//                 break
//             // red and blue
//             case 1:
//                 change_color('ff0000', 100, fade)
//                 sleep(transition)
//                 change_color('0000ff', 100, fade)
//                 sleep(transition)
//                 break
//             // blue and white
//             case 2:
//                 change_color('0000ff', 100, fade)
//                 sleep(transition)
//                 change_color('ffffff', 100, fade)
//                 sleep(transition)
//                 break
//             // white strobe
//             case 3:
//                 change_color('ffffff', 100, fade)
//                 sleep(transition)
//                 change_color('000000', 0, fade)
//                 sleep(transition)
//                 break
//         }
//     } while (cyclingOn == true);
// }

function next_mode() {
    patternMode = (patternMode + 1) % patternModeCount;
}

//bug where fade only works when speed up or slow down hasnt been pressed (although, over a certain BPM I think it's irrelevant)
//if bulb is white, it doesn't work. if bulb is yellow, it does