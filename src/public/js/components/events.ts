let timer: number;
const touchDuration = 500;

/**
 * Sets up and dispatches a custom 'longtouch' event
 * @param target The event target on which the event will be triggered
 */
function longTouch(target: EventTarget): any {

    // Clear the timer
    window.clearTimeout(timer);

    // Create the event
    const event = new CustomEvent(
        "longtouch", {
            detail: "A long touch of more than " + touchDuration + "ms detected",
            bubbles: true
        }
    );

    // Trigger the event
    target.dispatchEvent(event);
}

/**
 * Catches a touch start to setup a timer
 * @param event The original 'touchstart' event
 */
function touchstart(event: Event) {
    const target = event.target;
    timer = window.setTimeout(() => {
        longTouch(target);
    }, touchDuration);
}

/**
 * Reset the timer if it did not ran out
 */
function touchend() {
    if (timer !== undefined) {
        window.clearTimeout(timer);
    }
}

/**
 * Reset the timer if it did not ran out
 */
function touchmove() {
    if (timer !== undefined) {
        window.clearTimeout(timer);
    }
}

/**
 * Setup event listeners on document ready
 */
$(function () {
    window.addEventListener("touchstart", touchstart);
    window.addEventListener("touchend", touchend);
    window.addEventListener("touchmove", touchmove);
});