let longTouch:Function; 
let timer;
const touchDuration = 500;

function touchstart(event:Event) {
    console.log("Touch Start");
    const target = event.target;
    // event.preventDefault();
    console.log("Set Timer");
    timer = setTimeout(longTouch(target), touchDuration);
}

function touchend(event:Event) {
    event.preventDefault();
    console.log("Touch End");
    if (timer !== undefined) {
        console.log("Clear Timer", timer);
        clearTimeout(timer);
    }
}

function touchmove(event:Event) {
    console.log("Touch Move");
    if (timer !== undefined) {
        console.log("Clear Timer", timer);
        clearTimeout(timer);
    }
}

longTouch = function(target:EventTarget) {
    console.log("Long Touch Detected", target);
    // clearTimeout(timer);
    // Do something
};

$(function () {
    // window.addEventListener("touchstart", touchstart, false);
    // window.addEventListener("touchend", touchend, false);
    // window.addEventListener("touchmove", touchmove, false);
});