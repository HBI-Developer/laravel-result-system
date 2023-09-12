export default function () {
    let page = 1,
        currentPage = +$(this).siblings(".pages").children(".current").text(),
        state = +$(this)
            .parent()
            .siblings(".list-container")
            .children(".selected")
            .children(".name")
            .attr("data-option"),
        isNext = $(this).hasClass("next") ?? false,
        anyDegrees = $(this)
            .parents(".pagination")
            .parent()
            .hasClass("details-degrees")
            ? "details"
            : "final",
        lastPage = anyDegrees === "details" ? lastDetailsPage : lastFinalPage;

    $(this)
        .parents(".pagination")
        .siblings(".wait-table")
        .css("display", "flex");

    if (currentPage <= 1 && !isNext) {
        page = 1;
    } else if (currentPage >= lastPage && isNext) {
        page = lastPage;
    } else {
        page = isNext ? currentPage + 1 : currentPage - 1;
    }

    if (page >= 1 && page <= lastPage) {
        $.ajax({
            url: `${window.location.origin}/admin/page/degrees/${anyDegrees}/${state}?page=${page}`,
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
                        ? $(".container .details-degrees .details").append(
                              nothing
                          )
                        : $(".container .final-degrees .degrees").append(
                              nothing
                          );
                }

                if (page === 1) {
                    $(
                        `.container .${anyDegrees}-degrees .pagination .prev`
                    ).addClass("disabled");
                } else {
                    $(
                        `.container .${anyDegrees}-degrees .pagination .prev`
                    ).removeClass("disabled");
                }

                if (page === lastPage) {
                    $(
                        `.container .${anyDegrees}-degrees .pagination .next`
                    ).addClass("disabled");
                } else {
                    $(
                        `.container .${anyDegrees}-degrees .pagination .next`
                    ).removeClass("disabled");
                }

                $(
                    `.container .${anyDegrees}-degrees .pagination .pages > .current`
                ).text(page);

                setTimeout(() => {
                    $(this)
                        .parents(".pagination")
                        .siblings(".wait-table")
                        .css("display", "none");
                }, 0);
            },
        });
    } else {
        $(this)
            .parents(".pagination")
            .siblings(".wait-table")
            .css("display", "none");
    }
}
