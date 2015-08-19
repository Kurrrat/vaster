/**
 * creates VASTer object representing vast xml loaded from url provided
 * @param xmlPath   url to load vast xml
 * @param config    object with advert params and callbacks. Use format:
 *      {
 *          xmlPath: "http://advert.com/vast.xml",
 *          timeoutSec: 15,
 *          withCredentials: true,
 *          observer:   {
 *                          'ready': function(){},
 *                          'error': function(){}
 *                      }
 *      }
 */
var VASTer = function(config) {

    var _path = config.xmlPath || null;
    var _timeout = (config.timeoutSec || 15) * 1000;
    var _withcredentials = (typeof withCredentials == 'boolean') ? withCredentials : true;
    var _observer = config.observer;

    var _obj = null;

    var _handleRequest = function() {

        if (_req.readyState == 4 /* complete */) {

            if (_req.status == 200 || _req.status == 304) {

                if (_obj) {
                    var obj = new VastObject();
                    obj.parse(_req.responseText);
                    _obj.merge(obj);
                    _obj.isWrapper = false;
                } else {
                    _obj = new VastObject();
                    _obj.parse(_req.responseText);
                }


                if (_obj.isWrapper) {

                    _load(_obj.vastadtaguri);

                } else {
                    if (_observer && typeof(_observer.ready) === 'function') {
                        _observer.ready(_obj);
                    }
                }

            } else {

                _handleError();
            }
        }
    };

    var _handleError = function() {
        if (_observer && typeof(_observer.error) === 'function') {
            _observer.error();
        }
    };

    var _req = new XMLHttpRequest();

    var _load = function(path) {
        console.log(_req, path);
        if (_req && path) {
            _req.open('GET', path, true);
            _req.withCredentials = _withcredentials;
            _req.timeout = _timeout;
            _req.responseType = "text";
            _req.onreadystatechange = _handleRequest;
            _req.ontimeout = _handleError;
            _req.send();
        } else {
            _handleError();
        }
    };

    _load.call(this, _path);


    /** loads vpaid and plays it */
    this.playVpaid = function(creative, media, container, autoPlay) {
        var p = new VPAIDPlayer(creative, media, container, autoPlay, _observer);
    };

    this.parseTime = function(timeStr) {
        return Utils.parseDuration(timeStr);
    };
};


window.VASTer = VASTer;
