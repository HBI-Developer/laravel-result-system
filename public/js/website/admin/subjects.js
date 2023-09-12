import addNewSubject from "./EventFunctions/Subjects/addNewSubject.js";
import editSubject from "./EventFunctions/Subjects/editSubject.js";
import removeSubject from "./EventFunctions/Subjects/removeSubject.js";

$(() => {
    let subjectId = -1;

    $("body").on(
        "click",
        ".container .subjects-table .column:not(.title) .major .options .edit",
        editSubject
    );

    $("body").on(
        "click",
        ".container .cover .add-subject .buttons > .cancel",
        () => {
            if (
                !$(".container .cover .add-subject .buttons > .send").hasClass(
                    "waiting"
                )
            ) {
                subjectId = -1;
            }
        }
    );

    $("body").on(
        "click",
        ".container .cover .add-subject .buttons > .send:not(.waiting)",
        addNewSubject
    );

    $("body").on(
        "click",
        ".container .subjects-table .column:not(.title) .major .options .delete",
        function () {
            subjectId = +$(this)
                .parents(".column")
                .children(".subject")
                .attr("data-id");

            $(".confirm").fadeIn();
        }
    );

    $("body").on("click", ".container .confirm .body .buttons .no", () => {
        subjectId = -1;

        $(".confirm").fadeOut();
    });

    $("body").on(
        "click",
        ".container .confirm .body .buttons .yes",
        removeSubject
    );
});
