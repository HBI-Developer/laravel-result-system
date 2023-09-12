export default () => {
    if ($(".confirm").css("display") !== "none") return;

    $(".inputs input").val("");

    $(".inputs input").prop("disabled", false);

    $(".inputs .list-container").map(function () {
        let selected = $(this)
                .children(".selected")
                .children(".name")
                .filter(function () {
                    return $(this).css("display") !== "none";
                }),
            optionIndex = selected.index() === 1 ? 0 : 1,
            option = $(this)
                .children(".list")
                .children(".option")
                .eq(optionIndex);

        selected.text(option.text());

        selected.attr("data-option", option.attr("data-option"));

        $(this).removeClass("disabled");
    });

    $(".cover").fadeIn();

    $("body").css("overflow", "hidden");
};
