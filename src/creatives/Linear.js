/**
 * vast linear creative
 */
var Linear = function(data) {

    /** duration of current linear advert */
    this.duration = 0;

    /** time in seconds to allow skip advert */
    this.skipoffset = -1;

    /** array of MediaFile */
    this.mediaFiles = [];

    /** events for tracking this creative */
    this.events = new Events();

    /** parameters for executable advert (such as VPAID) */
    this.adParameters = null;


    var _parseNode = function(node) {

        if (node.nodeType == 1) {

            switch (node.nodeName.toLowerCase()) {

                case "linear":
                    this.skipoffset = Utils.parseSkipoffset(node.attributes);
                    break;

                case "duration":
                    this.duration = Utils.parseDuration(node.textContent);
                    break;

                case "adparameters":
                    this.adParameters = node.textContent;
                    break;

                case "mediafile":
                    _addMediafile.call(this, node);
                    break;

                case "tracking":
                    for (var i = 0; i < node.attributes.length; i++) {
                        if (node.attributes.item(i).nodeName.toLowerCase() == 'event') {
                            this.events.addEvent(node.attributes.item(i).nodeValue, node.textContent);
                        }
                    }
                    break;

                case "clickthrough":
                    this.events.clickLink = node.textContent;
                    break;

                case "clicktracking":
                    this.events.addEvent("click", node.textContent);
                    break;
            }
        }


        // parse children
        var children = (node && node.childNodes) ? node.childNodes : [];
        for (var i = 0; i < children.length; i++) {
            _parseNode.call(this, children[i]);
        }
    };

    var _addMediafile = function(node) {
        this.mediaFiles.push(new MediaFile(node));
    };

    _parseNode.call(this, data);
};

Linear.prototype.merge = function(from) {

    this.duration = this.duration || from.duration;
    this.adParameters = this.adParameters || from.adParameters;
    this.skipoffset = (this.skipoffset > -1) ? this.skipoffset : from.skipoffset;

    for (var i = 0; i < from.mediaFiles.length; i++) {
        this.mediaFiles.push(from.mediaFiles[i]);
    }
};