/**
 * The amount of time the lights take to change from one color to another in milliseconds.
 */
var transition;

/**
 * Asks the server to speed up the current cycle, sets relevant HTML elements
 * to match new transition speed.
 */
function speedUp(){
    var req = new XMLHttpRequest();            
    req.onreadystatechange = function() { 
        if (req.readyState == 4 && req.status == 200){
            transitionReadout = document.getElementById("transitionReadout");
            transitionReadout.value = req.responseText;
            getTransition();
        }
    }
    req.open("GET","/speedup",true);
    req.send(null);
}

/**
 * Asks the server to slow down the current cycle, sets relevant HTML elements
 * to match new transition speed.
 */
function slowDown(){
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() { 
        if (req.readyState == 4 && req.status == 200){
            transitionReadout = document.getElementById("transitionReadout");
            transitionReadout.value = req.responseText;
            getTransition();
        }
    }
    req.open("GET","/slowdown",true);
    req.send(null);     
}

/**
 * Asks the server to change the speed of the current cycle to match the slider, 
 * sets relevant HTML elements to match new transition speed.
 */
function changeTransition(){
    var lastClick = 0;
    var delay = 500;
    if (lastClick >= (Date.now() - delay)){
        return
    }    
    lastClick = Date.now();

    transitionSlider = document.getElementById("transitionSlider");
    var req = new XMLHttpRequest();
    sliderToTransition=5000-transitionSlider.value;
    req.open("GET","/changetransition?transition="+sliderToTransition,true);
    req.send(null);
    getTransition();
}

/**
 * Sets the transition slider and readout to match the server value, returns transition value.
 */
function getTransition(){
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() { 
        if (req.readyState == 4 && req.status == 200){
            transition = req.responseText;
            transitionSlider = document.getElementById("transitionSlider");
            transitionSlider.value = 5000-transition;
            transitionReadout = document.getElementById("transitionReadout");
            transitionReadout.value = transition;
        }
    }
    req.open("GET","/transition",true);
    req.send(null);
    return transition;
}

/**
 * Starts cycle
 */
function start(){
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() { 
        if (req.readyState == 4 && req.status == 200){
            transitionReadout = document.getElementById("transitionReadout");
            transitionReadout.value = req.responseText;
            getTransition();
        }
    }
    req.open("GET","/start",true);
    req.send(null);     
}

/**
 * Stops cycle
 */
function stop(){
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() { 
        if (req.readyState == 4 && req.status == 200){
            transitionReadout = document.getElementById("transitionReadout");
            transitionReadout.value = req.responseText;
            getTransition();
        }
    }
    req.open("GET","/stop",true);
    req.send(null);     
}

/**
 * Sets transition from server on page load, sets a timer to refresh the transition
 * every 10 seconds from the server.
 */
window.onload = function(){ 
    transition = getTransition();
    /*Refresh slider every 10 seconds*/
    setInterval(function () {
    transition = getTransition();
    }, 10000);
}


var state = 'stop';

function buttonPlayPress() {
    var buttonIcon = document.getElementById("buttonIcon");
    if(state=='stop'){
      state='play';
      buttonIcon.className = "glyphicon glyphicon-pause";
      start();
      console.log("start invoked")
    }
    else if(state=='play'){
      state = 'stop';
      buttonIcon.className = "glyphicon glyphicon-play";
      stop();
      console.log("stop invoked")
    }
}