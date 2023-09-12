import addInfo from "./EventFunctions/AdminGeneral/addInfo.js";
import toggleInfo from "./EventFunctions/AdminGeneral/toggleInfo.js";
import selectItem from "./EventFunctions/AdminGeneral/selectItem.js";
import chooseOption from "./EventFunctions/AdminGeneral/chooseOption.js";

$(() => {
    $("body").on("click", ".selected", selectItem);

    $("body").on("click", ".selected + .list .option", chooseOption);

    $("body").on(
        "click",
        ".container .details-degrees .details .student .info-name .open-arrow, .container .students-table .student .info-name .open-arrow",
        toggleInfo
    );

    $("body").on(
        "click",
        ".container .subjects-table .add, .container .students-table .add, .container .details-degrees .add",
        addInfo
    );

    $("body").on("click", ".cover > * > .buttons > .cancel", (_) => {
        if (!$(".cover > * > .buttons > .send").hasClass("waiting")) {
            $(".cover").fadeOut();

            $("body").css("overflow-y", "auto");
        }
    });
});
