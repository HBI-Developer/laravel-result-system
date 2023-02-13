$(() => {

    let lastDetailsPage = +$(
            ".container .details-degrees .pagination .pages > .pages-number"
        ).text(),
        lastFinalPage = +$(
            ".container .final-degrees .pagination .pages > .pages-number"
        ).text(),
        currentId = 0,

        refreshDegrees = () => {

            $(".wait-table").fadeIn();

            $(".wait-table").css("display", "flex");

            let currentDetailsPage = +$(".container .details-degrees .pagination .pages > .current").text(),
                currentFinalPage = +$(".container .final-degrees .pagination .pages > .current").text(),
                currentDetailsState = +$(".container .details-degrees .states .selected .name").attr("data-option"),
                currentFinalState = +$(".container .final-degrees .states .selected .name").attr("data-option");

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
                success: details => {

                    $.ajax({
                        url: `${window.location.origin}/admin/page/degrees/final/${currentFinalState}?page=${currentFinalPage}`,
                        type: "POST",
                        success: async final => {

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

                                    $(".container .details-degrees .details")
                                        .append(`
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

                                    $(".container .final-degrees .degrees")
                                        .append(`
                                        <div class="student">
                                            ${student.first_name} ${student.middle_name} ${student.last_name}
                                        </div>
                                        <div class="degree">${student.degree}%</div>`);

                                }

                            } else {

                                let nothing = `<div class="nothing">
                                                    <div class="message">لا يوجد أي طلاب مسجلين حتى الآن</div>
                                                </div>`;
    
                                $(
                                    ".container .details-degrees .details"
                                ).append(nothing);

                                $(
                                    ".container .final-degrees .degrees"
                                ).append(nothing);

                            }

                            setTimeout(() => {

                                lastDetailsPage = details.last_page;

                                lastFinalPage = final.last_page;

                                $(".container .details-degrees .pagination .pages > .pages-number").text(lastDetailsPage);

                                $(".container .final-degrees .pagination .pages > .pages-number").text(lastFinalPage);

                                if (currentDetailsPage === 1) {

                                    $(".container .details-degrees .pagination .prev").addClass("disabled");

                                } else {

                                    $(".container .details-degrees .pagination .prev").removeClass("disabled");

                                }

                                if (currentDetailsPage === lastDetailsPage) {

                                    $(".container .details-degrees .pagination .next").addClass("disabled");

                                } else {

                                    $(".container .details-degrees .pagination .next").removeClass("disabled");

                                }
                                
                                if (currentFinalPage === 1) {

                                    $(".container .final-degrees .pagination .prev").addClass("disabled");

                                } else {

                                    $(".container .final-degrees .pagination .prev").removeClass("disabled");

                                }

                                if (currentFinalPage === lastFinalPage) {

                                    $(".container .final-degrees .pagination .next").addClass("disabled");

                                } else {

                                    $(".container .final-degrees .pagination .next").removeClass("disabled");

                                }

                            }, 0);

                            setTimeout(() => {

                                $(".wait-table").fadeOut();

                            }, 1);

                        }

                    });

                }

            });

        },

        getSubjects = major => {

            $.ajax({
                url: `${window.location.origin}/admin/major/subjects/${major}`,
                type: "get",
                success: (result) => {

                    $(".container .cover .add-degree .degrees").empty();

                    $(".container .cover .add-degree .degrees").append(`<div class="error"></div>`);

                    for (let subject of result) {

                        $(".container .cover .add-degree .degrees").append(`
                            <div class="label">${subject.subject_name}</div>
                            <input type="number" class="theDegree" data-id="${subject.id}" />
                            <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>
                        `);

                    }

                },

            });

        },

        firstStudentWithoutDegree = () => {

            let student = $(".container .cover .add-degree .students .list .option").eq(0),
                major = student.attr("data-major");

            if (student.length) {

                $(".container .cover .add-degree .students .selected .name").text(student.text());

                $(".container .cover .add-degree .students .selected .name").attr("data-option", student.attr("data-option"));

                $(".container .cover .add-degree .students").removeClass("disabled");

                getSubjects(major);

            } else {

                $(`.container .cover .add-degree .students`).remove();

                $(`.container .cover .add-degree .degrees`).html(`
                    <div class="nothing">لقد تم وضع الدرجات لجميع الطلاب المسجلين في النظام حتى الآن</div>
                `);

            }

        };

    $("body").on(
        "click",
        `.container .details-degrees .pagination .prev:not(.disabled),
         .container .details-degrees .pagination .next:not(.disabled),
         .container .final-degrees .pagination .prev:not(.disabled),
         .container .final-degrees .pagination .next:not(.disabled)`,
        function () {

            let page = 1,
                currentPage = +$(this)
                    .siblings(".pages")
                    .children(".current")
                    .text(),
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
                lastPage = anyDegrees === 'details' ? lastDetailsPage : lastFinalPage;

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

                                    $(".container .details-degrees .details")
                                        .append(`
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

                                    $(".container .final-degrees .degrees")
                                        .append(`
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
                                ? $(
                                      ".container .details-degrees .details"
                                  ).append(nothing)
                                : $(
                                      ".container .final-degrees .degrees"
                                  ).append(nothing);

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

    );

    $("body").on(
        "click",
        ".container .details-degrees > .states .list .option, .container .final-degrees > .states .list .option",
        function () {

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

                                $(".container .details-degrees .details")
                                    .append(`
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

                    $(
                        `.container .${anyDegrees}-degrees .pagination, .container .${anyDegrees}-degrees .footer-table`
                    ).remove();

                    anyDegrees === 'details' ?
                        lastDetailsPage = result.last_page :
                        lastFinalPage = result.last_page;

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

    );

    $("body").on(
        "click",
        ".container .cover .add-degree .list-container.students .list .option",
        function () {

            let major = $(this).attr("data-major");

            getSubjects(major);

        }

    );

    $("body").on("click" , ".container .details-degrees .details .student .info-name .title .options .edit", function () {

        if ($(".confirm").css("display") !== 'none')
            return;

        currentId = +$(this).parents(".student").attr("data-ssn");

        $.ajax({
            url: `${window.location.origin}/admin/student/degrees/${currentId}`,
            method: "GET",
            success: async result => {

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

                $(".container .cover .add-degree .students .selected .name").attr("data-option", student.ssn);

                $(".container .cover .add-degree .students").addClass("disabled");

                $(".container .cover .add-degree .degrees").empty();

                $(".container .cover .add-degree .degrees").append(`<div class="error"></div>`);

                for await (let degree of student.degrees) {

                    $(".container .cover .add-degree .degrees").append(`
                        <div class="label">${degree.subject.subject_name}</div>
                        <input type="text" class="theDegree" data-id="${degree.subject_id}" value="${degree.degree}" />
                        <div class="error"></div>
                    `);

                }

                $(".cover").fadeIn();

                $("body").css("overflow", "hidden");
                
            }

        });

    });

    $("body").on("click", ".container .cover .add-degree .buttons > .cancel", () => {

        if (!$(".container .cover .add-degree .buttons > .send").hasClass('waiting')) {

            currentId = 0;

            firstStudentWithoutDegree();

        }

    });

    $("body").on(
        "click",
        ".container .cover .add-degree .buttons > .send:not(.waiting)",
        async function () {

            $(this).addClass('waiting');

            $(".container .cover .add-degree .degrees .error").text("");

            $(".container .cover .add-degree .degrees .error").css(
                "display",
                "none"
            );

            let formData = new FormData(),
                degreesArray = {},
                operator = currentId === 0 ? 'create' : 'edit',
                ssn = $(
                    ".container .cover .add-degree .students .selected .name"
                ).attr("data-option");

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
                                .text(
                                    "لا يمكن أن تكون درجة المادة أكثر من 100."
                                );

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

                            if (operator === 'create') {

                                $(
                                    `.container .cover .add-degree .students .list .option[data-option='${ssn}']`
                                ).remove();

                            } else {

                                currentId = 0;

                            }

                            firstStudentWithoutDegree();

                            $("body").css("overflow-y", "auto");

                        });

                        let message = operator === 'create' ? 'تمت إضافة درجات الطالب بنجاح' : 'تم تعديل درجات الطالب بنجاح';

                        attentionShow(message);

                        refreshDegrees();

                    }

                },
                complete: _ => {

                    $(this).removeClass('waiting');

                }

            });

        }

    );

    $("body").on("click", ".container .details-degrees .details .student .info-name .title .options .delete", function () {

        currentId = $(this).parents(".student").attr("data-ssn");

        $(".confirm").fadeIn();

    });

    $("body").on("click", ".container .confirm .body .no", () => {

        currentId = 0;

        $(".confirm").fadeOut();

    });

    $("body").on("click", ".container .confirm .body .yes", () => {

        $(".confirm").addClass('waiting');

        $(".wait-table").fadeIn();

        $(".wait-table").css('display', 'flex');

        $.ajax({
            url: `${window.location.origin}/admin/degrees/delete/${currentId}`,
            method: 'DELETE',
            error: () => {

                attentionShow('حدث خطأ ما، أعد المحاولة بعد التحقق من اتصالك الشبكة');

            },
            success: result => {

                if (result === 'success') {

                    attentionShow('تم حذف درجات الطالب بنجاح');

                    refreshDegrees();

                } else if (result === 'unexists') {

                    attentionShow('هذه الدرجات ليس لها وجود');

                }

            },
            complete: _ => {

                currentId = 0;

                $(".wait-table").fadeOut();
                
                $(".confirm").fadeOut(400, () => {

                    $(".confirm").removeClass('waiting');

                });

            }

        });

    });
    
});
