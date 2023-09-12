import resetTime from "./TimePicker/resetTime.js";
import selectDay from "./TimePicker/selectDay.js";
import changeHour from "./TimePicker/changeHour.js";
import switchYear from "./TimePicker/switchYear.js";
import changeYear from "./TimePicker/changeYear.js";
import switchMonth from "./TimePicker/switchMonth.js";

let updatingTime = false;

$(window).on("load", () => {
    $.ajax({
        url: `${window.location.origin}/get-show-date`,
        method: "GET",
        success: (result) => {
            let number = +result[0].value;

            if (!isNaN(number) && number > 0) {
                let date = new Date(number),
                    currentDate;

                currentDate = date - new Date() > 0 ? date : new Date();

                sessionStorage.setItem("year", currentDate.getFullYear());

                sessionStorage.setItem("month", currentDate.getMonth() + 1);

                sessionStorage.setItem("day", currentDate.getDate());

                sessionStorage.setItem("hour", currentDate.getHours());

                sessionStorage.setItem("minute", currentDate.getMinutes());
            }
        },
    });
});

$(() => {
    $("body").on("keydown", "input[type='number']", function (ev) {
        if (ev.key.toUpperCase() === "E") {
            ev.preventDefault();
        }
    });

    $("body").on(
        "click",
        ".time-picker .years .arrow:not(.disabled)",
        switchYear
    );

    $("body").on("change", ".time-picker .years .year-input .year", changeYear);

    $("body").on(
        "click",
        ".time-picker .months .arrow:not(.disabled)",
        switchMonth
    );

    $("body").on(
        "click",
        ".time-picker .days .day:not(.disabled):not(.selected)",
        selectDay
    );

    $("body").on(
        "change",
        ".time-picker .hours input[type=number]",
        changeHour
    );

    $("body").on("click", ".time-picker .reset-time", resetTime);
});
