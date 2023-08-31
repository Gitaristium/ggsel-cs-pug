jQuery(function ($) {
    $(".live-list-point").click(function () {
        $(".live-list-point").not(this).removeClass("active");
        $(this).addClass("active");
    });
});
