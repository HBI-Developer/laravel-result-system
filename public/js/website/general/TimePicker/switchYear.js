import refreshOpenTime from "./refreshOpenTime.js";

export default function () {
    updatingTime = false;

    let currentYear = +$(".time-picker .years .year-input .year").val(),
        row = $(".time-picker .months .container .month")
            .css("transform")
            .split(", ")[4],
        currentMonth = Math.ceil(
            Math.abs(row / $(".time-picker .months .container .month").width())
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
                $(".time-picker .years .year-input .year:last-child").remove();
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
                $(".time-picker .years .year-input .year:last-child").remove();
            }
        );

        $(".time-picker .years .arrow.disabled").removeClass("disabled");
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
                $(".time-picker .days .day.selected").removeClass("selected");

                $(`.time-picker .days .day`)
                    .filter((someday) => {
                        return someday + 1 == day;
                    })
                    .addClass("selected");
            }

            thisMonth = new Date().getMonth() + 1;

            sessionStorage.setItem("month", thisMonth);
        } else {
            $(".time-picker .months .arrow.disabled").removeClass("disabled");

            $(".time-picker .days .day.disabled").removeClass("disabled");
        }
    } else if (
        +$(".time-picker .years .year-input .year").val() >
        new Date().getFullYear()
    ) {
        $(".time-picker .months .arrow.disabled").removeClass("disabled");

        $(".time-picker .days .day.disabled").removeClass("disabled");
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

        updatingTime = true;

        refreshOpenTime();
    }, 0);
}
