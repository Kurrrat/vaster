var Utils = {

    parseDuration: function(str) {
        var mmm = 0;
        var tmp = str;
        if (str.indexOf('.') > -1) { // hh:mm:ss.mmm

            mmm = parseInt(str.split('.')[1]);
            tmp = str.split('.')[0];
        }

        var parts = tmp.split(':');
        var hh = (parts.length == 3) ? parseInt(parts[0]) : 0;
        var mm = (parts.length == 3) ? parseInt(parts[1]) : (parts.length == 2 ? parseInt(parts[0]) : 0);
        var ss = (parts.length == 3) ? parseInt(parts[2]) : (parts.length == 2 ? parseInt(parts[1]) : (parts.length == 1 ? parseInt(parts[0]) : 0));

        return hh * 60 * 60 + mm * 60 + ss + 0.001 * mmm;
    },

    parseSkipoffset: function(attrs) {
        var l = attrs.length;
        for (var i = 0; i < l; i++) {

            if (attrs.item(i).nodeName == 'skipoffset') {
                return Utils.parseDuration(attrs.item(i).nodeValue);
            }
        }
        return -1;
    }

};