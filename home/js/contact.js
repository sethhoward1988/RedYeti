$(function(){

    $('.contact .button').on('click', function () {

        if($(this).hasClass('disabled')){
            return;
        }

        console.log('sending email');

        var data = {
            name: $('#name').val(),
            message: $('#message').val(),
            email: $('#email').val()
        }

        for(prop in data){
            if(data[prop] == ''){
                $('#' + prop).addClass('invalid');
            } else {
                $('#' + prop).removeClass('invalid');
            }
        }

        if($('.contact .invalid').length){
            return;
        }

        $(this).addClass('disabled');

        $.ajax({
            url: 'mail.php',
            type: 'POST',
            data: data,
            success: function (resp) {
                console.log('success');
                $('.contact.button').removeClass('disabled');
                for(prop in data){
                    $('#' + prop).val('');
                }
                $('.contact .info').text('Message Sent!').css('color','green').fadeIn();
                setTimeout(function () {
                    $('.contact .info').fadeOut();
                }, 3000);

            },
            error: function (err) {
                $('.contact .info').text('Error! Try later :(').css('color','red').fadeIn();
                setTimeout(function () {
                    $('.contact .info').fadeOut();
                }, 3000);
            }
        });

    });

});