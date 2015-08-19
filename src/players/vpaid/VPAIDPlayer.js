/**
 * player for VPAID ad
 */
var VPAIDPlayer = function(creative, media, container, autoPlay, observer) {

    if (!container || !creative || !media) return;

    var autoPlay = autoPlay || false;
    var numTries = 0;

    iframe = document.createElement('iframe');
    iframe.id = "adloaderframe";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    container.appendChild(iframe);

    iframe.contentWindow.document.write('<div id="adholder" style="width:100%;height:auto;padding:0!important;margin:0!important;overflow:hidden;" />');
    iframe.contentWindow.document.write('<script sync="true" src="' + media.file + '"></scr' + 'ipt>');

    var startAdvert = function() {

        var fn = iframe.contentWindow['getVPAIDAd'];
        console.log("getVPAIDAd", fn);

        if (fn && typeof fn == 'function') {
            var VPAIDCreative = fn();

            var _wrapper = new VPAIDWrapper(VPAIDCreative, observer);
            var creativeData = {
                AdParameters: creative.adParameters
            };
            var holder = iframe.contentWindow.document.getElementById("adholder");
            var environmentVars = {
                slot: holder,
                videoSlotCanAutoPlay: autoPlay
            };
            var v = iframe.contentWindow.document.createElement('video');
            v.id = "advideo";
            v.style.width = "100%";
            v.style.height = "auto";
            v.style.margin = "0px auto";
            v.style.padding = "0px";
            holder.appendChild(v);
            environmentVars.videoSlot = v;

            _wrapper.initAd(container.clientWidth, container.clientHeight, "normal", 0, creativeData, environmentVars);

        } else if (numTries < 5) {
            numTries++;
            setTimeout(startAdvert, 100);
        } else {
            // TODO: call error
        }
    };
    startAdvert();
};
