(function($){
    $('#big-slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        adaptiveHeight: true
    });

    $('#carousel-slider').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false
    });

    $('#carousel-slider-vertical').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        vertical: true,
        verticalSwiping: true
    });



})(jQuery);

