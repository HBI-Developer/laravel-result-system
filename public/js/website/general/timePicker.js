let updatingTime = false,

    refreshOpenTime = (_) => {

        let { year, month, day, hour, minute } = sessionStorage,
            current = new Date();

        year = !isNaN(parseInt(year)) ? parseInt(year) : current.getFullYear();

        month = !isNaN(parseInt(month)) ? parseInt(month) : current.getMonth() + 1;

        day = !isNaN(parseInt(day)) ? parseInt(day) : current.getDate();

        hour = !isNaN(parseInt(hour)) ? parseInt(hour) : "00";

        minute = !isNaN(parseInt(minute)) ? parseInt(minute) : "00";

        let openTime = new Date(year, month, day, hour, minute).getTime(),
            diffrent = diffrentFromNow(openTime, true),
            timeFormat = `${diffrent[0]}:${diffrent[1]}:${diffrent[2]}:${diffrent[3]}`;

        $(".time-picker .until-open > .counter").text(timeFormat);

        setTimeout((_) => {

            if (updatingTime && diffrent !== 0) {

                refreshOpenTime();

            } else {

                updatingTime = false;

            }

        }, 0);

    };

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
        function () {

            updatingTime = false;

            let currentYear = +$(".time-picker .years .year-input .year").val(),
                row = $(".time-picker .months .container .month")
                    .css("transform")
                    .split(", ")[4],
                currentMonth = Math.ceil(
                    Math.abs(
                        row /
                            $(".time-picker .months .container .month").width()
                    )
                ),
                thisMonth = currentMonth + 1;

            if ($(this).hasClass("prev")) {

                $(".time-picker .years .year-input").prepend(`
                    <input type="number" class="year" style="width: 0; padding: 0" min="${new Date().getFullYear()}" value="${
                    currentYear - 1
                }">`);

                $(".time-picker .years .year-input .year:first-child").animate(
                    {
                        width: "100%",
                        padding: "5px 10px",
                    },
                    50,
                    () => {

                        $(
                            ".time-picker .years .year-input .year:last-child"
                        ).remove();

                    }

                );

                if (currentYear - 1 == new Date().getFullYear()) {

                    $(".time-picker .years .arrow.prev").addClass("disabled");

                }

            } else {

                $(".time-picker .years .year-input").prepend(`
                    <input type="number" class="year" style="width: 0; padding: 0" min="${new Date().getFullYear()}" value="${
                    currentYear + 1
                }">`);

                $(".time-picker .years .year-input .year:first-child").animate(
                    {
                        width: "100%",
                        padding: "5px 10px",
                    },
                    50,
                    () => {

                        $(
                            ".time-picker .years .year-input .year:last-child"
                        ).remove();

                    }

                );

                $(".time-picker .years .arrow.disabled").removeClass(
                    "disabled"
                );

            }

            if (
                +$(".time-picker .years .year-input .year").val() <=
                new Date().getFullYear()
            ) {

                $(".time-picker .years .year-input .year").val(
                    new Date().getFullYear()
                );

                if (currentMonth <= new Date().getMonth() + 1) {
                    
                    let day = new Date().getDate();

                    $(".time-picker .months .container .month").css(
                        "transform",
                        `translateX(-${new Date().getMonth() * 100}%)`
                    );

                    $(".time-picker .months .arrow.prev").addClass("disabled");

                    $(`.time-picker .days .day`)
                        .filter((someday) => {
                            return someday + 1 < day;
                        })
                        .addClass("disabled");

                    if (+$(".time-picker .days .day.selected").text() < day) {

                        $(".time-picker .days .day.selected").removeClass(
                            "selected"
                        );

                        $(`.time-picker .days .day`)
                            .filter((someday) => {
                                return someday + 1 == day;
                            })
                            .addClass("selected");

                    }

                    thisMonth = new Date().getMonth() + 1;

                    sessionStorage.setItem("month", thisMonth);

                } else {

                    $(".time-picker .months .arrow.disabled").removeClass(
                        "disabled"
                    );

                    $(".time-picker .days .day.disabled").removeClass(
                        "disabled"
                    );

                }

            } else if (
                +$(".time-picker .years .year-input .year").val() >
                new Date().getFullYear()
            ) {

                $(".time-picker .months .arrow.disabled").removeClass(
                    "disabled"
                );

                $(".time-picker .days .day.disabled").removeClass("disabled");

            }

            let lastDay = new Date(
                    $(".time-picker .years .year-input .year").val(),
                    thisMonth,
                    0
                ).getDate(),
                currentLastDay = +$(
                    ".time-picker .days .day:last-child"
                ).text();

            if (currentLastDay > lastDay) {

                $(`.time-picker .days .day`)
                    .filter((someday) => {
                        return someday + 1 > lastDay;
                    })
                    .remove();

            } else if (currentLastDay < lastDay) {

                for (let i = currentLastDay + 1; i <= lastDay; i++) {

                    $(".time-picker .days").append(`
                        <div class="day">${i}</div>
                    `);

                }

            }

            if ($(".time-picker .days .day.selected").length === 0) {

                $(".time-picker .days .day:last-child").addClass("selected");

            }

            setTimeout(() => {

                sessionStorage.setItem(
                    "year",
                    $(".time-picker .years .year-input .year").val()
                );

                updatingTime = true;

                refreshOpenTime();

            }, 0);

        }

    );

    $("body").on(
        "change",
        ".time-picker .years .year-input .year",
        function () {

            updatingTime = false;

            let thisNumber = $(this).val(),
                currentYear = new Date().getFullYear(),
                row = $(".time-picker .months .container .month")
                    .css("transform")
                    .split(", ")[4],
                currentMonth = Math.ceil(
                    Math.abs(
                        row /
                            $(".time-picker .months .container .month").width()
                    )
                ),
                thisMonth = currentMonth + 1;

            if (thisNumber <= currentYear) {

                $(".time-picker .years .arrow.prev").addClass("disabled");

                $(this).val(currentYear);


                if (currentMonth <= new Date().getMonth() + 1) {

                    let day = new Date().getDate();

                    $(".time-picker .months .container .month").css(
                        "transform",
                        `translateX(-${new Date().getMonth() * 100}%)`
                    );

                    $(".time-picker .months .arrow.prev").addClass("disabled");

                    $(`.time-picker .days .day`)
                        .filter((someday) => {
                            return someday + 1 < day;
                        })
                        .addClass("disabled");

                    if (
                        +$(".time-picker .days .day.selected").text() <
                        day
                    ) {

                        $(".time-picker .days .day.selected").removeClass(
                            "selected"
                        );

                        $(`.time-picker .days .day`)
                            .filter((someday) => {
                                return someday + 1 == day;
                            })
                            .addClass("selected");

                    }

                    thisMonth = new Date().getMonth() + 1;

                    sessionStorage.setItem("month", thisMonth);

                } else {

                    $(".time-picker .months .arrow.disabled").removeClass(
                        "disabled"
                    );

                    $(".time-picker .days .day.disabled").removeClass(
                        "disabled"
                    );

                }

            } else if (thisNumber > currentYear) {
                
                $(".time-picker .years .arrow.disabled").removeClass(
                    "disabled"
                );

                $(".time-picker .months .arrow.disabled").removeClass(
                    "disabled"
                );

                $(".time-picker .days .day.disabled").removeClass("disabled");

            }

            let lastDay = new Date(
                    $(".time-picker .years .year-input .year").val(),
                    thisMonth,
                    0
                ).getDate(),
                currentLastDay = +$(
                    ".time-picker .days .day:last-child"
                ).text();

            if (currentLastDay > lastDay) {

                $(`.time-picker .days .day`)
                    .filter((someday) => {
                        return someday + 1 > lastDay;
                    })
                    .remove();

            } else if (currentLastDay < lastDay) {

                for (let i = currentLastDay + 1; i <= lastDay; i++) {

                    $(".time-picker .days").append(`
                        <div class="day">${i}</div>
                    `);

                }

            }

            if ($(".time-picker .days .day.selected").length === 0) {

                $(".time-picker .days .day:last-child").addClass("selected");

            }

            sessionStorage.setItem(
                "year",
                $(".time-picker .years .year-input .year").val()
            );

            updatingTime = true;

            refreshOpenTime();

        }

    );

    $("body").on(
        "click",
        ".time-picker .months .arrow:not(.disabled)",
        function () {

            updatingTime = false;

            let currentYear = +$(".time-picker .years .year-input .year").val(),
                row = $(".time-picker .months .container .month")
                    .css("transform")
                    .split(", ")[4],
                currentMonth = Math.ceil(
                    Math.abs(
                        row /
                            $(".time-picker .months .container .month").width()
                    ) + 1
                ),
                thisMonth = currentMonth;

            if ($(this).hasClass("prev")) {

                if (currentMonth === 1) {

                    currentYear--;

                    $(".time-picker .months .container .month").css(
                        "transform",
                        `translateX(-${11 * 100}%)`
                    );

                    $(".time-picker .years .year-input .year").val(currentYear);

                    if (currentYear == new Date().getFullYear()) {

                        $(".time-picker .years .arrow.prev").addClass(
                            "disabled"
                        );

                    }

                    thisMonth = 12;

                } else {

                    $(".time-picker .months .container .month").css(
                        "transform",
                        `translateX(-${(currentMonth - 2) * 100}%)`
                    );

                    thisMonth = currentMonth - 1;

                }

                if (
                    currentYear == new Date().getFullYear() &&
                    thisMonth == new Date().getMonth() + 1
                ) {

                    let day = new Date().getDate();

                    $(".time-picker .months .arrow.prev").addClass("disabled");

                    if (
                        +$(".time-picker .days .day.selected").text() <
                        day
                    ) {

                        $(".time-picker .days .day.selected").removeClass(
                            "selected"
                        );

                        $(`.time-picker .days .day`)
                            .filter((someday) => {
                                return someday + 1 == day;
                            })
                            .addClass("selected");

                    }

                    $(`.time-picker .days .day`)
                        .filter((someday) => {
                            return someday + 1 < day;
                        })
                        .addClass("disabled");

                }

            } else {

                if (currentMonth == 12) {

                    $(".time-picker .years .year-input .year").val(
                        currentYear + 1
                    );

                    $(".time-picker .years .arrow.disabled").removeClass(
                        "disabled"
                    );

                    $(".time-picker .months .container .month").css(
                        "transform",
                        `translateX(0)`
                    );

                    thisMonth = 1;

                } else {

                    $(".time-picker .months .container .month").css(
                        "transform",
                        `translateX(-${currentMonth * 100}%)`
                    );

                    thisMonth = currentMonth + 1;

                }

                $(".time-picker .months .arrow.disabled").removeClass(
                    "disabled"
                );

                $(`.time-picker .days .day.disabled`).removeClass("disabled");

            }

            let lastDay = new Date(
                    $(".time-picker .years .year-input .year").val(),
                    thisMonth,
                    0
                ).getDate(),
                currentLastDay = +$(
                    ".time-picker .days .day:last-child"
                ).text();

            if (currentLastDay > lastDay) {

                $(`.time-picker .days .day`)
                    .filter((someday) => {
                        return someday + 1 > lastDay;
                    })
                    .remove();

            } else if (currentLastDay < lastDay) {

                for (let i = currentLastDay + 1; i <= lastDay; i++) {

                    $(".time-picker .days").append(`
                        <div class="day">${i}</div>
                    `);

                }

            }
            
            if ($(".time-picker .days .day.selected").length === 0) {

                $(".time-picker .days .day:last-child").addClass("selected");

            }

            setTimeout(() => {

                sessionStorage.setItem(
                    "year",
                    $(".time-picker .years .year-input .year").val()
                );

                sessionStorage.setItem("month", thisMonth);

                updatingTime = true;

                refreshOpenTime();
                
            }, 0);

        }

    );

    $("body").on(
        "click",
        ".time-picker .days .day:not(.disabled):not(.selected)",
        function () {

            updatingTime = false;

            $(this).addClass("selected").siblings().removeClass("selected");

            sessionStorage.setItem(
                "day",
                $(this).text()
            );

            updatingTime = true;

            refreshOpenTime();

        }

    );

    $("body").on(
        "change",
        ".time-picker .hours input[type=number]",
        function () {

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

    );

    $("body").on("click", ".time-picker .reset-time", () => {

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

    });
    
});
