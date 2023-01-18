
// That's JavaScript will be execute on admin homepage

$(() => { // when page be ready

    $("body").on(
        "click",
        ".container .sidebar .option.clock, .container>.option",
        () => {

            // When click clock logo in admin homepage fired this event

            // Get [year, month, day, hour, minute] properties from sessionStorage

            // @variable day contains day elements in .time-picker element

            let { year, month, day, hour, minute } = sessionStorage,
                current = new Date(),
                isDateExists,
                lastDay,
                days = $(".time-picker .days .day");

            // Check if this variables is not [undefined], and is anyone [undefined] take it default values

            year = +year ?? current.getFullYear();
            month = +month ?? current.getMonth() + 1;
            day = +day ?? current.getDate();
            hour = +hour ?? "00";
            minute = +minute ?? "00";

            // is date saving in variables [year, month, day, hour, minute] greater than current date

            isDateExists =
                new Date().getTime() <
                new Date(`${year}-${month}-${day} ${hour}:${minute}`).getTime();

            if (!isDateExists) {

                // If current date is greater than, assigning current date info to this variables

                year = current.getFullYear();
                month = current.getMonth() + 1;
                day = current.getDate();
                hour = "00";
                minute = "00";
            }

            // Put year value in year input

            $(".time-picker .years .year-input .year").val(year);

            // Put month value to month slider [By set translate value to slide it]

            $(".time-picker .months .container .month").css(
                "transform",
                `translateX(-${(month - 1) * 100}%)`
            );

            // Put hour & minute values in this inputs

            $(".time-picker .hours .hour").val(hour);
            $(".time-picker .hours .minute").val(minute);

            // @variable lastDay contains last day in (year, month) in (year, month) variables

            lastDay = new Date(year, month, 0).getDate();

            if (days.length > lastDay) {

                // If number of day elements greater than number of last day remove additional day elements

                days.filter(function () {
                    return +this.innerText > lastDay;
                }).remove();


            } else if (days.length < lastDay) {

                /*
                    If number of day elements less than number of last day add new day elements
                    with number of day elements plus [i] value
                */

                // @variable counter have diffrent between last day number and number of day elements

                let counter = lastDay - days.length;

                for (let i = 1; i <= counter; i++) {
                    $(".time-picker .days").append(
                        `<div class='day'>${days.length + i}</div>`
                    );
                }
            }

            setTimeout((_) => {

                // After all above commands end, execute...

                /*
                    get day element have same number in [day] variable and add .selected class to it, and
                    remove it from anyone has it
                */

                $(`.time-picker .days .day`).filter(function () {
                    return +this.innerText == day;
                })
                    .addClass("selected")
                    .siblings()
                    .removeClass("selected");


                if (year <= current.getFullYear()) {

                    // If year variable has value equals or less than current year

                    // Previous arrow for year will be disabled

                    $(".time-picker .years .arrow.prev").addClass("disabled");

                    // Put current year in year input

                    $(".time-picker .years .year-input .year").val(
                        current.getFullYear()
                    );

                    if (month - 1 <= current.getMonth()) {

                        /*
                            If month variable minus on [] has value equals or less than current month
                            [JavaScript getMonth return number of month minus one]
                        */

                        // Previous arrow for month will be disabled

                        $(".time-picker .months .arrow.prev").addClass(
                            "disabled"
                        );

                        // Get days previous current day and let this disabled

                        $(".time-picker .days .day")
                            .filter(function () {
                                return +this.innerText < current.getDate();
                            })
                            .addClass("disabled");


                        // Translate month slider to current month

                        $(".time-picker .months .container .month").css(
                            `transform`,
                            `translateX(-${current.getMonth() * 100}%)`
                        );

                    } else {

                        // If month in month variable greater than current month

                        // Remove disabled class from day elements if exist

                        $(".time-picker .days .day").removeClass("disabled");

                        // Remove disabled from previous arrow for month if exist

                        $(".time-picker .months .arrow.prev").removeClass(
                            "disabled"
                        );
                    }
                } else {

                    // If year in year variable greater than current year

                    // Remove disabled class from previous arrow from year if exist

                    $(".time-picker .years .arrow.prev").removeClass(
                        "disabled"
                    );

                    // Remove disabled class from day elements if exist

                    $(".time-picker .days .day").removeClass("disabled");

                    // Remove disabled from previous arrow for month if exist

                    $(".time-picker .months .arrow.prev").removeClass(
                        "disabled"
                    );
                }
            }, 0);

            setTimeout((_) => {

                // After all above commands execute

                // @variable updatingTime [in timePicker.js] will be true

                updatingTime = true;

                // Execute refreshOpenTime function [in timePicker.js]
                refreshOpenTime();

                // Shown cover that have time picker and set [display:flex] to it

                $(".cover").fadeIn();
                $(".cover").css("display", "flex");
            }, 1);
        }
    );


    $("body").on("click", ".cover", (e) => {

        // This event will fired when click on cover and not on time picker, to hide the cover

        //@variable startTop contains top side position for time picker in pixel
        //@variable endTop contains bottom side position for time picker in pixel
        //@variable startLeft contains left side position for time picker in pixel
        //@variable endLeft contains right side position for time picker in pixel

        let startTop = $(".cover .time-picker").position().top,
            endTop =
                $(".cover .time-picker").height() +
                $(".cover .time-picker").position().top,
            startLeft = $(".cover .time-picker").position().left,
            endLeft =
                $(".cover .time-picker").width() +
                $(".cover .time-picker").position().left;

        if (
            e.pageX < startLeft ||
            e.pageX > endLeft ||
            e.pageY < startTop ||
            e.pageY > endTop
        ) {

            /*
                If mouse cursor click in position higher of top side or under bottom side or right to right
                side or left to left side [Out of time picker]
            */

            // hide time picker

            $(".cover .time-picker").fadeOut(400, (_) => {

                // After hide time picker

                // Shown wait element

                $(".cover .wait").fadeIn();
                $(".cover .wait").css("display", "flex");

                // Get [year, month, day, hour, minute] properties from sessionStorage
                // exists to check if one at least from this variables is not undefined

                let { year, month, day, hour, minute } = sessionStorage,
                    date = 0;


                // Check if this variables is not [undefined], and is anyone [undefined] take it default values

                year = +year ?? current.getFullYear();
                month = +month ?? current.getMonth() + 1;
                day = +day ?? current.getDate();
                hour = +hour ?? "00";
                minute = +minute ?? "00";

                // put in date variable current date

                date = new Date(
                        `${year}-${month}-${day} ${hour}:${minute}`
                    );
                 

                // Send ajax request by (POST) method with (date) value

                // @void save new date in DB

                $.ajax({
                    url: `${window.location.origin}/admin/put-show-date/${date}`,
                    method: "POST",
                    error: (errors) => {

                        /*
                            If ajax request fails print next message on screen by (attenionShow) function
                            [in general.js]
                        */

                        attentionShow(
                            "حدث خطأ ما ولم يتم حفظ الوقت، الرجاء المحاولة مرة أخرى"
                        );
                    },
                    success: (result) => {

                        /*
                            If ajax request success
                        */

                        if (result === "success") {

                            // If respone was success value print next message on screen by attentionShow function

                            attentionShow("تم تجديد موعد عرض الدرجات بنجاح");
                        }
                    },
                    complete: (_) => {

                        // After ajax complete hide cover element

                        $(".cover").fadeOut(400, (_) => {

                            // After hide cover element put [display:block] to time picker and hide wait element

                            $(".cover .time-picker").css("display", "block");
                            $(".cover .wait").css("display", "none");
                        });
                    },
                });
            });
        }
    });
});
