//
// Variables
//

var duration = 120;
var timer;

//
// Methods
//

/**
 * State-based UI Component
 * @param {String} selector The selector for the target element
 * @param {Object} options  Component options
 */
var Rue = function (selector, options) {
    this.elem = document.querySelector(selector);
    this.data = options.data;
    this.template = options.template;
};

/**
 * Render a new UI
 */
Rue.prototype.render = function () {
    this.elem.innerHTML = this.template(this.data);
};

/**
 * Stop the timer
 */
var stopTimer = function () {
    clearInterval(timer);
};

/**
 * Countdown the timer by 1
 */
var countdown = function () {

    // Reduce the time by 1 second
    app.data.time--;

    // If timer should be stopped, stop it
    if (app.data.time < 1) {
        stopTimer();
    }

    // Update the UI
    app.render();

};

/**
 * Restart the timer
 * @param  {Event} event The Event object
 */
var restartTimer = function (event) {

    // Only run if the restart button was clicked
    if (!event.target.hasAttribute('data-restart-timer')) return;

    // Stop any current running timers
    stopTimer();

    // Reset app data
    app.data.time = duration;
    app.data.paused = false;

    // Render the initial UI
    app.render();

    // Start the countdown timer
    timer = setInterval(countdown, 1000);

};

/**
 * Start the timer
 * @param  {Event} event The Event object
 */
var startTimer = function (event) {

    // Only run if the start button was clicked
    if (!event.target.hasAttribute('data-start-timer')) return;

    // If the timer is done, restart instead
    if (app.data.time < 1) {
        restartTimer();
        return;
    }

    // Unpause the timer
    app.data.paused = false;

    // Render the initial UI
    app.render();

    // Stop any current running timers
    stopTimer();

    // Start the countdown timer
    timer = setInterval(countdown, 1000);

};

/**
 * Pause the timer
 * @param  {Event} event The Event object
 */
var pauseTimer = function (event) {

    // Only run if pause button was clicked
    if (!event.target.hasAttribute('data-pause-timer')) return;

    // Stop the countdown timer
    stopTimer();

    // Update the app data
    app.data.paused = true;

    // Render an updated UI
    app.render();

};

/**
 * Handle click events
 * @param  {Event} event The Event object
 */
var clickHandler = function (event) {
    startTimer(event);
    pauseTimer(event);
    restartTimer(event);
};

/**
 * Get the active timer HTML
 * @param  {Object} props The current component state data
 * @return {String}       The HTML string
 */
var getTimerHTML = function (props) {

    // Get the minutes and seconds
    var minutes = parseInt(props.time / 60, 10);
    var seconds = props.time % 60;

    // Create the timer HTML
    var html =
        minutes.toString() + ':' + seconds.toString().padStart(2, '0') +
        '<p>' +
            (props.paused ? '<button data-start-timer>Start</button>' : '<button data-pause-timer>Pause</button>') +
            ' <button data-restart-timer>Restart</button>' +
        '</p>';

    return html;

};

/**
 * Create the timer component
 * @param  {Object} props The component options
 */
var app = new Rue('#app', {
    data: {
        time: duration,
        paused: true
    },
    template: function (props) {

        // If the timer is done, show a button to restart it
        if (props.time < 1) {
            return '⏰ <p><button data-restart-timer>Restart Timer</button></p>';
        }

        // Otherwise, show the current time
        return getTimerHTML(props);

    }
});


//
// Inits & Events
//

app.render();
document.addEventListener('click', clickHandler);