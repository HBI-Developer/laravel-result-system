import getSubjects from "./getSubjects.js";

export default () => {
    let student = $(".container .cover .add-degree .students .list .option").eq(
            0
        ),
        major = student.attr("data-major");

    if (student.length) {
        $(".container .cover .add-degree .students .selected .name").text(
            student.text()
        );

        $(".container .cover .add-degree .students .selected .name").attr(
            "data-option",
            student.attr("data-option")
        );

        $(".container .cover .add-degree .students").removeClass("disabled");

        getSubjects(major);
    } else {
        $(`.container .cover .add-degree .students`).remove();

        $(`.container .cover .add-degree .degrees`).html(`
            <div class="nothing">لقد تم وضع الدرجات لجميع الطلاب المسجلين في النظام حتى الآن</div>
        `);
    }
};
