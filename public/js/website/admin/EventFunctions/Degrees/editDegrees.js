export default function () {
    if ($(".confirm").css("display") !== "none") return;

    currentId = +$(this).parents(".student").attr("data-ssn");

    $.ajax({
        url: `${window.location.origin}/admin/student/degrees/${currentId}`,
        method: "GET",
        success: async (result) => {
            let student = result[0];

            if (!$(".container .cover .add-degree .students").length) {
                $(".container .cover .add-degree .degrees").before(`
                <div class="select-input students list-container">
                    <div class="selected">
                        <div class="open-arrow">&langle;</div>
                        <div class="name" data-option=""></div>
                    </div>
                    <div class="list"></div>
                </div>
            `);
            }

            $(".container .cover .add-degree .students .selected .name").text(
                `${student.first_name} ${student.middle_name} ${student.last_name}`
            );

            $(".container .cover .add-degree .students .selected .name").attr(
                "data-option",
                student.ssn
            );

            $(".container .cover .add-degree .students").addClass("disabled");

            $(".container .cover .add-degree .degrees").empty();

            $(".container .cover .add-degree .degrees").append(
                `<div class="error"></div>`
            );

            for await (let degree of student.degrees) {
                $(".container .cover .add-degree .degrees").append(`
                <div class="label">${degree.subject.subject_name}</div>
                <input type="text" class="theDegree" data-id="${degree.subject_id}" value="${degree.degree}" />
                <div class="error"></div>
            `);
            }

            $(".cover").fadeIn();

            $("body").css("overflow", "hidden");
        },
    });
}
