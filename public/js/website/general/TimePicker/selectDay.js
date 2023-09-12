import refreshOpenTime from "./refreshOpenTime.js";

export default function () {
    updatingTime = false;

    $(this).addClass("selected").siblings().removeClass("selected");

    sessionStorage.setItem("day", $(this).text());

    updatingTime = true;

    refreshOpenTime();
}
