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