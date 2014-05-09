
$(function(){
   
    $('.bios .window').on('click', function (evt) {

        $('.bios .window').removeClass('active').addClass('inactive');

        $(this).addClass('active').removeClass('inactive');

    }) ;

});