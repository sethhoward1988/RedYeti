$(function(){

    var isSupported = self.AudioContext || self.webkitAudioContext;

    if(isSupported){
        if(!(new isSupported).createJavaScriptNode){
            isSupported = false;
        }
    }
    
    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
        // Safari bug prevents this from working...
        isSupported = false;
    }

    var audioPlayer = new AudioPlayer($('canvas'), $('.listen .audio-player'), !!isSupported);    
    
});