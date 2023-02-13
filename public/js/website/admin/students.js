$(() => {

    let lastPage = +$(
            ".container .students-table .pagination .pages > .pages-number"
        ).text(),
        currentId = 0,

        refreshStudents = _ => {

            $(".wait-table").fadeIn();

            $(".wait-table").css("display", "flex");

            let page = $('.container .students-table .pagination .pages > .current').text(),
                state = +$('.students-table > .list-container .selected .name').attr('data-option'),
                openStudent = $(".container .students-table .student.open .info .value").eq(0).text();

            if (!page || page < 1) {

                page = 1;

            } else if (page > lastPage) {

                page = lastPage;

            }

            $.ajax({
                url: `${window.location.origin}/admin/page/students/${state}?page=${page}`,
                type: "POST",
                success: (result) => {

                    $(".container .students-table .student").remove();

                    if (result.data.length) {

                        for (let student of result.data) {

                            $(".container .students-table .add").before(`
                                <div class="student">
                                    <div class="info-name">
                                        <div class="open-arrow">&langle;</div>
                                        <div class="title">
                                            <div class="name">
                                                <span>${student.first_name} </span>
                                                <span>${student.middle_name} </span>
                                                <span>${student.last_name}</span>
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
                                        <div class="name">الرقم الوطني</div>
                                        <div class="value">${student.ssn}</div>
                                        <div class="name">العمر</div>
                                        <div class="value">${student.age}</div>
                                        <div class="name">الجنس</div>
                                        <div class="value">${student.gender}</div>
                                        <div class="name">المدرسة</div>
                                        <div class="value">${student.school}</div>
                                        <div class="name">الولاية</div>
                                        <div class="value">${student.state}</div>
                                        <div class="name">رقم الجلوس</div>
                                        <div class="value">${student.sitting_number}</div>
                                        <div class="name">التخصص</div>
                                        <div class="value">${student.specialization}</div>
                                    </div>
                                </div>`
                            );

                        }

                    } else {

                        $(".container .students-table .add").before(`
                            <div class="nothing">
                                <div class="message">لا يوجد أي طلاب مسجلين حتى الآن</div>
                            </div>
                        `);

                    }

                    if (openStudent !== '') {

                        $(".container .students-table .student").has(`div:contains(${openStudent})`).addClass('open');

                    }

                    $(
                        ".container .students-table .pagination, .container .students-table .footer-table"
                    ).remove();

                    if (result.last_page > 1) {

                        $(".container .students-table .add").after(`
                            <div class="pagination">
                                <div class="prev">&langle;</div>
                                <div class="pages">
                                    <div class="current">${page}</div>
                                    <span>/</span>
                                    <div class="pages-number">${result.last_page}</div>
                                </div>
                                <div class="next">&rangle;</div>
                            </div>
                        `);

                        if (page <= 1) {

                            $(".container .students-table .pagination .prev").addClass('disabled');

                        } else {

                            $(".container .students-table .pagination .prev").removeClass('disabled');

                        }
                        
                        if (page >= result.last_page) {

                            $(".container .students-table .pagination .next").addClass('disabled');

                        } else {

                            $(".container .students-table .pagination .next").removeClass('disabled');

                        }

                    } else {

                        $(".container .students-table .add").after(`
                            <div class="footer-table"></div>
                        `);

                    }

                    setTimeout((_) => {

                        $(".wait-table").css("display", "none");

                    }, 0);

                },

            });

        };

    $("body").on(
        "click",
        `.container .students-table .pagination .prev:not(.disabled),
         .container .students-table .pagination .next:not(.disabled)`,
        function () {

            let page = 1,
                currentPage = +$(
                    ".container .students-table .pagination .pages > .current"
                ).text(),
                state = +$(".list-container .selected .name").attr(
                    "data-option"
                ),
                isNext = $(this).hasClass("next") ?? false;

            $(".wait-table").css("display", "flex");

            if (currentPage <= 1 && !isNext) {

                page = 1;

            } else if (currentPage >= lastPage && isNext) {

                page = lastPage;

            } else {

                page = isNext ? currentPage + 1 : currentPage - 1;

            }

            if (page >= 1 && page <= lastPage) {

                $.ajax({
                    url: `${window.location.origin}/admin/page/students/${state}?page=${page}`,
                    type: "POST",
                    success: (result) => {

                        $(".container .students-table .student").remove();

                        if (result.data.length) {

                            for (let student of result.data) {

                                $(".container .students-table .add").before(`
                                    <div class="student">
                                        <div class="info-name">
                                            <div class="open-arrow">&langle;</div>
                                            <div class="title">
                                                <div class="name">
                                                    <span>${student.first_name} </span>
                                                    <span>${student.middle_name} </span>
                                                    <span>${student.last_name}</span>
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
                                            <div class="name">الرقم الوطني</div>
                                            <div class="value">${student.ssn}</div>
                                            <div class="name">العمر</div>
                                            <div class="value">${student.age}</div>
                                            <div class="name">الجنس</div>
                                            <div class="value">${student.gender}</div>
                                            <div class="name">المدرسة</div>
                                            <div class="value">${student.school}</div>
                                            <div class="name">الولاية</div>
                                            <div class="value">${student.state}</div>
                                            <div class="name">رقم الجلوس</div>
                                            <div class="value">${student.sitting_number}</div>
                                            <div class="name">التخصص</div>
                                            <div class="value">${student.specialization}</div>
                                        </div>
                                    </div>`
                                );

                            }

                        } else {

                            $(".container .students-table .add").before(`
                                <div class="nothing">
                                    <div class="message">لا يوجد أي طلاب مسجلين حتى الآن</div>
                                </div>
                            `);

                        }

                        if (page === 1) {

                            $(
                                ".container .students-table .pagination .prev"
                            ).addClass("disabled");

                        } else {

                            $(
                                ".container .students-table .pagination .prev"
                            ).removeClass("disabled");

                        }

                        if (page === lastPage) {

                            $(
                                ".container .students-table .pagination .next"
                            ).addClass("disabled");

                        } else {

                            $(
                                ".container .students-table .pagination .next"
                            ).removeClass("disabled");

                        }

                        $(
                            ".container .students-table .pagination .pages > .current"
                        ).text(page);

                        setTimeout(() => {

                            $(".wait-table").css("display", "none");

                        }, 0);

                    },

                });

            } else {

                $(".wait-table").css("display", "none");

            }

        }

    );

    $("body").on(
        "click",
        ".container .students-table > .state .list .option",
        function () {

            state = +$(this).attr("data-option");

            $(".wait-table").css("display", "flex");

            $.ajax({
                url: `${window.location.origin}/admin/page/students/${state}`,
                type: "POST",
                success: (result) => {

                    $(".container .students-table .student").remove();

                    if (result.data.length) {

                        for (let student of result.data) {

                            $(".container .students-table .add").before(`
                                <div class="student">
                                    <div class="info-name">
                                        <div class="open-arrow">&langle;</div>
                                        <div class="title">
                                            <div class="name">
                                                <span>${student.first_name} </span>
                                                <span>${student.middle_name} </span>
                                                <span>${student.last_name}</span>
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
                                        <div class="name">الرقم الوطني</div>
                                        <div class="value">${student.ssn}</div>
                                        <div class="name">العمر</div>
                                        <div class="value">${student.age}</div>
                                        <div class="name">الجنس</div>
                                        <div class="value">${student.gender}</div>
                                        <div class="name">المدرسة</div>
                                        <div class="value">${student.school}</div>
                                        <div class="name">الولاية</div>
                                        <div class="value">${student.state}</div>
                                        <div class="name">رقم الجلوس</div>
                                        <div class="value">${student.sitting_number}</div>
                                        <div class="name">التخصص</div>
                                        <div class="value">${student.specialization}</div>
                                    </div>
                                </div>`
                            );

                        }

                    } else {

                        $(".container .students-table .add").before(`
                            <div class="nothing">
                                <div class="message">لا يوجد أي طلاب مسجلين حتى الآن</div>
                            </div>
                        `);

                    }

                    $(
                        ".container .students-table .pagination, .container .students-table .footer-table"
                    ).remove();

                    if (result.last_page > 1) {

                        $(".container .students-table .add").after(`
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

                        $(".container .students-table .add").after(`
                            <div class="footer-table"></div>
                        `);

                    }

                    setTimeout((_) => {

                        $(".wait-table").css("display", "none");

                    }, 0);

                },

            });

        }

    );

    $("body").on("click", ".container .students-table .student .info-name .title .options .edit", function () {

        if ($(".confirm").css("display") !== 'none')
            return;

        let nameSelector = $(this).parent().siblings('.name').children("span"),
            name = [nameSelector.eq(0).text(), nameSelector.eq(1).text(), nameSelector.eq(2).text()],
            info = $(this).parents('.info-name').siblings('.info').children('.value'),
            inputs = $(".cover .student-inputs .inputs"),
            gender = inputs.children(".gender").children(".list").children(`.option:contains('${info.eq(2).text()}')`),
            state = inputs.children(".state").children(".list").children(`.option:contains('${info.eq(4).text()}')`),
            major = inputs.children(".major").children(".list").children(`.option:contains('${info.eq(6).text()}')`);


        inputs.children("[name='first_name']").val(name[0]);

        inputs.children("[name='middle_name']").val(name[1]);

        inputs.children("[name='last_name']").val(name[2]);

        inputs.children("[name='ssn']").val(info.eq(0).text());

        inputs.children("[name='ssn']").prop('disabled', true);

        inputs.children("[name='age']").val(info.eq(1).text());

        inputs.children("[name='school']").val(info.eq(3).text());

        inputs.children("[name='sitting_number']").val(info.eq(5).text());

        inputs.children(".gender").children(".selected").children('.name').text(gender.text()).attr("data-option", gender.attr("data-option"));

        inputs.children(".state").children(".selected").children('.name').text(state.text()).attr("data-option", state.attr("data-option"));

        inputs.children(".major").children(".selected").children('.name').text(major.text()).attr("data-option", major.attr("data-option"));

        currentId = info.eq(0).text();

        $(".cover").fadeIn();

        $(".cover").css('display', 'flex');

        $("body").css("overflow", 'hidden');

    });

    $("body").on("click", ".cover .student-inputs .buttons > .cancel", () => {

        if (!$(".cover .student-inputs .buttons > .send").hasClass("waiting")) {

            currentId = 0;

        }

    });

    $("body").on(
        "click",
        ".cover .student-inputs .buttons > .send:not(.waiting)",
        async function () {

            $(this).addClass('waiting');

            $('.error').text("");

            $('.error').css('display', 'none');

            let formData = new FormData(),
                operation = currentId == 0 ? 'create' : 'edit';

            for await (let input of $(".cover .student-inputs .inputs input")) {

                formData.append(input.name, input.value);

            }

            let lists = $(
                ".cover .student-inputs .inputs .select-input .selected .name"
            );

            for await (let input of lists) {

                let value = input.dataset.option ?? '';

                formData.append(input.parentElement.parentElement.classList[1], value);

            }
            
            if (currentId !== 0) {

                formData.set($(".cover .student-inputs .inputs .ssn").attr('name'), currentId);

            }

            $.ajax({
              url: `${window.location.origin}/admin/students/${operation}`,
              method: 'POST',
              data: formData,
              cache: false,
              processType: false,
              processData: false,
              contentType: false,
              enctype: 'multipart/form-data',
              error: errors => {

                if (errors.status === 422) {

                    let errorsJson = JSON.parse(errors.responseText);
                    
                    $.each(errorsJson.errors, (input, error) => {

                        $(`input[name="${input}"] + .error, list-container.${input} + .error`).css('display', 'block').text(error[0]);

                    });

                }

              },
              success: result => {

                if (result === 'success') {

                    $('.cover').fadeOut(400, _ => {

                        let message = operation == 'create' ? 'تمت إضافة طالب جديد بنجاح.' : 'تم تعديل بيانات الطالب بنجاح. ';

                        attentionShow(message);

                        $('body').css('overflow-y', 'auto');

                    });

                    refreshStudents();

                } else if (result === 'unexists') {

                    attentionShow('هذا الطالب غير موجود');

                } else if (typeof(result) === 'object') {

                    $.each(result, (input, error) => {

                        $(`input[name="${input}"] + .error, list-container.${input} + .error`).css('display', 'block').text(error[0]);

                    });

                }

              },
              complete: _ => {

                $(this).removeClass('waiting');

              }

            });

        }

    );

    $("body").on("click", ".container .students-table .student .info-name .title .options .delete", function () {

        currentId = $(this).parents(".info-name").siblings(".info").children(".value").eq(0).text();

        $(".container .confirm").fadeIn();

    });

    $("body").on("click", ".container .confirm .body .buttons .no", _ => {

        currentId = 0;

        $(".container .confirm").fadeOut();

    });

    $("body").on("click", ".container .confirm .body .buttons .yes", _ => {

        $(".confirm").addClass('waiting');

        $.ajax({
            url: `${window.location.origin}/admin/students/delete/${currentId}`,
            method: 'DELETE',
            error: () => {

                attentionShow('حدث خطأ ما، أعد المحاولة بعد التحقق من اتصالك الشبكة');

            },
            success: result => {

                if (result === 'success') {

                    attentionShow('تم حذف الطالب بنجاح');

                    refreshStudents();

                } else if (result === 'unexists') {

                    attentionShow('هذا الطالب غير موجود');

                }

            },
            complete: _ => {

                currentId = 0;

                $(".confirm").fadeOut(400, () => {

                    $(".confirm").removeClass('waiting');

                });

            }

        });

    });
    
});
