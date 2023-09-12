import getSubjects from "./EventFunctions/Degrees/getSubjects.js";
import editDegrees from "./EventFunctions/Degrees/editDegrees.js";
import addNewDegrees from "./EventFunctions/Degrees/addNewDegrees.js";
import removeDegrees from "./EventFunctions/Degrees/removeDegrees.js";
import getInfoInState from "./EventFunctions/Degrees/getInfoInState.js";
import switchPageInTables from "./EventFunctions/Degrees/switchPageInTables.js";
import firstStudentWithoutDegree from "./EventFunctions/Degrees/firstStudentWithoutDegree.js";

$(() => {
    let lastDetailsPage = +$(
            ".container .details-degrees .pagination .pages > .pages-number"
        ).text(),
        lastFinalPage = +$(
            ".container .final-degrees .pagination .pages > .pages-number"
        ).text(),
        currentId = 0;

    $("body").on(
        "click",
        `.container .details-degrees .pagination .prev:not(.disabled),
         .container .details-degrees .pagination .next:not(.disabled),
         .container .final-degrees .pagination .prev:not(.disabled),
         .container .final-degrees .pagination .next:not(.disabled)`,
        switchPageInTables
    );

    $("body").on(
        "click",
        ".container .details-degrees > .states .list .option, .container .final-degrees > .states .list .option",
        getInfoInState
    );

    $("body").on(
        "click",
        ".container .cover .add-degree .list-container.students .list .option",
        function () {
            let major = $(this).attr("data-major");

            getSubjects(major);
        }
    );

    $("body").on(
        "click",
        ".container .details-degrees .details .student .info-name .title .options .edit",
        editDegrees
    );

    $("body").on(
        "click",
        ".container .cover .add-degree .buttons > .cancel",
        () => {
            if (
                !$(".container .cover .add-degree .buttons > .send").hasClass(
                    "waiting"
                )
            ) {
                currentId = 0;

                firstStudentWithoutDegree();
            }
        }
    );

    $("body").on(
        "click",
        ".container .cover .add-degree .buttons > .send:not(.waiting)",
        addNewDegrees
    );

    $("body").on(
        "click",
        ".container .details-degrees .details .student .info-name .title .options .delete",
        function () {
            currentId = $(this).parents(".student").attr("data-ssn");

            $(".confirm").fadeIn();
        }
    );

    $("body").on("click", ".container .confirm .body .no", () => {
        currentId = 0;

        $(".confirm").fadeOut();
    });

    $("body").on("click", ".container .confirm .body .yes", removeDegrees);
});
