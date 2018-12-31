/**
 * The amount of time the lights take to change from one color to another in milliseconds.
 */
var transition;

var bpm;

/**
 * For the play/pause button.
 */
var state = 'stop';

var patternMode = 0;

var cycling = false;
/**
 * Sets fade to on or off
 */
var fade = false;

/**
 * Asks the server to speed up the current cycle, sets relevant HTML elements
 * to match new transition speed.
 */
function speedUp() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            bpm = document.getElementById("bpmReadout");
            bpm.value = req.responseText;
            getBpm();
        }
    }
    req.open("GET", "/speedup", true);
    req.send(null);
}

/**
 * Asks the server to slow down the current cycle, sets relevant HTML elements
 * to match new transition speed.
 */
function slowDown() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            bpm = document.getElementById("bpmReadout");
            bpm.value = req.responseText;
            getBpm();
        }
    }
    req.open("GET", "/slowdown", true);
    req.send(null);
}

/**
 * Asks the server to change the speed of the current cycle to match the slider, 
 * sets relevant HTML elements to match new transition speed.
 */
function changeTransition() {
    var lastClick = 0;
    var delay = 50;
    if (lastClick >= (Date.now() - delay)) {
        return
    }
    lastClick = Date.now();

    transitionSlider = document.getElementById("transitionSlider");
    var req = new XMLHttpRequest();
    sliderToTransition = 5000 - transitionSlider.value;
    req.open("GET", "/changetransition?transition=" + sliderToTransition, true);
    req.send(null);
    getBpm();
}

function changeColor() {
    var lastClick = 0;
    var delay = 50;
    if (lastClick >= (Date.now() - delay)) {
        return
    }
    lastClick = Date.now();

    colorvalue = document.getElementById("colorvalue");
    var req = new XMLHttpRequest();
    req.open("GET", "/changecolor?color=" + colorValue.value, true);
    req.send(null);
    getColor();
}

/**
 * Sets the bpm readout to match the server value, returns transition value.
 */
function getBpm() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            bpm = req.responseText;
            bpmReadout = document.getElementById("bpmReadout");
            bpmReadout.value = bpm;
        }
    }
    req.open("GET", "/bpm", true);
    req.send(null);
    //return bpm;
}

/**
 * Sets the transition slider and readout to match the server value, returns transition value.
 */
function getTransition() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            transition = req.responseText;
            transitionSlider = document.getElementById("transitionSlider");
            transitionSlider.value = 5000 - transition;
            transitionReadout = document.getElementById("transitionReadout");
            //transitionReadout.value = transition;
        }
    }
    req.open("GET", "/transition", true);
    req.send(null);
    return transition;
}

function getColor() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            document.getElementById('colorValue').jscolor.fromString(req.responseText);
        }
    }
    req.open("GET", "/color", true);
    req.send(null);
}

function getColors(pattern) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var colors = req.responseText;
            var arr = colors.split(',');

            document.getElementById('colorValue0').jscolor.fromString(arr[0]);
            document.getElementById('colorValue1').jscolor.fromString(arr[1]);
            document.getElementById('colorValue2').jscolor.fromString(arr[2]);
            document.getElementById('colorValue3').jscolor.fromString(arr[3]);
            document.getElementById('colorValue4').jscolor.fromString(arr[4]);
            document.getElementById('colorValue5').jscolor.fromString(arr[5]);
            document.getElementById('colorValue6').jscolor.fromString(arr[6]);
            document.getElementById('colorValue7').jscolor.fromString(arr[7]);
        }
    }
    req.open("GET", "/colors?pattern="+pattern, true);
    req.send(null);
}

/**
 * Starts cycle
 */
function start() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            getBpm();
            getColor();
        }
    }
    req.open("GET", "/start", true);
    req.send(null);
}

/**
 * Stops cycle
 */
function stop() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            getBpm();
            getColor();
        }
    }
    req.open("GET", "/stop", true);
    req.send(null);
}

/**
 * Changes to next mode
 */
function nextMode() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            transitionReadout = document.getElementById("transitionReadout");
            transitionReadout.value = req.responseText;
            getBpm();
        }
    }
    req.open("GET", "/mode", true);
    req.send(null);
}



/**
 * Turns on fade
 */
function fadeOn() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            getBpm();
        }
    }
    req.open("GET", "/fadeon", true);
    req.send(null);
}


/**
 * Turns off fade
 */
function fadeOff() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            getBpm();
        }
    }
    req.open("GET", "/fadeoff", true);
    req.send(null);
}



function getToggles() {


    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log("cycling:"+req.responseText);
            if(req.responseText==true){
                $('#toggle-cycling').prop('checked', false).change();
            }else{
                $('#toggle-cycling').prop('checked', true).change();
            }
        }
    }
    req.open("GET", "/cycling", true);
    req.send(null);

    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log("fading:" + req.responseText);
            if(req.responseText==true){
                $('#toggle-fade').prop('checked', false).change();
            }else{
                $('#toggle-fade').prop('checked', true).change();
            }
        }
    }
    req.open("GET", "/fading", true);
    req.send(null);
}

function changePattern(pattern) {
    patternMode = pattern;  
    getColors(pattern);
    var req = new XMLHttpRequest();
    req.open("GET", "/changepattern?pattern=" + pattern, true);
    req.send(null);
    
}

/**
 * Sets transition from server on page load, sets a timer to refresh the transition
 * every 5 seconds from the server.
 */
window.onload = function () {
    getColors(0);
    getBpm();
    getColor();
    //getToggles();

    /*Refresh slider every 5 seconds*/
    setInterval(function () {
        getColors(pattern);
        getBpm();
        getColor();
        //getToggles();
    }, 5000);
}

function buttonPlayPress() {
    // var buttonIcon = document.getElementById("buttonIcon");
    if (state == 'stop') {
        state = 'play';
        //buttonIcon.className = "glyphicon glyphicon-pause";
        start();
        console.log("start invoked")
    }
    else if (state == 'play') {
        state = 'stop';
        //buttonIcon.className = "glyphicon glyphicon-play";
        stop();
        console.log("stop invoked")
    }
}

function buttonFadePress() {
    var fadeButton = document.getElementById("fadeButton");
    if (fade == false) {
        fadeOn();
    }
    else if (fade == true) {

        fadeOff();
    }
}

$(function () {
    $('#toggle-cycling').change(function () {
            buttonPlayPress();
    })
})

$(function () {
    $('#toggle-fade').change(function () {
            buttonFadePress();
    })
})
