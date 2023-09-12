import attentionShow from "../../../GeneralFunctions/attentionShow.js";
import refreshStudents from "./refreshStudents.js";

export default async function () {
    $(this).addClass("waiting");

    $(".error").text("");

    $(".error").css("display", "none");

    let formData = new FormData(),
        operation = currentId == 0 ? "create" : "edit";

    for await (let input of $(".cover .student-inputs .inputs input")) {
        formData.append(input.name, input.value);
    }

    let lists = $(
        ".cover .student-inputs .inputs .select-input .selected .name"
    );

    for await (let input of lists) {
        let value = input.dataset.option ?? "";

        formData.append(input.parentElement.parentElement.classList[1], value);
    }

    if (currentId !== 0) {
        formData.set(
            $(".cover .student-inputs .inputs .ssn").attr("name"),
            currentId
        );
    }

    $.ajax({
        url: `${window.location.origin}/admin/students/${operation}`,
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
            if (result === "success") {
                $(".cover").fadeOut(400, (_) => {
                    let message =
                        operation == "create"
                            ? "تمت إضافة طالب جديد بنجاح."
                            : "تم تعديل بيانات الطالب بنجاح. ";

                    attentionShow(message);

                    $("body").css("overflow-y", "auto");
                });

                refreshStudents();
            } else if (result === "unexists") {
                attentionShow("هذا الطالب غير موجود");
            } else if (typeof result === "object") {
                $.each(result, (input, error) => {
                    $(
                        `input[name="${input}"] + .error, list-container.${input} + .error`
                    )
                        .css("display", "block")
                        .text(error[0]);
                });
            }
        },
        complete: (_) => {
            $(this).removeClass("waiting");
        },
    });
}
