
var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
  if (mobile) {
      window.location.href = "mobile.html";
  }

$(function () {

    var menu = $('#menu li');

    $('#fullpage').fullpage({
        anchors: ['landing', 'licensing', 'bios', 'videos','merch', 'contact'],
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

            if(nextIndex <= 2){
                $('.audio-player').removeClass('fixed').removeClass('from-right');
                setTimeout(function(){
                    $('.audio-player').appendTo($('.section.listen .content'));    
                },(index - nextIndex > 2 ? 500 : 1000));
                
            } else {
                if(index == 1){
                    $('.audio-player').appendTo($('body')).addClass('from-right');
                    _.defer(function(){
                        $('.audio-player').addClass('fixed');    
                    });
                } else {
                    $('.audio-player').appendTo($('body'));
                    _.defer(function(){
                        $('.audio-player').addClass('fixed');    
                    });
                }
            }

            if(nextIndex == 4){
                $('.social .youtube').addClass('subscribe-position');
            } else {
                $('.social .youtube').removeClass('subscribe-position');
            }

            menu.removeClass('active');
            $(menu[nextIndex - 1]).addClass('active');

        }

    });

    var arrow = $('.arrow-down');

    arrow.on('click', function (){
        $.fn.fullpage.moveSectionDown();
    });

    setTimeout(function(){
        arrow.removeClass('hidden');
        setTimeout(function(){
            arrow.addClass('pop');
            setTimeout(function(){
                arrow.removeClass('pop');
            },500)
        },500)
    },3000);

});




























