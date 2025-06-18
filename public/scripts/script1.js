// const $ = require('jquery')

$(".upd").hover(
    function () {
        $(this).find("p").css({ display: "flex" });
    },
    function () {
        $(this).find("p").css({ display: "none" });
    }
);

$(".del").hover(
    function () {
        $(this).find("p").css({ display: "flex" });
    },
    function () {
        $(this).find("p").css({ display: "none" });
    }
);

let menuEntered = false

$(".hamburger").mouseenter(function () {
    $('#menu').css('display', 'block')
}).mouseleave(function () {
    setTimeout(() => {
        if(!menuEntered) {
            $("#menu").css('display', 'none')
        }
    }, 500);
})

$('#menu').mouseenter(function () {
    menuEntered = true
}).mouseleave(function () {
    menuEntered = false
    $(this).css('display', 'none')
})