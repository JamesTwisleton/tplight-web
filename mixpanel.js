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

var colors0 = config.pattern0;
var colors1 = config.pattern1;
var colors2 = config.pattern2;
var colors3 = config.pattern3;
var colors4 = config.pattern4;
var colors5 = config.pattern5;


/**
 * Pattern globals
*/
var cyclingOn = false;
var patternMode = 0;
var patternModeCount = 4;
var bpm = 60;
var transition = 60000 / bpm;
var fade = Math.round(transition / 3);
var fadeOn = false;
var globalColor = '000000';

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
    console.log("pattern change : " + req.query.pattern);
    res.set("Connection", "close");
    res.send(bpm.toString());
});
app.get('/colors', function (req, res) {
    var patternRequested = parseInt(req.query.pattern);
    console.log("pattern requested: " + patternRequested);
    res.set("Connection", "close");

    switch (patternMode) {
        case 0:
            res.send(colors0);
            break
        case 1:
            res.send(colors1);
            break
        case 2:
            res.send(colors2);
            break
        case 3:
            res.send(colors3);
            break
        case 4:
            res.send(colors4);
            break
        case 5:
            res.send(colors5);
            break

    }
});

app.listen(port_no)



function speed_up() {
    if (bpm < 200) {
        bpm = bpm + 1;
        transition = 60000 / bpm;
        fade = Math.round(transition / 3);
        console.log("speed up");
    }
}

function slow_down() {
    if (bpm > 10) {
        bpm = bpm - 1;
        transition = 60000 / bpm;
        fade = Math.round(transition / 3);
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
    }else{
        transition = fade;
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
            case 0:
                change_color(colors0.color0, 100, fade)
                console.log(fade);
                sleep(transition)
                change_color(colors0.color1, 100, fade)
                console.log(fade);
                sleep(transition)
                change_color(colors0.color2, 100, fade)
                console.log(fade);
                sleep(transition)
                change_color(colors0.color3, 100, fade)
                console.log(fade);
                sleep(transition)
                change_color(colors0.color4, 100, fade)
                console.log(fade);
                sleep(transition)
                change_color(colors0.color5, 100, fade)
                console.log(fade);
                sleep(transition)
                change_color(colors0.color6, 100, fade)
                sleep(transition)
                change_color(colors0.color7, 100, fade)
                sleep(transition)
                break
            case 1:
                change_color(colors1.color0, 100, fade)
                sleep(transition)
                change_color(colors1.color1, 100, fade)
                sleep(transition)
                change_color(colors1.color2, 100, fade)
                sleep(transition)
                change_color(colors1.color3, 100, fade)
                sleep(transition)
                change_color(colors1.color4, 100, fade)
                sleep(transition)
                change_color(colors1.color5, 100, fade)
                sleep(transition)
                change_color(colors1.color6, 100, fade)
                sleep(transition)
                change_color(colors1.color7, 100, fade)
                sleep(transition)
                break
            case 2:
                change_color(colors2.color0, 100, fade)
                sleep(transition)
                change_color(colors2.color1, 100, fade)
                sleep(transition)
                change_color(colors2.color2, 100, fade)
                sleep(transition)
                change_color(colors2.color3, 100, fade)
                sleep(transition)
                change_color(colors2.color4, 100, fade)
                sleep(transition)
                change_color(colors2.color5, 100, fade)
                sleep(transition)
                change_color(colors2.color6, 100, fade)
                sleep(transition)
                change_color(colors2.color7, 100, fade)
                sleep(transition)
                break
            case 3:
                change_color(colors3.color0, 100, fade)
                sleep(transition)
                change_color(colors3.color1, 100, fade)
                sleep(transition)
                change_color(colors3.color2, 100, fade)
                sleep(transition)
                change_color(colors3.color3, 100, fade)
                sleep(transition)
                change_color(colors3.color4, 100, fade)
                sleep(transition)
                change_color(colors3.color5, 100, fade)
                sleep(transition)
                change_color(colors3.color6, 100, fade)
                sleep(transition)
                change_color(colors3.color7, 100, fade)
                sleep(transition)
                break
            case 4:
                change_color(colors4.color0, 100, fade)
                sleep(transition)
                change_color(colors4.color1, 100, fade)
                sleep(transition)
                change_color(colors4.color2, 100, fade)
                sleep(transition)
                change_color(colors4.color3, 100, fade)
                sleep(transition)
                change_color(colors4.color4, 100, fade)
                sleep(transition)
                change_color(colors4.color5, 100, fade)
                sleep(transition)
                change_color(colors4.color6, 100, fade)
                sleep(transition)
                change_color(colors4.color7, 100, fade)
                sleep(transition)
                break
            case 5:
                change_color(colors5.color0, 100, fade)
                sleep(transition)
                change_color(colors5.color1, 100, fade)
                sleep(transition)
                change_color(colors5.color2, 100, fade)
                sleep(transition)
                change_color(colors5.color3, 100, fade)
                sleep(transition)
                change_color(colors5.color4, 100, fade)
                sleep(transition)
                change_color(colors5.color5, 100, fade)
                sleep(transition)
                change_color(colors5.color6, 100, fade)
                sleep(transition)
                change_color(colors5.color7, 100, fade)
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