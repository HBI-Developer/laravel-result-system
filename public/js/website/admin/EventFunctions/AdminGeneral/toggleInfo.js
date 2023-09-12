export default function () {
    if ($(this).hasClass("open")) {
        $(this).parents(".student").removeClass("open");

        $(this).parent().next().slideUp();
    } else {
        $(this)
            .parents(".student")
            .addClass("open")
            .siblings()
            .removeClass("open");

        $(".info").slideUp();

        $(this)
            .parent()
            .next()
            .slideDown({
                start: function () {
                    $(this).css("display", "grid");
                },
            });
    }
}
