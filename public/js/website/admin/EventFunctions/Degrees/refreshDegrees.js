export default () => {
    $(".wait-table").fadeIn();

    $(".wait-table").css("display", "flex");

    let currentDetailsPage = +$(
            ".container .details-degrees .pagination .pages > .current"
        ).text(),
        currentFinalPage = +$(
            ".container .final-degrees .pagination .pages > .current"
        ).text(),
        currentDetailsState = +$(
            ".container .details-degrees .states .selected .name"
        ).attr("data-option"),
        currentFinalState = +$(
            ".container .final-degrees .states .selected .name"
        ).attr("data-option");

    if (currentDetailsPage < 1 || isNaN(currentDetailsPage)) {
        currentDetailsPage = 1;
    } else if (currentDetailsPage > lastDetailsPage) {
        currentDetailsPage = lastDetailsPage;
    }

    if (currentFinalPage < 1 || isNaN(currentFinalPage)) {
        currentFinalPage = 1;
    } else if (currentFinalPage > lastFinalPage) {
        currentFinalPage = lastFinalPage;
    }

    $.ajax({
        url: `${window.location.origin}/admin/page/degrees/details/${currentDetailsState}?page=${currentDetailsPage}`,
        type: "POST",
        success: (details) => {
            $.ajax({
                url: `${window.location.origin}/admin/page/degrees/final/${currentFinalState}?page=${currentFinalPage}`,
                type: "POST",
                success: async (final) => {
                    $(".container .details-degrees .details").empty();

                    $(".final-degrees .degrees *:not(.title)").remove();

                    if (details.data.length) {
                        for (let student of details.data) {
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

                        for (let student of final.data) {
                            $(".container .final-degrees .degrees").append(`
                                <div class="student">
                                    ${student.first_name} ${student.middle_name} ${student.last_name}
                                </div>
                                <div class="degree">${student.degree}%</div>`);
                        }
                    } else {
                        let nothing = `<div class="nothing">
                                            <div class="message">لا يوجد أي طلاب مسجلين حتى الآن</div>
                                        </div>`;

                        $(".container .details-degrees .details").append(
                            nothing
                        );

                        $(".container .final-degrees .degrees").append(nothing);
                    }

                    setTimeout(() => {
                        lastDetailsPage = details.last_page;

                        lastFinalPage = final.last_page;

                        $(
                            ".container .details-degrees .pagination .pages > .pages-number"
                        ).text(lastDetailsPage);

                        $(
                            ".container .final-degrees .pagination .pages > .pages-number"
                        ).text(lastFinalPage);

                        if (currentDetailsPage === 1) {
                            $(
                                ".container .details-degrees .pagination .prev"
                            ).addClass("disabled");
                        } else {
                            $(
                                ".container .details-degrees .pagination .prev"
                            ).removeClass("disabled");
                        }

                        if (currentDetailsPage === lastDetailsPage) {
                            $(
                                ".container .details-degrees .pagination .next"
                            ).addClass("disabled");
                        } else {
                            $(
                                ".container .details-degrees .pagination .next"
                            ).removeClass("disabled");
                        }

                        if (currentFinalPage === 1) {
                            $(
                                ".container .final-degrees .pagination .prev"
                            ).addClass("disabled");
                        } else {
                            $(
                                ".container .final-degrees .pagination .prev"
                            ).removeClass("disabled");
                        }

                        if (currentFinalPage === lastFinalPage) {
                            $(
                                ".container .final-degrees .pagination .next"
                            ).addClass("disabled");
                        } else {
                            $(
                                ".container .final-degrees .pagination .next"
                            ).removeClass("disabled");
                        }
                    }, 0);

                    setTimeout(() => {
                        $(".wait-table").fadeOut();
                    }, 1);
                },
            });
        },
    });
};
