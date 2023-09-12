import refreshStudents from "./refreshStudents.js";
import attentionShow from "../../../GeneralFunctions/attentionShow.js";

export default (_) => {
    $(".confirm").addClass("waiting");

    $.ajax({
        url: `${window.location.origin}/admin/students/delete/${currentId}`,
        method: "DELETE",
        error: () => {
            attentionShow(
                "حدث خطأ ما، أعد المحاولة بعد التحقق من اتصالك الشبكة"
            );
        },
        success: (result) => {
            if (result === "success") {
                attentionShow("تم حذف الطالب بنجاح");

                refreshStudents();
            } else if (result === "unexists") {
                attentionShow("هذا الطالب غير موجود");
            }
        },
        complete: (_) => {
            currentId = 0;

            $(".confirm").fadeOut(400, () => {
                $(".confirm").removeClass("waiting");
            });
        },
    });
};
