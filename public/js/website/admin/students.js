import addNewStudent from "./EventFunctions/Students/addNewStudent.js";
import removeStudent from "./EventFunctions/Students/removeStudent.js";
import editStudentInfo from "./EventFunctions/Students/editStudentInfo.js";
import switchPageInTable from "./EventFunctions/Students/switchPageInTable.js";
import studentInState from "./EventFunctions/Students/editStudentInfoudentInState.js";

$(() => {
    let lastPage = +$(
            ".container .students-table .pagination .pages > .pages-number"
        ).text(),
        currentId = 0;

    $("body").on(
        "click",
        `.container .students-table .pagination .prev:not(.disabled),
         .container .students-table .pagination .next:not(.disabled)`,
        switchPageInTable
    );

    $("body").on(
        "click",
        ".container .students-table > .state .list .option",
        studentInState
    );

    $("body").on(
        "click",
        ".container .students-table .student .info-name .title .options .edit",
        editStudentInfo
    );

    $("body").on("click", ".cover .student-inputs .buttons > .cancel", () => {
        if (!$(".cover .student-inputs .buttons > .send").hasClass("waiting")) {
            currentId = 0;
        }
    });

    $("body").on(
        "click",
        ".cover .student-inputs .buttons > .send:not(.waiting)",
        addNewStudent
    );

    $("body").on(
        "click",
        ".container .students-table .student .info-name .title .options .delete",
        function () {
            currentId = $(this)
                .parents(".info-name")
                .siblings(".info")
                .children(".value")
                .eq(0)
                .text();

            $(".container .confirm").fadeIn();
        }
    );

    $("body").on("click", ".container .confirm .body .buttons .no", (_) => {
        currentId = 0;

        $(".container .confirm").fadeOut();
    });

    $("body").on(
        "click",
        ".container .confirm .body .buttons .yes",
        removeStudent
    );
});
