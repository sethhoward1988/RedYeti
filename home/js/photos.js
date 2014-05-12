
$(function(){

    function getInstagramPictures () {
        var url = "https://api.instagram.com/v1/users/330152032/media/recent/?access_token=330152032.fb03fd8.a0a306a2ed5549d5813027312c1edc11";
        $.ajax({
            url: url,
            type:'GET',
            contentType: "application/json",
            dataType: 'jsonp',
            success: function (data) {
                success(data);
            },
            error: function () {
                console.log(arguments);
            }

        });

        function success (json) {
            json = json.data;
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

    }

    // getInstagramPictures();

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

});