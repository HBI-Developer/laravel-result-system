import attentionShow from "../../../GeneralFunctions/attentionShow.js";

export default (e) => {
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

            year = !isNaN(parseInt(year))
                ? parseInt(year)
                : current.getFullYear();

            month = !isNaN(parseInt(month))
                ? parseInt(month)
                : current.getMonth() + 1;

            day = !isNaN(parseInt(day)) ? parseInt(day) : current.getDate();

            hour = !isNaN(parseInt(hour)) ? parseInt(hour) : "00";

            minute = !isNaN(parseInt(minute)) ? parseInt(minute) : "00";

            date = new Date(`${year}-${month}-${day} ${hour}:${minute}`);

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
};
