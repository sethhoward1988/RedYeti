$(function(){

    var isSupported = self.AudioContext || self.webkitAudioContext;
    
    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
        // Safari bug prevents this from working...
        isSupported = false;
    }

    if(!isSupported){
        $('.listen').addClass('not-supported');
    }

    var audioPlayer = new AudioPlayer($('canvas'), $('.listen .audio-player'), isSupported);    
    
});