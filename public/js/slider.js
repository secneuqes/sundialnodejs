$(document).ready(function () {
    $('.slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 4000,
    });

    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;

    if (!isMobile) {
        $('.mergedImg').hide();
        $('.slider').show();
    } else {
        $('.mergedImg').show();
        $('.slider').hide();
    }
});