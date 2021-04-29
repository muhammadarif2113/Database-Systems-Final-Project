$(document).ready(function () {
    var $slider = $('.slider'); // class or id of carousel slider
    var $slide = 'li'; // could also use 'img' if you're not using a ul
    var $transition_time = 0; // 0 second
    var $time_between_slides = 3000; // 4 seconds

    function slides(){
        return $slider.find($slide);
    }

    slides().fadeOut();

    // set active classes
    slides().first().addClass('active');
    slides().first().fadeIn($transition_time);

    // auto scroll
    $interval = setInterval(
        function(){
            var $i = $slider.find($slide + '.active').index();

            slides().eq($i).removeClass('active');
            slides().eq($i).fadeOut($transition_time);

            if (slides().length == $i + 1) $i = -1; // loop to start

            slides().eq($i + 1).fadeIn($transition_time);
            slides().eq($i + 1).addClass('active');
        }
        , $transition_time +  $time_between_slides
    );

    var imageBox = $('.slider ul');
    var imageWidth = $('.slider ul li img').width();
    var imageQuantity = $('.slider ul li').length;
    var currentImage = 1;
    var $transition_time = 1000;

    imageBox.css('width', imageWidth * imageQuantity);

    $(document).on("click", 'a', function () {

        var whichButton = $(this).data('nav');
        if (whichButton === "next") {
            currentImage++;
            if (currentImage >= imageQuantity) {
                currentImage = 1;
                nextImage(currentImage, imageWidth);
            }
            else {
                nextImage(currentImage, imageWidth);
            }

        } else {
            currentImage--;
            if (currentImage <= 0) {
                currentImage = imageQuantity;
                nextImage(currentImage, imageWidth)
            }
            else {
                nextImage(currentImage, imageWidth)
            }
        }
    });

    function nextImage(currentImage, imageWidth) {
        var pxValue = -(currentImage - 1) * imageWidth;
        imageBox.animate({
            'left': pxValue

        })
    }

});