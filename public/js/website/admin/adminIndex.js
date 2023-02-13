$(() => {

    $("body").on(
        "click",
        ".container .sidebar .option.clock, .container>.option",
        () => {

            let { year, month, day, hour, minute } = sessionStorage,
                current = new Date(),
                isDateExists,
                lastDay,
                days = $(".time-picker .days .day");

            year = !isNaN(parseInt(year)) ? parseInt(year) : current.getFullYear();

            month = !isNaN(parseInt(month)) ? parseInt(month) : current.getMonth() + 1;

            day = !isNaN(parseInt(day)) ? parseInt(day) : current.getDate();

            hour = !isNaN(parseInt(hour)) ? parseInt(hour) : "00";

            minute = !isNaN(parseInt(minute)) ? parseInt(minute) : "00";

            $(".time-picker .years .year-input .year").val(year);

            $(".time-picker .months .container .month").css(
                "transform",
                `translateX(-${(month - 1) * 100}%)`
            );

            $(".time-picker .hours .hour").val(hour);

            $(".time-picker .hours .minute").val(minute);

            lastDay = new Date(year, month, 0).getDate();

            if (days.length > lastDay) {

                days.filter(function () {
                    return +this.innerText > lastDay;
                }).remove();

            } else if (days.length < lastDay) {

                let counter = lastDay - days.length;

                for (let i = 1; i <= counter; i++) {

                    $(".time-picker .days").append(
                        `<div class='day'>${days.length + i}</div>`
                    );

                }

            }

            setTimeout((_) => {

                $(`.time-picker .days .day`).filter(function () {
                    return +this.innerText == day;
                })
                    .addClass("selected")
                    .siblings()
                    .removeClass("selected");


                if (year <= current.getFullYear()) {

                    $(".time-picker .years .arrow.prev").addClass("disabled");

                    $(".time-picker .years .year-input .year").val(
                        current.getFullYear()
                    );

                    if (month - 1 <= current.getMonth()) {

                        $(".time-picker .months .arrow.prev").addClass(
                            "disabled"
                        );

                        $(".time-picker .days .day")
                            .filter(function () {
                                return +this.innerText < current.getDate();
                            })
                            .addClass("disabled");

                        $(".time-picker .months .container .month").css(
                            `transform`,
                            `translateX(-${current.getMonth() * 100}%)`
                        );

                    } else {

                        $(".time-picker .days .day").removeClass("disabled");

                        $(".time-picker .months .arrow.prev").removeClass(
                            "disabled"
                        );

                    }

                } else {

                    $(".time-picker .years .arrow.prev").removeClass(
                        "disabled"
                    );

                    $(".time-picker .days .day").removeClass("disabled");

                    $(".time-picker .months .arrow.prev").removeClass(
                        "disabled"
                    );

                }

            }, 0);

            setTimeout((_) => {

                updatingTime = true;

                refreshOpenTime();

                $(".cover").fadeIn();

                $(".cover").css("display", "flex");

            }, 1);

        }

    );

    $("body").on("click", ".cover", (e) => {

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

            $(".cover .time-picker").fadeOut(400, (_) => {

                $(".cover .wait").fadeIn();

                $(".cover .wait").css("display", "flex");

                let { year, month, day, hour, minute } = sessionStorage,
                    date = 0;

                year = !isNaN(parseInt(year)) ? parseInt(year) : current.getFullYear();

                month = !isNaN(parseInt(month)) ? parseInt(month) : current.getMonth() + 1;
    
                day = !isNaN(parseInt(day)) ? parseInt(day) : current.getDate();
    
                hour = !isNaN(parseInt(hour)) ? parseInt(hour) : "00";
    
                minute = !isNaN(parseInt(minute)) ? parseInt(minute) : "00";

                date = new Date(
                        `${year}-${month}-${day} ${hour}:${minute}`
                    );

                $.ajax({
                    url: `${window.location.origin}/admin/put-show-date/${date}`,
                    method: "POST",
                    error: () => {

                        attentionShow(
                            "حدث خطأ ما ولم يتم حفظ الوقت، الرجاء المحاولة مرة أخرى"
                        );

                    },
                    success: (result) => {

                        if (result === "success") {

                            attentionShow("تم تجديد موعد عرض الدرجات بنجاح");

                        }
                    },
                    complete: (_) => {

                        $(".cover").fadeOut(400, (_) => {

                            $(".cover .time-picker").css("display", "block");

                            $(".cover .wait").css("display", "none");

                        });

                    },

                });

            });

        }

    });
    
});
