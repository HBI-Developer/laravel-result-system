// @variable updatingTime use with refreshOpenTime to update open time or not

let updatingTime = false,

    // @function refreshOpenTime to update open time and based on sessionStorage

    refreshOpenTime = (_) => {
        // Get (year, month, day, hour, minute) from sessionStorage

        let { year, month, day, hour, minute } = sessionStorage;

        // Check if that variable equals undefined, if undefined set default value

        year = year ?? new Date().getFullYear();
        month = month - 1 ?? new Date().getMonth();
        day = day ?? new Date().getDate();
        hour = hour ?? 0;
        minute = minute ?? 0;

        // @variable openTime contains time until date saving in sessionStorage
        // @variable diffrent contains time between openTime and current time by [days, hours, minutes, seconds]
        // @variable timeFormat contains diffrent in simple template

        let openTime = new Date(year, month, day, hour, minute).getTime(),
            diffrent = diffrentFromNow(openTime, true),
            timeFormat = `${diffrent[0]}:${diffrent[1]}:${diffrent[2]}:${diffrent[3]}`;

        // Put timeFormat in counter int time picker element

        $(".time-picker .until-open > .counter").text(timeFormat);

        setTimeout((_) => {
            // After above commands end

            if (updatingTime && diffrent !== 0) {
                // If diffrent not equals 0 and updatingTime is true

                // Recursion

                refreshOpenTime();
            } else {
                // Else assigning false to updatingTime

                updatingTime = false;
            }
        }, 0);
    };

$(window).on("load", () => {
    // while page loading

    // Ajax request by (GET) method

    // @return time to open system for studetn from DB
    $.ajax({
        url: `${window.location.origin}/get-show-date`,
        method: "GET",
        error: (errors) => {
            // If ajax request fails
        },
        success: (result) => {
            // If ajax request success

            // @variable number have time by milliseconds

            let number = +result[0].value;

            if (!isNaN(number) && number > 0) {
                // If number is number [Result return is number not object or else] and greater than 0

                // @variable date contains number from DB as date

                let date = new Date(number),
                    currentDate;

                // currentDate contains date value if date minus current date greater than 0 else put current date

                currentDate = date - new Date() > 0 ? date : new Date();

                // Put this date in sessionStorage in [year, month, day, hour, minute] properties

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
    // When page is ready
    $("body").on("keydown", "input[type='number']", function (ev) {
        // Fired when press button in keyboard in number input

        if (ev.key.toUpperCase() === "E") {
            // If pressing key is (E) [in upper case]

            // Don't add this letter to number input

            ev.preventDefault();
        }
    });

    $("body").on(
        "click",
        ".time-picker .years .arrow:not(.disabled)",
        function () {
            // Fired when click arrow [previous or next] that doesn't disabled in year input

            // updatingTime equals false [for stop refreshTime function if it execute]

            updatingTime = false;

            // @variable currentYear contains yaer in year input
            // @variable row contains translateX in month in month slider
            // @variable currentMonth contains month number in month slider from row and with of month in month slider
            // @variable thisMonth contains contains currentMonth plus 1 [Actual month number]

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
                // If clicking arrow is previous arrow

                // Add year input before this input contains currentYear minus 1 as value

                $(".time-picker .years .year-input").prepend(`
                    <input type="number" class="year" style="width: 0; padding: 0" min="${new Date().getFullYear()}" value="${
                    currentYear - 1
                }">`);

                // Move new input to place of old input with animation

                $(".time-picker .years .year-input .year:first-child").animate(
                    {
                        width: "100%",
                        padding: "5px 10px",
                    },
                    50,
                    () => {
                        // After animation is end remove old input

                        $(
                            ".time-picker .years .year-input .year:last-child"
                        ).remove();
                    }
                );

                if (currentYear - 1 == new Date().getFullYear()) {
                    // If current year minus 1 equals current year put disabled class on previous arrow

                    $(".time-picker .years .arrow.prev").addClass("disabled");
                }
            } else {
                // If clicking arrow is next arrow

                // Add year input before this input contains currentYear plus 1 as value

                $(".time-picker .years .year-input").prepend(`
                    <input type="number" class="year" style="width: 0; padding: 0" min="${new Date().getFullYear()}" value="${
                    currentYear + 1
                }">`);

                // Move new input to place of old input with animation

                $(".time-picker .years .year-input .year:first-child").animate(
                    {
                        width: "100%",
                        padding: "5px 10px",
                    },
                    50,
                    () => {
                        // After animation is end remove old input

                        $(
                            ".time-picker .years .year-input .year:last-child"
                        ).remove();
                    }
                );

                // Remove disabled class from previous arrow

                $(".time-picker .years .arrow.disabled").removeClass(
                    "disabled"
                );
            }

            if (
                +$(".time-picker .years .year-input .year").val() <=
                new Date().getFullYear()
            ) {
                // If value in new input year equals or less than current year

                // Set value of current year in year input

                $(".time-picker .years .year-input .year").val(
                    new Date().getFullYear()
                );

                if (currentMonth <= new Date().getMonth() + 1) {
                    // If value of currentMonth equals or less than getMonth plus 1 [ currentMonth equals current month or less ]

                    // @variable day contains number of current day in current month

                    let day = new Date().getDate();

                    // Move month slider to current month

                    $(".time-picker .months .container .month").css(
                        "transform",
                        `translateX(-${new Date().getMonth() * 100}%)`
                    );

                    // Add disabled to previous arrow in month slider

                    $(".time-picker .months .arrow.prev").addClass("disabled");

                    // Get all day before current day and add disabled class to it

                    $(`.time-picker .days .day`)
                        .filter((someday) => {
                            return someday + 1 < day;
                        })
                        .addClass("disabled");

                    if (+$(".time-picker .days .day.selected").text() < day) {
                        // If number of selected day less current day in month

                        // remove class selected from it

                        $(".time-picker .days .day.selected").removeClass(
                            "selected"
                        );

                        // Add to current day selected class

                        $(`.time-picker .days .day`)
                            .filter((someday) => {
                                return someday + 1 == day;
                            })
                            .addClass("selected");
                    }

                    // Assign current month number to thisMonth and set it in month property in sessionStorage

                    thisMonth = new Date().getMonth() + 1;
                    sessionStorage.setItem("month", thisMonth);
                } else {
                    // If currentMonth number is greater than current month

                    // remove disabled class from previous arrow in month slider

                    $(".time-picker .months .arrow.disabled").removeClass(
                        "disabled"
                    );

                    // Remove disabled class from day elements that's have it

                    $(".time-picker .days .day.disabled").removeClass(
                        "disabled"
                    );
                }
            } else if (
                +$(".time-picker .years .year-input .year").val() >
                new Date().getFullYear()
            ) {
                // If value in year input greater than current year

                // remove disabled class from previous arrow in month slider

                $(".time-picker .months .arrow.disabled").removeClass(
                    "disabled"
                );

                // Remove disabled class from day elements that's have it

                $(".time-picker .days .day.disabled").removeClass("disabled");
            }

            // @variable lastDay contains last day from this month
            // @variable currentLastDay contains number of last day exist now in time picker

            let lastDay = new Date(
                    $(".time-picker .years .year-input .year").val(),
                    thisMonth,
                    0
                ).getDate(),
                currentLastDay = +$(
                    ".time-picker .days .day:last-child"
                ).text();

            if (currentLastDay > lastDay) {
                // If number number of last day exist now in time picker greater than last day from this month

                // Remove any day this number after last day from this month

                $(`.time-picker .days .day`)
                    .filter((someday) => {
                        return someday + 1 > lastDay;
                    })
                    .remove();
            } else if (currentLastDay < lastDay) {
                // If number number of last day exist now in time picker less than last day from this month

                // Add day until number of last day from this month

                for (let i = currentLastDay + 1; i <= lastDay; i++) {
                    $(".time-picker .days").append(`
                        <div class="day">${i}</div>
                    `);
                }
            }

            if ($(".time-picker .days .day.selected").length === 0) {
                // If number of selected day is 0 [There's not selected day in time picker]

                // Selected last day in time picker

                $(".time-picker .days .day:last-child").addClass("selected");
            }

            setTimeout(() => {
                // After all above commands end

                // Set value in year input in year property in sessionStorage

                sessionStorage.setItem(
                    "year",
                    $(".time-picker .years .year-input .year").val()
                );

                // Assign true to updatingTime

                updatingTime = true;

                // Execute refreshOpenTime function

                refreshOpenTime();
            }, 0);
        }
    );

    $("body").on(
        "change",
        ".time-picker .years .year-input .year",
        function () {
            // Fired when change number in year input

            // updatingTime equals false [for stop refreshTime function if it execute]

            updatingTime = false;

            // @variable thisNumber contains the number in year input
            // @variable currentYear contains number of current year
            // @variable row contains translateX in month in month slider
            // @variable currentMonth contains month number in month slider from row and with of month in month slider
            // @variable thisMonth contains contains currentMonth plus 1 [Actual month number]

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
                // If this number equals or less than current year

                // add disabled class to previous arrow and set current year in year input

                $(".time-picker .years .arrow.prev").addClass("disabled");

                $(this).val(currentYear);


                if (currentMonth <= new Date().getMonth() + 1) {

                    // If currentMonth equals or less than current month

                    // @vairable day contains current day in current month

                    let day = new Date().getDate();

                    // Move month slider to current month

                    $(".time-picker .months .container .month").css(
                        "transform",
                        `translateX(-${new Date().getMonth() * 100}%)`
                    );

                    // Add disabled to previous arrow in month slider

                    $(".time-picker .months .arrow.prev").addClass("disabled");

                    // Get all day before current day and add disabled class to it

                    $(`.time-picker .days .day`)
                        .filter((someday) => {
                            return someday + 1 < day;
                        })
                        .addClass("disabled");
                        

                    if (
                        +$(".time-picker .days .day.selected").text() <
                        day
                    ) {

                        // If selected day number is less than current day number

                        // Remove seleted class from this day

                        $(".time-picker .days .day.selected").removeClass(
                            "selected"
                        );

                        // add selected class to current day

                        $(`.time-picker .days .day`)
                            .filter((someday) => {
                                return someday + 1 == day;
                            })
                            .addClass("selected");
                    }

                    // Set number of current month to thisMonth

                    // Set thisMonth value in month property in sessionStorage

                    thisMonth = new Date().getMonth() + 1;
                    sessionStorage.setItem("month", thisMonth);

                } else {

                    // If currentMonth greater than current month

                    // Remove disabled class from previous arrow in month slider

                    $(".time-picker .months .arrow.disabled").removeClass(
                        "disabled"
                    );

                    // Remove disabled class from day elements that's have it

                    $(".time-picker .days .day.disabled").removeClass(
                        "disabled"
                    );
                }
            } else if (thisNumber > currentYear) {
                // If this number greater than current year

                // Remove disabled class from previous arrow in year input

                $(".time-picker .years .arrow.disabled").removeClass(
                    "disabled"
                );

                // Remove disabled class from previous arrow in month slider

                $(".time-picker .months .arrow.disabled").removeClass(
                    "disabled"
                );

                // Remove disabled class from day elements that's have it

                $(".time-picker .days .day.disabled").removeClass("disabled");
            }

            // @variable lastDay contains number of last day in current month
            // @variable currentLastDay contains number of last day exist in time picker

            let lastDay = new Date(
                    $(".time-picker .years .year-input .year").val(),
                    thisMonth,
                    0
                ).getDate(),
                currentLastDay = +$(
                    ".time-picker .days .day:last-child"
                ).text();

            if (currentLastDay > lastDay) {

                // If number of last day exist in time picker greater than number of last day in current month

                // Remove all day elements that's have number greater than number of last day in current month

                $(`.time-picker .days .day`)
                    .filter((someday) => {
                        return someday + 1 > lastDay;
                    })
                    .remove();

            } else if (currentLastDay < lastDay) {

                // If number of last day exist in time picker less than number of last day in current month

                // Add day elements until last day in current month

                for (let i = currentLastDay + 1; i <= lastDay; i++) {
                    $(".time-picker .days").append(`
                        <div class="day">${i}</div>
                    `);
                }
            }

            if ($(".time-picker .days .day.selected").length === 0) {

                // If there's not selected day element in time picker

                // Add selected class to last day element

                $(".time-picker .days .day:last-child").addClass("selected");
            }

            // Set number in year input to year property in sessionStorage

            sessionStorage.setItem(
                "year",
                $(".time-picker .years .year-input .year").val()
            );

            // Assigning true to updatingTime

            updatingTime = true;

            // Execute refreshOpenTime function

            refreshOpenTime();
        }
    );

    $("body").on(
        "click",
        ".time-picker .months .arrow:not(.disabled)",
        function () {

            // Fired when click arrow [previous or next] that doesn't disabled in month input

            // updatingTime equals false [for stop refreshTime function if it execute]

            updatingTime = false;

            // @variable currentYear contains number of current year
            // @variable row contains translateX in month in month slider
            // @variable currentMonth contains month number in month slider from row and with of month in month slider
            // @variable thisMonth contains contains currentMonth plus 1 [Actual month number]

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

                // If clicking arrow is previous arrow

                if (currentMonth === 1) {

                    // If number in month slider equal 1

                    // minus 1 from currentYear

                    currentYear--;

                    // Move month slider to last month

                    $(".time-picker .months .container .month").css(
                        "transform",
                        `translateX(-${11 * 100}%)`
                    );

                    // Set value of currentYear in year input

                    $(".time-picker .years .year-input .year").val(currentYear);


                    if (currentYear == new Date().getFullYear()) {

                        // If currentYear value equals current year

                        // add disabled class to previous arrow in year input

                        $(".time-picker .years .arrow.prev").addClass(
                            "disabled"
                        );
                    }

                    // Set 12 to thisMonth variable

                    thisMonth = 12;
                } else {

                    // If number in month slider greater than 1

                    // Move month slider to this month

                    $(".time-picker .months .container .month").css(
                        "transform",
                        `translateX(-${(currentMonth - 2) * 100}%)`
                    );

                    // This month equals currentMonth minus 1

                    thisMonth = currentMonth - 1;
                }


                if (
                    currentYear == new Date().getFullYear() &&
                    thisMonth == new Date().getMonth() + 1
                ) {

                    // If currentYear equal current year and thisMonth equal current month

                    // @variable day contains number of this day

                    let day = new Date().getDate();

                    // Add disabled class to previous arrow in month slider

                    $(".time-picker .months .arrow.prev").addClass("disabled");

                    if (
                        +$(".time-picker .days .day.selected").text() <
                        day
                    ) {

                        // If number of selected day less than current day

                        // Remove selected class from this day

                        $(".time-picker .days .day.selected").removeClass(
                            "selected"
                        );

                        // Add selected calss to day element have number of current day

                        $(`.time-picker .days .day`)
                            .filter((someday) => {
                                return someday + 1 == day;
                            })
                            .addClass("selected");
                    }

                    // Add disabled class to all day elements have number less than number of current day

                    $(`.time-picker .days .day`)
                        .filter((someday) => {
                            return someday + 1 < day;
                        })
                        .addClass("disabled");
                }
            } else {

                // If clicking arrow is next arrow

                if (currentMonth == 12) {

                    // If current Month have number of last month

                    // Set currentYear plus 1 to year input

                    $(".time-picker .years .year-input .year").val(
                        currentYear + 1
                    );

                    // Remove disabled class from previous arrow in year input

                    $(".time-picker .years .arrow.disabled").removeClass(
                        "disabled"
                    );

                    // Move month slider to first month

                    $(".time-picker .months .container .month").css(
                        "transform",
                        `translateX(0)`
                    );

                    // Set 1 to thisMonth variable

                    thisMonth = 1;
                } else {

                    // If curentMonth less than number of last month

                    // Move month slider to certain month

                    $(".time-picker .months .container .month").css(
                        "transform",
                        `translateX(-${currentMonth * 100}%)`
                    );

                    // Assign currentMonth value plus 1 to thisMonth

                    thisMonth = currentMonth + 1;
                }

                // Remove disabled class from previous arrow in month slider

                $(".time-picker .months .arrow.disabled").removeClass(
                    "disabled"
                );

                // Remove disabled class from day elements have it

                $(`.time-picker .days .day.disabled`).removeClass("disabled");
            }

            // @variable lastDay contains number of last day in this month
            // @variable currentLastDay contains number of last day exist in time picker

            let lastDay = new Date(
                    $(".time-picker .years .year-input .year").val(),
                    thisMonth,
                    0
                ).getDate(),
                currentLastDay = +$(
                    ".time-picker .days .day:last-child"
                ).text();

            if (currentLastDay > lastDay) {

                // If number of last day exist in time picker greater than number of last day in this month

                // Remove all day that has number greater than number of last day

                $(`.time-picker .days .day`)
                    .filter((someday) => {
                        return someday + 1 > lastDay;
                    })
                    .remove();

            } else if (currentLastDay < lastDay) {

                // If number of last day exist in time picker less than number of last day in this month

                // Add day elements until number of current day

                for (let i = currentLastDay + 1; i <= lastDay; i++) {
                    $(".time-picker .days").append(`
                        <div class="day">${i}</div>
                    `);
                }
            }
            

            if ($(".time-picker .days .day.selected").length === 0) {

                // If number of day elements has selected class is 0

                // Add selected class to last day element

                $(".time-picker .days .day:last-child").addClass("selected");
            }

            setTimeout(() => {

                // After all commands above end

                // Set value in year input to year property in sessionStorage

                sessionStorage.setItem(
                    "year",
                    $(".time-picker .years .year-input .year").val()
                );

                // Set value in thisMonth to month property in sessionStorage

                sessionStorage.setItem("month", thisMonth);

                // Assigning true to updatingTime

                updatingTime = true;

                // Execute refreshOpenTime function

                refreshOpenTime();
            }, 0);
        }
    );

    $("body").on(
        "click",
        ".time-picker .days .day:not(.disabled):not(.selected)",
        function () {

            // Fired when click on day element don't has disabled or selected classes

            // Assigning false to updatingTime

            updatingTime = false;

            // Add selected class to this element and remove selected class from siblings elements 

            $(this).addClass("selected").siblings().removeClass("selected");

            // Set number of this day to day property in sessionStorage

            sessionStorage.setItem(
                "day",
                $(this).text()
            );

            // Assigning true to updatingTime

            updatingTime = true;

            // Execute refreshOpenTime function

            refreshOpenTime();
        }
    );

    $("body").on(
        "change",
        ".time-picker .hours input[type=number]",
        function () {

            // Fired when change value in hours or minutes input

            // Assigning false to updatingTime

            updatingTime = false;

            // @variable hour contains value in this input

            let time = $(this).val();
            

            if ($(this).hasClass("hour")) {

                // If this input has class hour

                // Set time value to hour property in sessionStorage

                sessionStorage.setItem("hour", time);
            } else if ($(this).hasClass("minute")) {

                // If this input has class minute

                // Set time value to minute property in sessionStorage

                sessionStorage.setItem("minute", time);
            }

            // Assigning true to updatingTime

            updatingTime = true;

            // Execute refreshOpenTime function

            refreshOpenTime();
        }
    );

    $("body").on("click", ".time-picker .reset-time", () => {

        // Fired when click reset button in time picker

        // Assigning false to updatingTime

        updatingTime = false;

        // @variable today contains date for today

        let today = new Date();

        // Assign this date info to [year, month, day, hour, minute] properties in sessionStorage

        sessionStorage.setItem("year", today.getFullYear());
        sessionStorage.setItem("month", today.getMonth() + 1);
        sessionStorage.setItem("day", today.getDate());
        sessionStorage.setItem("hour", "00");
        sessionStorage.setItem("minute", "00");

        // Set year value in today to year input

        $(".time-picker .years .year-input .year").val(today.getFullYear());

        // Add disabled class to previous arrow in year input

        $(".time-picker .years .arrow.prev").addClass("disabled");

        // Move month slider to month in today

        $(".time-picker .months .container .month").css(
            "transform",
            `translateX(-${today.getMonth() * 100}%)`
        );

        // Add disabled class to previous arrow in month slider

        $(".time-picker .months .arrow.prev").addClass("disabled");

        // Add class selected to today and remove from siblings day elements

        $(`.time-picker .days .day`)
        .filter((someday) => {
                return someday + 1 === today.getDate();
            })
            .addClass("selected")
            .siblings()
            .removeClass("selected");
            
        // Add class disabled to any day before today

        $(`.time-picker .days .day`)
            .filter((someday) => {
                return someday + 1 < today.getDate();
            })
            .addClass("disabled");

        // Assings 00 to hour and minute inputs

        $(".time-picker .hours .hour").val("00");
        $(".time-picker .hours .minute").val("00");
    });
});
