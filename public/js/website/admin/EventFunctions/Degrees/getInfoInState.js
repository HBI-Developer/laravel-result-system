export default function () {
    state = +$(this).attr("data-option");

    $(this)
        .parents(".list-container")
        .siblings(".wait-table")
        .css("display", "flex");

    let anyDegrees = $(this)
        .parents(".list-container")
        .parent()
        .hasClass("details-degrees")
        ? "details"
        : "final";

    $.ajax({
        url: `${window.location.origin}/admin/page/degrees/${anyDegrees}/${state}`,
        type: "POST",
        success: async (result) => {
            let removedSelector =
                anyDegrees === "details"
                    ? ".details-degrees .details .student, .details-degrees .details .nothing"
                    : ".final-degrees .degrees .student:not(.title), .final-degrees .degrees .degree:not(.title),.final-degrees .degrees .nothing";

            $(`.container ${removedSelector}`).remove();

            if (result.data.length) {
                if (anyDegrees === "details") {
                    for (let student of result.data) {
                        let degreesInfo = "";

                        for await (let degrees of student.degrees) {
                            degreesInfo += `
                                <div class="name">${degrees.subject.subject_name}</div>
                                <div class="value">${degrees.degree}%</div>
                            `;
                        }

                        $(".container .details-degrees .details").append(`
                            <div class="student" data-ssn="${student.ssn}">
                                <div class="info-name">
                                    <div class="open-arrow">&langle;</div>
                                    <div class="title">
                                        <div class="name">
                                            ${student.first_name} ${student.middle_name} ${student.last_name}
                                        </div>
                                        <div class="options">
                                            <div class="edit">
                                                <div class="icon edit-icon"></div>
                                            </div>
                                            <div class="delete">&minus;</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="info">
                                    ${degreesInfo}
                                </div>
                            </div>`);
                    }
                } else {
                    for (let student of result.data) {
                        $(".container .final-degrees .degrees").append(`
                            <div class="student">
                                ${student.first_name} ${student.middle_name} ${student.last_name}
                            </div>
                            <div class="degree">${student.degree}%</div>`);
                    }
                }
            } else {
                let nothing = `
                    <div class="nothing">
                        <div class="message">لا يوجد أي طلاب مسجلين حتى الآن</div>
                    </div>
                    `;

                anyDegrees === "details"
                    ? $(".container .details-degrees .details").append(nothing)
                    : $(".container .final-degrees .degrees").append(nothing);
            }

            $(
                `.container .${anyDegrees}-degrees .pagination, .container .${anyDegrees}-degrees .footer-table`
            ).remove();

            anyDegrees === "details"
                ? (lastDetailsPage = result.last_page)
                : (lastFinalPage = result.last_page);

            if (result.last_page > 1) {
                $(`.container .${anyDegrees}-degrees .add`).after(`
                    <div class="pagination">
                    <div class="prev disabled">&langle;</div>
                    <div class="pages">
                        <div class="current">1</div>
                        <span>/</span>
                        <div class="pages-number">${result.last_page}</div>
                    </div>
                    <div class="next">&rangle;</div>
                    </div>
                `);
            } else {
                $(`.container .${anyDegrees}-degrees .add`).after(`
                    <div class="footer-table"></div>
                `);
            }

            setTimeout((_) => {
                $(this)
                    .parents(".list-container")
                    .siblings(".wait-table")
                    .css("display", "none");
            }, 0);
        },
    });
}
