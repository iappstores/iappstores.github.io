//------------------------------
//Owl-Carousel
//------------------------------
$(".owl-carousel").owlCarousel({
    loop: true,
    nav: true,
    autoplay:true,
    dots:false,
    margin:30,
    autoplayTimeout: 3000,
    smartSpeed: 1200,
    navText: [ '<i class="material-icons-round owl-nav-btn">keyboard_arrow_left</i>', '<i class="material-icons-round owl-nav-btn">keyboard_arrow_right</i>' ],
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },
        800:{
            items:2
        },
        1024:{
            items:2
        },
        1200:{
            items:3
        }
    }
});


//------------------------------
//Pre-loader
//------------------------------
$(window).on('load', function () {
    $('#pre-loader').fadeOut('slow');
    $('#pre-loader').css({"display":"none"});
});


//------------------------------
//Smooth In-page navigation
//------------------------------
$('a[href*="#"]').on('click', function(e) {
    $('html, body').animate(
        {
            scrollTop: $($(this).attr('href')).offset().top,
        },
        500,
        'linear'
    );
});