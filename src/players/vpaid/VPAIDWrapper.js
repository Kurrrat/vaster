/**
 *
 */
var VPAIDWrapper = function(VPAIDCreative, observer) {
    this._observer = observer;

    this.checkVPAIDInterface = function(VPAIDCreative) {
        if (VPAIDCreative.handshakeVersion &&
            typeof VPAIDCreative.handshakeVersion == "function" && VPAIDCreative.initAd &&
            typeof VPAIDCreative.initAd == "function" &&
            VPAIDCreative.startAd && typeof VPAIDCreative.startAd == "function" &&
            VPAIDCreative.stopAd && typeof VPAIDCreative.stopAd == "function" &&
            VPAIDCreative.skipAd && typeof VPAIDCreative.skipAd == "function" &&
            VPAIDCreative.resizeAd && typeof VPAIDCreative.resizeAd == "function" &&
            VPAIDCreative.pauseAd && typeof VPAIDCreative.pauseAd == "function" &&
            VPAIDCreative.resumeAd && typeof VPAIDCreative.resumeAd == "function" &&
            VPAIDCreative.expandAd && typeof VPAIDCreative.expandAd == "function" &&
            VPAIDCreative.collapseAd && typeof VPAIDCreative.collapseAd == "function" &&
            VPAIDCreative.subscribe && typeof VPAIDCreative.subscribe == "function" &&
            VPAIDCreative.unsubscribe && typeof VPAIDCreative.unsubscribe == "function" ) {

            console.log("good VPAID interface", VPAIDCreative);
            return true;
        }
        console.log("wrong VPAID interface", VPAIDCreative);
        return false;
    };


    this._creative = VPAIDCreative;
    if(!this.checkVPAIDInterface(VPAIDCreative)) {
        //The VPAIDCreative doesn't conform to the VPAID spec
        return;
    }

    this.setCallbacksForCreative();
};

VPAIDWrapper.prototype.setCallbacksForCreative = function() {

    var callbacks = {
        AdStarted : this.onStartAd,
        AdStopped : this.onStopAd,
        AdSkipped : this.onSkipAd,
        AdLoaded : this.onAdLoaded,
        AdLinearChange : this.onAdLinearChange,
        AdSizeChange : this.onAdSizeChange,
        AdExpandedChange : this.onAdExpandedChange,
        AdSkippableStateChange : this.onAdSkippableStateChange,
        AdDurationChange : this.onAdDurationChange,
        AdRemainingTimeChange : this.onAdRemainingTimeChange,
        AdVolumeChange : this.onAdVolumeChange,
        AdImpression : this.onAdImpression,
        AdClickThru : this.onAdClickThru,
        AdInteraction : this.onAdInteraction,
        AdVideoStart : this.onAdVideoStart,
        AdVideoFirstQuartile : this.onAdVideoFirstQuartile,
        AdVideoMidpoint : this.onAdVideoMidpoint,
        AdVideoThirdQuartile : this.onAdVideoThirdQuartile,
        AdVideoComplete : this.onAdVideoComplete,
        AdUserAcceptInvitation : this.onAdUserAcceptInvitation,
        AdUserMinimize : this.onAdUserMinimize,
        AdUserClose : this.onAdUserClose,
        AdPaused : this.onAdPaused,
        AdPlaying : this.onAdPlaying,
        AdError : this.onAdError,
        AdLog : this.onAdLog
    };

    // Looping through the object and registering each of the callbacks with the creative
    for (var eventName in callbacks) {
        this._creative.subscribe(callbacks[eventName], eventName, this);
    }
};

// Pass through for initAd - when the video player wants to call the ad
VPAIDWrapper.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
    console.log("initAd", width, height, viewMode, desiredBitrate, creativeData, environmentVars);
    this._creative.initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars);
};


// Callback for AdPaused
VPAIDWrapper.prototype.onAdPaused = function() {
    console.log("onAdPaused");
    this.notify("paused");
};

// Callback for AdPlaying
VPAIDWrapper.prototype.onAdPlaying = function() {
    console.log("onAdPlaying");
    this.notify("playing");
};

// Callback for AdError
VPAIDWrapper.prototype.onAdError = function(message) {
    console.log("onAdError", message);
    this.notify("error");
};

// Callback for AdLog
VPAIDWrapper.prototype.onAdLog = function(message) {
    console.log("onAdLog", message);
};

// Callback for AdUserAcceptInvitation
VPAIDWrapper.prototype.onAdUserAcceptInvitation = function() {
    console.log("onAdUserAcceptInvitation");
};

// Callback for AdUserMinimize
VPAIDWrapper.prototype.onAdUserMinimize = function() {
    console.log("onAdUserAcceptInvitation");
};

// Callback for AdUserClose
VPAIDWrapper.prototype.onAdUserClose = function() {
    console.log("onAdUserClose");
    this.notify("close");
};

// Callback for AdUserClose
VPAIDWrapper.prototype.onAdSkippableStateChange = function() {
    console.log("Ad Skippable State Changed to: " + this._creative.getAdSkippableState());
};

// Callback for AdUserClose
VPAIDWrapper.prototype.onAdExpandedChange = function() {
    console.log("Ad Expanded Changed to: " + this._creative.getAdExpanded());
};

// Pass through for getAdExpanded
VPAIDWrapper.prototype.getAdExpanded = function() {
    return this._creative.getAdExpanded();
};

// Pass through for getAdSkippableState
VPAIDWrapper.prototype.getAdSkippableState = function() {
    return this._creative.getAdSkippableState();
};

// Callback for AdSizeChange
VPAIDWrapper.prototype.onAdSizeChange = function() {
    console.log("Ad size changed to: w=" + this._creative.getAdWidth() + ", h=" + this._creative.getAdHeight());
};

// Callback for AdDurationChange
VPAIDWrapper.prototype.onAdDurationChange = function() {
    console.log("Ad Duration Changed to: " + this._creative.getAdDuration());
};

// Callback for AdRemainingTimeChange
VPAIDWrapper.prototype.onAdRemainingTimeChange = function() {
    console.log("Ad Remaining Time Changed to: " + this._creative.getAdRemainingTime());
};

// Pass through for getAdRemainingTime
VPAIDWrapper.prototype.getAdRemainingTime = function() {
    console.log("getAdRemainingTime");
    return this._creative.getAdRemainingTime();
};

// Callback for AdImpression
VPAIDWrapper.prototype.onAdImpression = function() {
    console.log("Ad Impression");
};

// Callback for AdClickThru
VPAIDWrapper.prototype.onAdClickThru = function(url, id, playerHandles) {
    console.log("Clickthrough portion of the ad was clicked");
    this.notify("click");
};

// Callback for AdInteraction
VPAIDWrapper.prototype.onAdInteraction = function(id) {
    console.log("A non-clickthrough event has occured");
};

// Callback for AdUserClose
VPAIDWrapper.prototype.onAdVideoStart = function() {
    console.log("Video 0% completed");
    this.notify("start");
};

// Callback for AdUserClose
VPAIDWrapper.prototype.onAdVideoFirstQuartile = function() {
    console.log("Video 25% completed");
};

// Callback for AdUserClose
VPAIDWrapper.prototype.onAdVideoMidpoint = function() {
    console.log("Video 50% completed");
};

// Callback for AdUserClose
VPAIDWrapper.prototype.onAdVideoThirdQuartile = function() {
    console.log("Video 75% completed");
};

// Callback for AdVideoComplete
VPAIDWrapper.prototype.onAdVideoComplete = function() {
    console.log("Video 100% completed");
    this.notify("complete");
};

// Callback for AdLinearChange
VPAIDWrapper.prototype.onAdLinearChange = function() {
    console.log("Ad linear has changed: " + this._creative.getAdLinear());
};

// Pass through for getAdLinear
VPAIDWrapper.prototype.getAdLinear = function() {
    return this._creative.getAdLinear();
};

// Pass through for startAd()
VPAIDWrapper.prototype.startAd = function() {
    console.log("startAd");
    this._creative.startAd();
};

// Callback for AdLoaded
VPAIDWrapper.prototype.onAdLoaded = function() {
    console.log("ad has been loaded");
    var ref = this;
    setTimeout(function(){ref.startAd();}, 100);
};

// Callback for StartAd()
VPAIDWrapper.prototype.onStartAd = function() {
    console.log("Ad has started");
};

// Pass through for stopAd()
VPAIDWrapper.prototype.stopAd = function() {
    this._creative.stopAd();
};

// Callback for AdUserClose
VPAIDWrapper.prototype.onStopAd = function() {
    console.log("Ad has stopped");
};

// Callback for AdUserClose
VPAIDWrapper.prototype.onSkipAd = function() {
    console.log("Ad was skipped");
    this.notify("skip");
};

//Passthrough for setAdVolume
VPAIDWrapper.prototype.setAdVolume = function(val) {
    this._creative.setAdVolume(val);
};

//Passthrough for getAdVolume
VPAIDWrapper.prototype.getAdVolume = function() {
    return this._creative.getAdVolume();
};

// Callback for AdVolumeChange
VPAIDWrapper.prototype.onAdVolumeChange = function() {
    console.log("Ad Volume has changed to - " + this._creative.getAdVolume());
};

//Passthrough for resizeAd
VPAIDWrapper.prototype.resizeAd = function(width, height, viewMode) {
    this._creative.resizeAd();
};

//Passthrough for pauseAd()
VPAIDWrapper.prototype.pauseAd = function() {
    this._creative.pauseAd();
};

//Passthrough for resumeAd()
VPAIDWrapper.prototype.resumeAd = function() {
    this._creative.resumeAd();
};

//Passthrough for expandAd()
VPAIDWrapper.prototype.expandAd = function() {
    this._creative.expandAd();
};

//Passthrough for collapseAd()
VPAIDWrapper.prototype.collapseAd = function() {
    this._creative.collapseAd();
};

//Passthrough for collapseAd()
VPAIDWrapper.prototype.notify = function(event) {
    if (this._observer && typeof this._observer[event] == 'function') {
        this._observer[event]();
    }
};
