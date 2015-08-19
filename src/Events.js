/**
 * tracker for vast advert events (impression, progress, clicks, skip, close, etc...)
 * @author @username
 */
var Events = function() {

    var _event_num = 0;

    var SimpleEvent = function() {
        var _urls = [];

        var _do_send = function(url) {
            _event_num++;
            var img = window.document.createElement("img");
            img.id = "vaster-event_image_" + _event_num;
            img.width = "1";
            img.height = "1";
            img.style.display = "none";
            img.src = url;
            document.body.appendChild(img);
        }

        this.add = function(url) {
            _urls.push(url);
        };

        this.send = function() {
            for (var i = 0; i < _urls.length; i++) {
                _do_send(_urls[i]);
            }
        };
    };

    var PercentEvent = function(percent) {
        var _urls = [];
        var _percent = percent;
        var _fired = false;

        var _do_send = function(url) {
            _event_num++;
            var img = window.document.createElement("img");
            img.id = "vaster-percentevent_image_" + _event_num;
            img.width = "1";
            img.height = "1";
            img.style.display = "none";
            img.src = url;
            document.body.appendChild(img);
        }

        this.add = function(url) {
            _urls.push(url);
        };

        this.send = function(p) {
            if (!_fired && p >= _percent) {
                for (var i = 0; i < _urls.length; i++) {
                    _do_send(_urls[i]);
                }
                _fired = true;
            }
        };
    };

    var _events = {
        "error": new SimpleEvent(),
        "impression": new SimpleEvent(),
        "creativeview": new SimpleEvent(),
        "mute": new SimpleEvent(),
        "unmute": new SimpleEvent(),
        "pause": new SimpleEvent(),
        "resume": new SimpleEvent(),
        "fullscreen": new SimpleEvent(),
        "exitfullscreen": new SimpleEvent(),
        "expand": new SimpleEvent(),
        "collapse": new SimpleEvent(),
        "click": new SimpleEvent(),
        "closelinear": new SimpleEvent(),
        "close": new SimpleEvent(),
        "skip": new SimpleEvent()
    };

    var _percentEvents = {
        "start": new PercentEvent(0),
        "firstquartile": new PercentEvent(0.25),
        "midpoint": new PercentEvent(0.5),
        "thirdquartile": new PercentEvent(0.75),
        "complete": new PercentEvent(1)
    };

    var sendEvent = function(name) {
        if (_events[name]) {
            _events[name].send();
        }
    };

    var sendProgressEvent = function(name, p) {
        if (_percentEvents[name]) {
            _percentEvents[name].send(p);
        }
    };


    /** link to navigate to when clicked */
    this.clickLink = null;

    this.addEvent = function(name, url) {
        var name = name.toLowerCase();
        if (_events[name]) {
            _events[name].add(url);
        } else if (_percentEvents[name]) {
            _percentEvents[name].add(url);
        }
    };

    /** should be send when creative is selected for play */
    this.handleSelect = function() {
        sendEvent("impression");
    };

    /** should be send when creative is ready for playing */
    this.handleLoad = function() {
        sendEvent("creativeview");
    };

    /** should be send on any advert playback progress */
    this.handleProgress = function(p) {
        for (key in _percentEvents) {
            sendProgressEvent(key, p);
        }
    };

    /** should be send when advert completed (100% of advert content are shown) */
    this.handleComplete = function() {
        for (key in _percentEvents) {
            sendProgressEvent(key, 1);
        }
    };

    this.handleMute = function() {
        sendEvent("mute");
    };

    this.handleUnmute = function() {
        sendEvent("unmute");
    };

    this.handlePause = function() {
        sendEvent("pause");
    };

    this.handleResume = function() {
        sendEvent("resume");
    };

    /** advert skipped */
    this.handleSkip = function() {
        sendEvent("skip");
    };

    this.handleVisit = function() {
        if (this.clickLink) {
            window.open(this.clickLink, "_blank");
            sendEvent("click");
        }
    };

    /** advert closed */
    this.handleClose = function() {
        sendEvent("close");
        sendEvent("closelinear");
    };

    this.handleError = function(code) {
        sendEvent("error");
    };

    this.handleFullscreen = function() {
        sendEvent("fullscreen");
    };

    this.handleFullscreen = function() {
        sendEvent("exitfullscreen");
    };

};
