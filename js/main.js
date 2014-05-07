
$(function () {

    $('#fullpage').fullpage({
        anchors: ['landing', 'listen', 'photos', 'contact'],
        menu: '#myMenu',
        onLeave: function(index, nextIndex, direction){
            if(index == 1 && nextIndex > 1){
                $('#menu').addClass('fixed');
                $('.social').addClass('fixed');
            } else if (index > 1 && nextIndex == 1){
                $('#menu').removeClass('fixed');
                $('.social').removeClass('fixed');
            }
        },
    });

    var audioPlayer = new AudioPlayer($('canvas'), $('.listen .audio-player'));

});

