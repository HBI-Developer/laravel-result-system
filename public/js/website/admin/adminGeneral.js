/*
    This JavaScript File is used in Admin Pages & This funcion is general between admin pages
*/

$(() => { // When page is ready

    $("body").on("click", ".selected", function () {

        // Event fire when open a or close .list-container element

        if ($(this).next().hasClass("list") && !$(this).parent().hasClass("disabled")) {

            // Should be list is not disabled and have options list to fired


            // isOpen to check is the clicked list is already open to close it or no

            let isOpen = $(this).next().css("transform") === 'matrix(1, 0, 0, 1, 0, 0)';

            
            // close any opened list
            $(".selected + .list").css("transform", "scaleY(0)");
            $(".selected .open-arrow").css("transform", "rotateZ(90deg)");
            
            if (!isOpen) {

                // if clicked list is not open, open it

                $(this).next().css("transform", "scaleY(1)");
                $(this).children(".open-arrow").css("transform", "rotateZ(270deg)");
            }
        }
    });
  
    $("body").on("click", ".selected + .list .option", function () {

        // This event to when clicking in option in list

        /*
            .selected element in list have element named name [have selected value], will take text
            and value of [data-option] in .option element
        */

        $(this).parent().prev().children(".name").text($(this).text()).attr('data-option', $(this).attr('data-option'));

        // close current list

        $(".selected + .list").css("transform", "scaleY(0)");
        $(".selected .open-arrow").css("transform", "rotateZ(90deg)");
    });

    $("body").on(
        "click",
        ".container .details-degrees .details .student:not(.open) .info-name .open-arrow, .container .students-table .student:not(.open) .info-name .open-arrow",
        function () {

            /*
                That's event for downdrop rows in tables as students info in students table in students page in
                admin dashboard
            */

            // add class open to clicked row and remove for any row have this class
            
            $(this)
                .parents(".student")
                .addClass("open")
                .siblings()
                .removeClass("open");

            // close any info [part of row wrap a data] in any open row

            $(".info").slideUp();

            // set [display: grid] to .info element while it opened [by slideDown animation]
            
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

            // event to close opened info in details-degrees and .student-table when use close it

            $(this).parents(".student").removeClass("open");
            $(this).parent().next().slideUp();
        }
    );

    $("body").on(
        "click",
        ".container .subjects-table .add, .container .students-table .add, .container .details-degrees .add",
        () => {

            /*
                Event will fired when click add button [+] in (students, subjects, degrees) pages in admin dashboard
            */

            // Should be confirm element [when click on delete button] is not shown on screen

            if ($(".confirm").css("display") !== 'none')
                return;

            /*
                Reset all input as below:
                * inputs have empty vaule
                * any disabled input became enable
                * .list-container elements will be take first option value
                * any disabled .list-container element became enable
            */

            $(".inputs input").val("");
            $(".inputs input").prop("disabled", false);
            $(".inputs .list-container").map(function () {
                let selected = $(this).children('.selected').children('.name').filter(function () {
                                    return $(this).css('display') !== 'none';
                                }),
                    optionIndex = selected.index() === 1 ? 0 : 1,
                    option = $(this).children('.list').children('.option').eq(optionIndex);
                selected.text(option.text());
                selected.attr('data-option', option.attr('data-option'));
                
                $(this).removeClass('disabled');
            });

            // the cover have inputs shown and scroll in page is hidden

            $(".cover").fadeIn();
            $("body").css("overflow", "hidden");
        }
    );

    $("body").on("click", '.cover > * > .buttons > .cancel', _ => {

        // This event fired when click on cancel button in cover [That's have inputs]

        if (!$('.cover > * > .buttons > .send').hasClass('waiting')) {

            /*
                If there's no adding or editing running [Through .waiting class on .send button] then
                cover will be hide
            */

            $('.cover').fadeOut();
            $("body").css("overflow-y", "auto");
        }
    });
});
