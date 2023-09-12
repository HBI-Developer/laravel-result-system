import refreshDegrees from "./refreshDegrees.js";
import firstStudentWithoutDegree from "./firstStudentWithoutDegree.js";
import attentionShow from "../../../GeneralFunctions/attentionShow.js";

export default async function () {
    $(this).addClass("waiting");

    $(".container .cover .add-degree .degrees .error").text("");

    $(".container .cover .add-degree .degrees .error").css("display", "none");

    let formData = new FormData(),
        degreesArray = {},
        operator = currentId === 0 ? "create" : "edit",
        ssn = $(".container .cover .add-degree .students .selected .name").attr(
            "data-option"
        );

    formData.append("student", ssn);

    for await (let input of $(
        ".container .cover .add-degree .degrees input.theDegree"
    )) {
        degreesArray[$(input).attr("data-id")] = $(input).val();
    }

    degreesArray = JSON.stringify(degreesArray);

    formData.append("degrees", degreesArray);

    $.ajax({
        url: `${window.location.origin}/admin/degrees/${operator}`,
        method: "POST",
        data: formData,
        cache: false,
        processType: false,
        processData: false,
        contentType: false,
        enctype: "multipart/form-data",
        error: (errors) => {
            if (errors.status === 422) {
                let error = errors.responseJSON.message,
                    studentError = errors.responseJSON.errors.student,
                    inputs = $(
                        ".container .cover .add-degree .degrees input.theDegree"
                    );

                if (studentError) {
                    $(".container .cover .add-degree .degrees .error")
                        .eq(0)
                        .text(studentError[0]);
                }

                if (error === "er100") {
                    inputs
                        .filter(function () {
                            return (
                                $(this).attr("data-id") === "" ||
                                $(this).attr("data-id") === undefined
                            );
                        })
                        .next(".error")
                        .text("لا يمكن أن يكون المعرّف فارغاً.");
                } else if (error === "er101") {
                    inputs
                        .filter(function () {
                            return isNaN(+$(this).attr("data-id"));
                        })
                        .next(".error")
                        .text("المعرّف الخاص بهذه المادة ليس رقماً.");
                } else if (error === "er102") {
                    inputs
                        .filter(function () {
                            return $(this).val().trim() === "";
                        })
                        .next(".error")
                        .text("لا يمكنك ترك هذه المادة من دون درجة.");
                } else if (error === "er103") {
                    inputs
                        .filter(function () {
                            return isNaN(+$(this).val().trim());
                        })
                        .next(".error")
                        .text("يجب أن تكون درجة المادة رقماً.");
                } else if (error === "er104") {
                    inputs
                        .filter(function () {
                            return $(this).val().trim() > 100;
                        })
                        .next(".error")
                        .text("لا يمكن أن تكون درجة المادة أكثر من 100.");
                } else if (error === "er105") {
                    inputs
                        .filter(function () {
                            return $(this).val().trim() < 0;
                        })
                        .next(".error")
                        .text("لا يمكن أن تكون درجة المادة أقل من 0.");
                } else if (!isNaN(+error)) {
                    $(
                        `.container .cover .add-degree .degrees input[data-id='${error}']`
                    )
                        .next(".error")
                        .text("هذه المادة غير موجودة.");
                }

                $(".container .cover .add-degree .degrees .error")
                    .filter(function () {
                        return $(this).text() !== "";
                    })
                    .css("display", "block");
            }
        },
        success: (result) => {
            if (result === "success") {
                $(".cover").fadeOut(400, () => {
                    if (operator === "create") {
                        $(
                            `.container .cover .add-degree .students .list .option[data-option='${ssn}']`
                        ).remove();
                    } else {
                        currentId = 0;
                    }

                    firstStudentWithoutDegree();

                    $("body").css("overflow-y", "auto");
                });

                let message =
                    operator === "create"
                        ? "تمت إضافة درجات الطالب بنجاح"
                        : "تم تعديل درجات الطالب بنجاح";

                attentionShow(message);

                refreshDegrees();
            }
        },
        complete: (_) => {
            $(this).removeClass("waiting");
        },
    });
}
