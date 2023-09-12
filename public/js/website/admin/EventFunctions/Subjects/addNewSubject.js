import refreshSubjects from "./refreshSubjects.js";
import attentionShow from "../../../GeneralFunctions/attentionShow.js";

export default async () => {
    $(this).addClass("waiting");

    $(".error").text("");

    $(".error").css("display", "none");

    let formData = new FormData(),
        operator = subjectId !== -1 ? "edit" : "create";

    for await (let input of $(".cover .inputs input")) {
        formData.append(input.name, input.value);
    }

    operator === "edit" ? formData.append("id", subjectId) : "";

    let lists = $(".cover .inputs .list-container .selected .name");

    for await (let input of lists) {
        let value = input.dataset.option ?? "";

        formData.append(input.parentElement.parentElement.classList[1], value);
    }

    $.ajax({
        url: `${window.location.origin}/admin/subjects/${operator}`,
        method: "POST",
        data: formData,
        cache: false,
        processType: false,
        processData: false,
        contentType: false,
        enctype: "multipart/form-data",
        error: (errors) => {
            if (errors.status === 422) {
                let errorsJson = JSON.parse(errors.responseText);

                $.each(errorsJson.errors, (input, error) => {
                    $(
                        `input[name="${input}"] + .error, list-container.${input} + .error`
                    )
                        .css("display", "block")
                        .text(error[0]);
                });
            }
        },
        success: (result) => {
            if (result == "success") {
                $(".cover").fadeOut(400, (_) => {
                    let message =
                        operator === "create"
                            ? "تم إضافة المقرر بنجاح"
                            : "تم تعديل بيانات المقرر بنجاح";

                    attentionShow(message);

                    $("body").css("overflow-y", "auto");

                    subjectId = -1;

                    refreshSubjects();
                });
            } else if (result === "unexists") {
                attentionShow("هذا المقرر غير موجود");
            }
        },
    });
};
