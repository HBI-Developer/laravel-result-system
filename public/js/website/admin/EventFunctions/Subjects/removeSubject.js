import refreshSubjects from "./refreshSubjects.js";
import attentionShow from "../../../GeneralFunctions/attentionShow.js";

export default () => {
    $(".confirm").addClass("waiting");

    $.ajax({
        url: `${window.location.origin}/admin/subjects/delete/${subjectId}`,
        method: "DELETE",
        error: () => {
            attentionShow(
                "حدث خطأ ما، أعد المحاولة بعد التحقق من اتصالك الشبكة"
            );
        },
        success: (results) => {
            if (results == "success") {
                attentionShow("تم حذف المقرر بنجاح");

                refreshSubjects();
            } else if (result === "unexists") {
                attentionShow("هذا المقرر غير موجود");
            }
        },
        complete: (_) => {
            subjectId = -1;

            $(".confirm").fadeOut(400, () => {
                $(".confirm").removeClass("waiting");
            });
        },
    });
};
