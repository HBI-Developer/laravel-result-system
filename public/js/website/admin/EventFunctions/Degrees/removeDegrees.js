import attentionShow from "../../../GeneralFunctions/attentionShow.js";
import refreshDegrees from "./refreshDegrees.js";

export default () => {
    $(".confirm").addClass("waiting");

    $(".wait-table").fadeIn();

    $(".wait-table").css("display", "flex");

    $.ajax({
        url: `${window.location.origin}/admin/degrees/delete/${currentId}`,
        method: "DELETE",
        error: () => {
            attentionShow(
                "حدث خطأ ما، أعد المحاولة بعد التحقق من اتصالك الشبكة"
            );
        },
        success: (result) => {
            if (result === "success") {
                attentionShow("تم حذف درجات الطالب بنجاح");

                refreshDegrees();
            } else if (result === "unexists") {
                attentionShow("هذه الدرجات ليس لها وجود");
            }
        },
        complete: (_) => {
            currentId = 0;

            $(".wait-table").fadeOut();

            $(".confirm").fadeOut(400, () => {
                $(".confirm").removeClass("waiting");
            });
        },
    });
};
