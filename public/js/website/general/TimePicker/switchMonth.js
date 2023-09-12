import refreshOpenTime from "./refreshOpenTime.js";

export default function () {
    updatingTime = false;

    let currentYear = +$(".time-picker .years .year-input .year").val(),
        row = $(".time-picker .months .container .month")
            .css("transform")
            .split(", ")[4],
        currentMonth = Math.ceil(
            Math.abs(
                row / $(".time-picker .months .container .month").width()
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
                $(".time-picker .years .arrow.prev").addClass("disabled");
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

            if (+$(".time-picker .days .day.selected").text() < day) {
                $(".time-picker .days .day.selected").removeClass("selected");

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
            $(".time-picker .years .year-input .year").val(currentYear + 1);

            $(".time-picker .years .arrow.disabled").removeClass("disabled");

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

        $(".time-picker .months .arrow.disabled").removeClass("disabled");

        $(`.time-picker .days .day.disabled`).removeClass("disabled");
    }

    let lastDay = new Date(
            $(".time-picker .years .year-input .year").val(),
            thisMonth,
            0
        ).getDate(),
        currentLastDay = +$(".time-picker .days .day:last-child").text();

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
