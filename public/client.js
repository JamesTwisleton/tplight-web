/**
 * Globals
 */
var bpm = 0;
var currentPattern = 0;
var cycling = false;
var fade = false;
var patterns = [];
var socket;

/**
 * Sets parameters from server on page load and initializes socket listeners.
 */
window.onload = function () {
    bpmReadout = document.getElementById("bpmReadout");
    bpmReadout.value = "?";
    socket = io.connect('http://192.168.1.15');
    socket.on('init', function (data) {
        initElements(data);
    });
    socket.on('bpmUpdate', function (data) {
        setBpm(data);
    });
    socket.on('cyclingupdate', function (data) {
        setCycling(data);
    });
    socket.on('fadeUpdate', function (data) {
        setFade(data);
    });
    socket.on('patternupdate', function (data) {
        setPattern(data);
        setColorsView(data);
        setActivePatternButton();
    });
}

function initElements(serverValues) {
    bpm = serverValues.bpm;
    cycling = serverValues.cycling;
    fade = serverValues.fade;
    patterns = serverValues.patterns;
    currentPattern = serverValues.currentPattern;
    setBpmView(bpm);
    setColorsView(currentPattern);
    setCyclingToggle(cycling);
    setFadeToggle(fade);
}

function setBpmView(bpm) {
    bpmReadout = document.getElementById("bpmReadout");
    bpmReadout.value = bpm;
}

function setColorsView(pattern) {
    for (i = 0; i < 8; i++) {
        document.getElementById('colorValue' + i).jscolor.fromString(patterns[pattern][i]);
    }
}

/** Doesn't work */
function setActivePatternButton() {
    var btnContainer = document.getElementById("patternButtons");

    var btns = btnContainer.getElementsByClassName("btn");

    // Loop through the buttons and add the active class to the current/clicked button
    for (var i = 0; i < btns.length; i++) {
        var oldActive = document.getElementsByClassName("active");
        oldActive.className = oldActive.className.replace(" active", "");
        buttonToChange = document.getElementsById("pattern" + currentPattern);
        buttonToChange.className += " active";
    };
}


function setCyclingToggle(state) {
    if (state == false) {
        $('#toggle-cycling').bootstrapToggle('off');
    } else {
        $('#toggle-cycling').bootstrapToggle('on');
    }
}

function setFadeToggle(state) {
    if (state == false) {
        $('#toggle-fade').bootstrapToggle('off');
    } else {
        $('#toggle-fade').bootstrapToggle('on');
    }
}

function setBpm(bpmUpdate) {
    bpm = bpmUpdate;
    setBpmView(bpm);
}

function setPattern(patternUpdate) {
    currentPattern = patternUpdate;
}

function speedUp() {
    socket.emit('speedup');
}

function slowDown() {
    socket.emit('slowdown');
}

function cyclingOn() {
    socket.emit('cyclingon');
}

function cyclingOff() {
    socket.emit('cyclingoff');
}

function fadeOn() {
    socket.emit('fadeon');
}

function fadeOff() {
    socket.emit('fadeoff');
}

function changePattern(pattern) {
    socket.emit('changepattern', pattern);
    setColorsView(pattern);
}


