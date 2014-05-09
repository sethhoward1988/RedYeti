
$(function () {

    $('#fullpage').fullpage({
        anchors: ['landing', 'listen', 'bios', 'videos','photos', 'contact'],
        menu: '#myMenu',
        onLeave: function (index, nextIndex, direction) {

            if(index == 1 && nextIndex > 1){
                $('#menu').addClass('fixed');
                $('.social').addClass('fixed');
            } else if (index > 1 && nextIndex == 1){
                $('#menu').removeClass('fixed');
                $('.social').removeClass('fixed');
            }

            if(nextIndex == 4 && index != 1){
                $('#lens').removeClass('hidden');
                $('#redyeti').addClass('hidden');
            } else if (nextIndex == 4 && index == 1){
                setTimeout(function () {
                    $('#lens').removeClass('hidden');
                    $('#redyeti').addClass('hidden');
                }, 500)
            } else if (nextIndex == 1 && index != 4){
                $('#lens').addClass('hidden');
                $('#redyeti').removeClass('hidden');
            } else if (nextIndex == 1 && index == 4){
                setTimeout(function () {
                    $('#lens').addClass('hidden');
                    $('#redyeti').removeClass('hidden');
                }, 500)
            }

        }

    });

});




























