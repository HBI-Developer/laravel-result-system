export default () => {
    updatingTime = false;

    let today = new Date();

    sessionStorage.setItem("year", today.getFullYear());

    sessionStorage.setItem("month", today.getMonth() + 1);

    sessionStorage.setItem("day", today.getDate());

    sessionStorage.setItem("hour", "00");

    sessionStorage.setItem("minute", "00");

    $(".time-picker .years .year-input .year").val(today.getFullYear());

    $(".time-picker .years .arrow.prev").addClass("disabled");

    $(".time-picker .months .container .month").css(
        "transform",
        `translateX(-${today.getMonth() * 100}%)`
    );

    $(".time-picker .months .arrow.prev").addClass("disabled");

    $(`.time-picker .days .day`)
        .filter((someday) => {
            return someday + 1 === today.getDate();
        })
        .addClass("selected")
        .siblings()
        .removeClass("selected");

    $(`.time-picker .days .day`)
        .filter((someday) => {
            return someday + 1 < today.getDate();
        })
        .addClass("disabled");

    $(".time-picker .hours .hour").val("00");

    $(".time-picker .hours .minute").val("00");
};
