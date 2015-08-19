/**
 * container for vast extension
 * @param   node    xml <extension> node
 */
var Extension = function(node) {

    /** data in extension */
    this.value = node.textContent;

    /** extension type */
    this.type = "";

    var attrs = node.attributes;
    for (var i = 0; i < attrs.length; i++) {
        if (attrs.item(i).nodeName == 'type') {
            this.type = attrs.item(i).nodeValue;
        }
    }

};