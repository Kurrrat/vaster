/**
 * structure/parser for vast xml
 */
var VastObject = function() {

    /** list of possible advert creatives */
    this.creatives = [];

    /** array of extensions */
    this.extensions = [];

    /** impression links if any */
    this.impressions = [];

    /** error links if any */
    this.errors = [];

    /** does this object represents wrapper ad or inline */
    this.isWrapper = false;

    /** uri of ad tag of downstream secondary ad server */
    this.vastadtaguri = null;

    /**
     * parse vast xml
     * @param xmlText           text to parse
     * @param followWrapper     follow wrapper link or no
     */
    this.parse = function(xmlText, followWrapper) {

        if (window.DOMParser) {

            parser = new DOMParser();
            xmlDoc = parser.parseFromString(xmlText, "text/xml");

        } else /* code for IE */ {

            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(xmlText);
        }

        _parseNode.call(this, xmlDoc);
    };

    /** merge another vastObject to this one (allows to add wrapped data) */
    this.merge = function(from) {
        // merge creatives
        var l = (this.creatives.length <= from.creatives.length) ? this.creatives.length : from.creatives.length;
        for (var i = 0; i < l; i++) {
            this.creatives[i].merge(from.creatives[i]);
        }

        // merge extensions
        for (var i = 0; i < from.extensions.length; i++) {
            this.extensions.push(from.extensions[i]);
        }

        // merge impressions
        for (var i = 0; i < from.impressions.length; i++) {
            this.impressions.push(from.impressions[i]);
        }

        // merge errors
        for (var i = 0; i < from.errors.length; i++) {
            this.errors.push(from.errors[i]);
        }

        this.vastadtaguri = null;
    };

    /////////////////////////////////////////////////////////////////////////////////////

    var _parseNode = function(node) {

        if (node.nodeType == 1) {

            switch (node.nodeName.toLowerCase()) {

                case "error":
                    this.errors.push(node.textContent);
                    break;

                case "impression":
                    this.impressions.push(node.textContent);
                    break;

                case "linear":
                    _parseLinear.call(this, node);
                    break;

                case "wrapper":
                    this.isWrapper = true;
                    break;

                case "vastadtaguri":
                    this.vastadtaguri = node.textContent;
                    break;

                case "extension":
                    this.extensions.push(new Extension(node));
                    break;
            }
        }


        // parse children
        var children = (node && node.childNodes) ? node.childNodes : [];
        for (var i = 0; i < children.length; i++) {
            _parseNode.call(this, children[i]);
        }
    };

    var _parseLinear = function(node) {
        var linear = new Linear(node);
        for (var i = 0; i < this.impressions.length; i++) {
            linear.events.addEvent("impression", this.impressions[i]);
        }
        for (var i = 0; i < this.errors.length; i++) {
            linear.events.addEvent("error", this.errors[i]);
        }
        this.creatives.push(linear);
    };

};
