
$(function () {

    $('#fullpage').fullpage({
        anchors: ['landing', 'listen', 'photos', 'news', 'yetination', 'contact'],
        menu: '#myMenu',
        onLeave: function(index, nextIndex, direction){
            if(index == 1 && nextIndex == 2){
                $('#menu').addClass('fixed');
            } else if (index == 2 && nextIndex == 1){
                $('#menu').removeClass('fixed');
            }
        },
    });

    var audioPlayer = new AudioPlayer($('canvas'), $('.listen .audio-player'));

});

