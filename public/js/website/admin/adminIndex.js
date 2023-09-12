import openTimePicker from "./EventFunctions/AdminIndex/openTimePicker.js";
import closeTimePicker from "./EventFunctions/AdminIndex/closeTimePicker.js";

$(() => {
    $("body").on(
        "click",
        ".container .sidebar .option.clock, .container>.option",
        openTimePicker
    );

    $("body").on("click", ".cover", closeTimePicker);
});
