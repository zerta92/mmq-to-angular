$(document).ready(function() {
    'use strict'
    //LEFT MOBILE MENU OPEN
    $('.ts-menu-5').on('click', function() {
        $('.mob-right-nav').css('right', '0px')
    })

    //LEFT MOBILE MENU OPEN
    $('.mob-right-nav-close').on('click', function() {
        $('.mob-right-nav').css('right', '-270px')
    })

    //LEFT MOBILE MENU CLOSE
    $('.mob-close').on('click', function() {
        $('.mob-close').hide('fast')
        $('.menu').css('left', '-92px')
        $('.mob-menu').show('slow')
    })

    //mega menu
    $('.t-bb').hover(function() {
        $('.cat-menu').fadeIn(50)
    })
    $('.ts-menu').mouseleave(function() {
        $('.cat-menu').fadeOut(50)
    })

    //mega menu
    $('.sea-drop').on('click', function() {
        $('.sea-drop-1').fadeIn(100)
    })
    $('.sea-drop-1').mouseleave(function() {
        $('.sea-drop-1').fadeOut(50)
    })
    $('.dir-ho-t-sp').mouseleave(function() {
        $('.sea-drop-1').fadeOut(50)
    })

    //mega menu top menu
    $('.sea-drop-top').on('click', function() {
        $('.sea-drop-2').fadeIn(100)
    })
    $('.sea-drop-1').mouseleave(function() {
        $('.sea-drop-2').fadeOut(50)
    })
    $('.top-search').mouseleave(function() {
        $('.sea-drop-2').fadeOut(50)
    })

    //ADMIN LEFT MOBILE MENU OPEN
    $('.atab-menu').on('click', function() {
        $('.sb2-1').css('left', '0')
        $('.btn-close-menu').css('display', 'inline-block')
    })

    //ADMIN LEFT MOBILE MENU CLOSE
    $('.btn-close-menu').on('click', function() {
        $('.sb2-1').css('left', '-350px')
        $('.btn-close-menu').css('display', 'none')
    })

    //mega menu
    $('.t-bb').hover(function() {
        $('.cat-menu').fadeIn(50)
    })
    $('.ts-menu').mouseleave(function() {
        $('.cat-menu').fadeOut(50)
    })
    //review replay
    $('.edit-replay').on('click', function() {
        $('.hide-box').show()
    })

    //PRE LOADING
    $('#status').fadeOut()
    $('#preloader')
        .delay(350)
        .fadeOut('slow')
    $('body')
        .delay(350)
        .css({
            overflow: 'visible',
        })

    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrainWidth: 400, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left', // Displays dropdown with edge aligned to the left of button
        stopPropagation: false, // Stops event propagation
    })
    $('.dropdown-button2').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: ($('.dropdown-content').width() * 7) / 2.5 + 5, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left', // Displays dropdown with edge aligned to the left of button
    })

    //HOME PAGE FIXED MENU
    $(window).scroll(function() {
        if ($(this).scrollTop() > 450) {
            $('.hom-top-menu').fadeIn()
            $('.cat-menu').hide()
        } else {
            $('.hom-top-menu').fadeOut()
        }
    })

    /**
     * @author Jorge Medina
     * RESIZE WINDOWS EVENT BUG FIXED.
     */
    $(window).resize(function() {
        if ($(window).width() >= 977) {
            $('.sb2-1').css('left', '0')
            $('.btn-close-menu').css('display', 'none')
        } else {
            $('.sb2-1').css('left', '-350px')
        }
    })
})

function scrollNav() {
    $('.v3-list-ql-inn a').click(function() {
        //Toggle Class
        $('.active-list').removeClass('active-list')
        $(this)
            .closest('li')
            .addClass('active-list')
        var theClass = $(this).attr('class')
        $('.' + theClass)
            .parent('li')
            .addClass('active-list')
        //Animate
        $('html, body')
            .stop()
            .animate(
                {
                    scrollTop: $($(this).attr('href')).offset().top - 130,
                },
                400
            )
        return false
    })
    $('.scrollTop a').scrollTop()
}
scrollNav()
