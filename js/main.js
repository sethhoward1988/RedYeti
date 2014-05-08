
$(function () {

    $('#fullpage').fullpage({
        anchors: ['landing', 'listen', 'bios', 'videos','photos', 'contact'],
        menu: '#myMenu',
        onLeave: function(index, nextIndex, direction){
            

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

        },
    });

    var audioPlayer = new AudioPlayer($('canvas'), $('.listen .audio-player'));

    function getInstagramPictures () {
        // var url = "https://api.instagram.com/v1/users/330152032/media/recent/?access_token=330152032.fb03fd8.a0a306a2ed5549d5813027312c1edc11";
        // $.ajax({
        //     url: url,
        //     type:'GET',
        //     success: function (data) {
        //         console.log(data);
        //     },
        //     error: function () {
        //         console.log(arguments);
        //     }

        // });

        function success (json) {
            json = data.data;
            var thumbnailsEl = $('.thumbnails');
            for(var i = 0; i < json.length; i++){
                var image = $('<img src="' + json[i].images.standard_resolution.url + '" />');
                image.data(json[i]);
                thumbnailsEl.append(image);
            }

            thumbnailsEl.find('img').on('click', function (evt) {
                lightBoxPhoto($(evt.target).data());
            });

        }

        success();

    }

    getInstagramPictures();

    function lightBoxPhoto(data) {

        $('.lightbox').append(
            $(  
                '<div class="relative">' +
                    '<img src="' + data.images.standard_resolution.url + '" />' +
                    '<div class="image-info">' + data.caption.text + '</div>' +
                '</div>'
            ));
        $('.overlay').fadeIn();
        $('.lightbox').fadeIn();
    }

    $('.overlay').on('click', function () {
        $('.overlay').fadeOut();
        $('.lightbox').fadeOut(function () {
            $(this).empty();
        });
    });

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




























