jQuery(function ($) {
    $(".navbar__menu .link").click(function () {
        $(".navbar__menu .link").not(this).removeClass("active");
        $(this).addClass("active");
    });
});
