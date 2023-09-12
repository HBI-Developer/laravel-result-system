import refreshOpenTime from "./refreshOpenTime.js";

export default function () {
    updatingTime = false;

    let time = $(this).val();

    if ($(this).hasClass("hour")) {
        sessionStorage.setItem("hour", time);
    } else if ($(this).hasClass("minute")) {
        sessionStorage.setItem("minute", time);
    }

    updatingTime = true;

    refreshOpenTime();
}
