let timer;
const touchDuration = 500;

function longTouch(target:EventTarget):any {

    window.clearTimeout(timer);

    // Create the event
    const event = new CustomEvent(
        "longtouch",
        {
            detail: "A long touch of more than " + touchDuration + " detected",
            bubbles: true
        }
    );
    
    // Trigger the event
    target.dispatchEvent(event);
}

function touchstart(event:Event) {
    const target = event.target;
    timer = window.setTimeout(() => {
        longTouch(target);
    }, touchDuration);
}

function touchend() {
    if (timer !== undefined) {
        window.clearTimeout(timer);
    }
}

function touchmove() {
    if (timer !== undefined) {
        window.clearTimeout(timer);
    }
}

$(function () {
    window.addEventListener("touchstart", touchstart);
    window.addEventListener("touchend", touchend);
    window.addEventListener("touchmove", touchmove);
});