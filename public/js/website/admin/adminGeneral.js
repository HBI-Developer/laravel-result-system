$(() => {
    $("body").on("click", ".selected", function () {

        if (
            $(this).next().hasClass("list") &&
            !$(this).parent().hasClass("disabled")
        ) {

            let isOpen =
                $(this).next().css("transform") === "matrix(1, 0, 0, 1, 0, 0)";

            $(".selected + .list").css("transform", "scaleY(0)");

            $(".selected .open-arrow").css("transform", "rotateZ(90deg)");

            if (!isOpen) {

                $(this).next().css("transform", "scaleY(1)");

                $(this)
                    .children(".open-arrow")
                    .css("transform", "rotateZ(270deg)");
            }

        }

    });

    $("body").on("click", ".selected + .list .option", function () {

        $(this)
            .parent()
            .prev()
            .children(".name")
            .text($(this).text())
            .attr("data-option", $(this).attr("data-option"));

        $(".selected + .list").css("transform", "scaleY(0)");

        $(".selected .open-arrow").css("transform", "rotateZ(90deg)");

    });

    $("body").on(
        "click",
        ".container .details-degrees .details .student:not(.open) .info-name .open-arrow, .container .students-table .student:not(.open) .info-name .open-arrow",
        function () {

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

    );

    $("body").on(
        "click",
        ".container .details-degrees .details .student.open .info-name .open-arrow, .container .students-table .student.open .info-name .open-arrow",
        function () {

            $(this).parents(".student").removeClass("open");

            $(this).parent().next().slideUp();

        }

    );

    $("body").on(
        "click",
        ".container .subjects-table .add, .container .students-table .add, .container .details-degrees .add",
        () => {

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

        }

    );

    $("body").on("click", ".cover > * > .buttons > .cancel", (_) => {
        
        if (!$(".cover > * > .buttons > .send").hasClass("waiting")) {

            $(".cover").fadeOut();

            $("body").css("overflow-y", "auto");

        }

    });
    
});
