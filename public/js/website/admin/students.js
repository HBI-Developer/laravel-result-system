
// This JavaScript File to students page in admin dashboard

$(() => { // When page is ready

    // @variable lastPage contains number of last page in students tables pagination
    // @variable currentId contains students ssn in case edit and delete

    let lastPage = +$(
            ".container .students-table .pagination .pages > .pages-number"
        ).text(),
        currentId = 0,

        // @function refreshStudents refresh students table by info from DB

        refreshStudents = _ => {

            // Put wait element on table

            $(".wait-table").fadeIn();
            $(".wait-table").css("display", "flex");

            // @variable page contains current page in table pagination
            // @variable state contains current state selected in table
            // @variable openStudent contains selector for student this info is shown

            let page = $('.container .students-table .pagination .pages > .current').text(),
                state = +$('.students-table > .list-container .selected .name').attr('data-option'),
                openStudent = $(".container .students-table .student.open .info .value").eq(0).text();

            if (!page || page < 1) {

                // If page less than 1 or Not a Number

                // page assigning 1

                page = 1;
            } else if (page > lastPage) {

                // If page greater than global variable lastPage

                // page assigning lastPage

                page = lastPage;
            }

            /*
                send ajax request by (POST) method with [state, page] as data
                
                @return students from this state or all students if state variable equals 0
                [depending to state], from certain page [depending to page]
            */

            $.ajax({
                url: `${window.location.origin}/admin/page/students/${state}?page=${page}`,
                type: "POST",
                error: (error) => {
                    // If ajax request fails
                },
                success: (result) => {

                    // If ajax request success

                    // empty students table

                    $(".container .students-table .student").remove();

                    if (result.data.length) {

                        // If result variables have data [There's students]

                        for (let student of result.data) {

                            // For loop to add students to students table

                            // Add this student to students table

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

                        // If result variable doesn't have data

                        // Add nothing template to students table

                        $(".container .students-table .add").before(`
                            <div class="nothing">
                                <div class="message">لا يوجد أي طلاب مسجلين حتى الآن</div>
                            </div>
                        `);
                    }

                    if (openStudent !== '') {

                        // If openStudent has value add open class to row has the value that in openStudent

                        $(".container .students-table .student").has(`div:contains(${openStudent})`).addClass('open');
                    }

                    // Remove Pageination or footer from bottom students table

                    $(
                        ".container .students-table .pagination, .container .students-table .footer-table"
                    ).remove();



                    if (result.last_page > 1) {

                        // If value of last_page in result greater than 1

                        // add Pagination to bottom of table

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

                            // If page value equals or less than 1 add disabled to previous arrow in pagination

                            $(".container .students-table .pagination .prev").addClass('disabled');
                        } else {

                            // Else enable to previous arrow in pagination

                            $(".container .students-table .pagination .prev").removeClass('disabled');
                        }
                        
                        if (page >= result.last_page) {

                            // If page value equals or greater than (result.last_page) add disabled to next arrow in pagination

                            $(".container .students-table .pagination .next").addClass('disabled');
                        } else {

                            // Else enable to next arrow in pagination

                            $(".container .students-table .pagination .next").removeClass('disabled');
                        }

                    } else {

                        // If value of last_page in result equals or less than 1

                        // Add footer in bottom of students table

                        $(".container .students-table .add").after(`
                            <div class="footer-table"></div>
                        `);
                    }

                    setTimeout((_) => {

                        // After all above commands end, hide wait element in table

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

            // Fired when clicking on pagination arrows [Previous, Next] if it isn't disabled

            // @variable page contains number of page what need
            // @variable currentPage contains number of current page
            // @variable state contains state of table
            // @variable isNext contains boolean is user want next page or previous page

            let page = 1,
                currentPage = +$(
                    ".container .students-table .pagination .pages > .current"
                ).text(),
                state = +$(".list-container .selected .name").attr(
                    "data-option"
                ),
                isNext = $(this).hasClass("next") ?? false;

            // Shown wait element for students table

            $(".wait-table").css("display", "flex");


            if (currentPage <= 1 && !isNext) {

                // If currentPage equals or less than 1 and user want previous page set 1 in page variable

                page = 1;
            } else if (currentPage >= lastPage && isNext) {

                // If currentPage equals or greater than lastPage and user want next page set lastPage value in page variable

                page = lastPage;
            } else {

                // Else that depending user want next or previous page set plus or minus 1 to current page for page variable

                page = isNext ? currentPage + 1 : currentPage - 1;
            }

            if (page >= 1 && page <= lastPage) {

                // If page equal or greater than 1 and equal or less than lastPage

                /*
                    ajax request by (POST) method with (state, page) as data

                    @return students from this state or all students if state variable equals 0 [depending to state],
                    from certain page [depending to page]
                */

                $.ajax({
                    url: `${window.location.origin}/admin/page/students/${state}?page=${page}`,
                    type: "POST",
                    error: (error) => {
                        // If ajax request fails
                    },
                    success: (result) => {

                        // If ajax request success execute this asynchronous function

                        // empty students table

                        $(".container .students-table .student").remove();

                        if (result.data.length) {

                            // If result of ajax request has data

                            for (let student of result.data) {

                                // Add student in result data to students table

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

                            // If there's not data in result

                            // Append nothing template to students table

                            $(".container .students-table .add").before(`
                                <div class="nothing">
                                    <div class="message">لا يوجد أي طلاب مسجلين حتى الآن</div>
                                </div>
                            `);
                        }

                        if (page === 1) {

                            // If page equals 1 add disabled class to previous arrow in pagination

                            $(
                                ".container .students-table .pagination .prev"
                            ).addClass("disabled");
                        } else {

                            // Else remove class disabled from previous arrow in pagination

                            $(
                                ".container .students-table .pagination .prev"
                            ).removeClass("disabled");
                        }

                        if (page === lastPage) {

                            // If page equals lastPage add class disabled to next arrow in pagination

                            $(
                                ".container .students-table .pagination .next"
                            ).addClass("disabled");
                        } else {

                            // Else remove class disabled from next arrow in pagination

                            $(
                                ".container .students-table .pagination .next"
                            ).removeClass("disabled");
                        }


                        // Put page number of current page in pagination

                        $(
                            ".container .students-table .pagination .pages > .current"
                        ).text(page);

                        setTimeout(() => {

                            // After all above commands end, hide wait element in table

                            $(".wait-table").css("display", "none");
                        }, 0);
                    },
                });
            } else {

                // If page greater than lastPage or less than 1

                // hide wait element in table

                $(".wait-table").css("display", "none");
            }
        }
    );

    $("body").on(
        "click",
        ".container .students-table > .state .list .option",
        function () {

            // Fired when change state in students table

            // @variable state contains state the user choose it

            state = +$(this).attr("data-option");

            // Shown wait element in students table

            $(".wait-table").css("display", "flex");

            /*
                Ajax request by (POST) method with [state] as data

                @return students from this state or all students if state variable equals 0 [depending to state]
            */

            $.ajax({
                url: `${window.location.origin}/admin/page/students/${state}`,
                type: "POST",
                error: (error) => {
                    // If ajax request it fails
                },
                success: (result) => {

                    // If ajax request success

                    // Empty students table

                    $(".container .students-table .student").remove();

                    if (result.data.length) {

                        // If result has data

                        for (let student of result.data) {

                            // for loop to append students

                            // Append each student to students table

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

                        // If result hasn't table

                        // Add nothing template to students table

                        $(".container .students-table .add").before(`
                            <div class="nothing">
                                <div class="message">لا يوجد أي طلاب مسجلين حتى الآن</div>
                            </div>
                        `);
                    }

                    // Remove pagination or footer from students table

                    $(
                        ".container .students-table .pagination, .container .students-table .footer-table"
                    ).remove();


                    if (result.last_page > 1) {

                        // if result.last_page greater than 1

                        // Append pagination to bottom of table

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

                        // If result.last_page equals or less than 1

                        // Append footer to bottom of table

                        $(".container .students-table .add").after(`
                            <div class="footer-table"></div>
                        `);
                    }

                    setTimeout((_) => {

                        // After all commands end

                        // hide wait element in table

                        $(".wait-table").css("display", "none");
                    }, 0);
                },
            });
        }
    );

    $("body").on("click", ".container .students-table .student .info-name .title .options .edit", function () {

        // Fired when click on edit button on any student row

        // If confirm element is shown end this function

        if ($(".confirm").css("display") !== 'none')
            return;

        // @variable nameSelector contains selectors for spans contains (first, middle, last) name for chosen student
        // @variable name contains name of student as array (first, middle, last) for chosen student
        // @variable info contains all student info in info element
        // @variable inputs contains inputs selectors in cover element
        // @variable gender contains selector of gender list-container
        // @variable state contains selector of state inpus list-container
        // @variable major contains selector of major list-container
            
        let nameSelector = $(this).parent().siblings('.name').children("span"),
            name = [nameSelector.eq(0).text(), nameSelector.eq(1).text(), nameSelector.eq(2).text()],
            info = $(this).parents('.info-name').siblings('.info').children('.value'),
            inputs = $(".cover .student-inputs .inputs"),
            gender = inputs.children(".gender").children(".list").children(`.option:contains('${info.eq(2).text()}')`),
            state = inputs.children(".state").children(".list").children(`.option:contains('${info.eq(4).text()}')`),
            major = inputs.children(".major").children(".list").children(`.option:contains('${info.eq(6).text()}')`);

        // Add info to its inputs

        inputs.children("[name='first_name']").val(name[0]);

        inputs.children("[name='middle_name']").val(name[1]);

        inputs.children("[name='last_name']").val(name[2]);

        inputs.children("[name='ssn']").val(info.eq(0).text());

        // Make ssn input disabled

        inputs.children("[name='ssn']").prop('disabled', true);

        inputs.children("[name='age']").val(info.eq(1).text());

        inputs.children("[name='school']").val(info.eq(3).text());

        inputs.children("[name='sitting_number']").val(info.eq(5).text());

        // Add info to its list-containers

        inputs.children(".gender").children(".selected").children('.name').text(gender.text()).attr("data-option", gender.attr("data-option"));
        inputs.children(".state").children(".selected").children('.name').text(state.text()).attr("data-option", state.attr("data-option"));
        inputs.children(".major").children(".selected").children('.name').text(major.text()).attr("data-option", major.attr("data-option"));

        // Assigning ssn of student to currentId

        currentId = info.eq(0).text();

        // Shown cover element

        $(".cover").fadeIn();
        $(".cover").css('display', 'flex');

        // Hide scroll of page

        $("body").css("overflow", 'hidden');
    });

    $("body").on("click", ".cover .student-inputs .buttons > .cancel", () => {

        // Fired when click on cancel button in [add, edit] screen

        if (!$(".cover .student-inputs .buttons > .send").hasClass("waiting")) {

            // If ajax request isn't processing [By send button isn't has waiting class]

            // @variable currentId contains 0

            currentId = 0;
        }
    });

    $("body").on(
        "click",
        ".cover .student-inputs .buttons > .send:not(.waiting)",
        async function () {

            // Fired when click on send button and this button isn't has class (waiting)

            // add class waiting for this button

            $(this).addClass('waiting');

            // Reset error elements

            $('.error').text("");
            $('.error').css('display', 'none');

             /*
                @variable formData container for put inputs value in it
                @variable operator contains type of operation execute now [create, edit], through is currentId
                    equals 0 or not
            */

            let formData = new FormData(),
                operation = currentId == 0 ? 'create' : 'edit';

            for await (let input of $(".cover .student-inputs .inputs input")) {

                // Append inputs value with name of inputs to formData

                formData.append(input.name, input.value);
            }

            // @variable list contains selectors of list-containers

            let lists = $(
                ".cover .student-inputs .inputs .select-input .selected .name"
            );

            for await (let input of lists) {

                // @variable value contains selected value in list-container or empty string

                let value = input.dataset.option ?? '';

                // Append value with name of list-conatiner [as class] to formData

                formData.append(input.parentElement.parentElement.classList[1], value);
            }
            
            if (currentId !== 0) {

                // If currentId has ssn number change value of ssn in formData

                formData.set($(".cover .student-inputs .inputs .ssn").attr('name'), currentId);
            }

            // ajax request by (POST) method, depending value of oprerator creating or editing student with formData as data

            // @void add new student or editing student info

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

                // If ajax request is fails

                if (errors.status === 422) {

                    // If this is validator error [has 422 code]

                    // @variable errorsJson contains validator errors

                    let errorsJson = JSON.parse(errors.responseText);
                    
                    $.each(errorsJson.errors, (input, error) => {

                        // each error in errorJson put it in error element for its input

                        $(`input[name="${input}"] + .error, list-container.${input} + .error`).css('display', 'block').text(error[0]);
                    });
                }
              },
              success: result => {

                // If ajax result success

                if (result === 'success') {

                    // If return success

                    // hide cover element

                    $('.cover').fadeOut(400, _ => {

                        // message contains success message of [create, edit] depending of operation

                        let message = operation == 'create' ? 'تمت إضافة طالب جديد بنجاح.' : 'تم تعديل بيانات الطالب بنجاح. ';

                        // Shown success message on screen 

                        attentionShow(message);

                        // Shown scroll of page

                        $('body').css('overflow-y', 'auto');
                    });

                    // Refresh students table

                    refreshStudents();
                } else if (result === 'unexists') {

                    // If return unexist [in edit] that means this student is not exist in DB

                    // Shown message of unexist student on screen

                    attentionShow('هذا الطالب غير موجود');
                } else if (typeof(result) === 'object') {

                    // If return variable of object type [for ssn and sitting number]

                    $.each(result, (input, error) => {

                        // each error in result put it in error element for its input

                        $(`input[name="${input}"] + .error, list-container.${input} + .error`).css('display', 'block').text(error[0]);
                    });
                }
              },
              complete: _ => {

                // after ajax request complete remove waiting class for send button

                $(this).removeClass('waiting');
              }
            });
        }
    );

    $("body").on("click", ".container .students-table .student .info-name .title .options .delete", function () {

        // Fired when click on delete button on any student row

        // assigning ssn for this student to currentId

        currentId = $(this).parents(".info-name").siblings(".info").children(".value").eq(0).text();

        // Shown confirm element

        $(".container .confirm").fadeIn();
    });

    $("body").on("click", ".container .confirm .body .buttons .no", _ => {

        // Fired when click on no button in confirm element

        // assigning 0 to currentId

        currentId = 0;

        // Hide confirm element

        $(".container .confirm").fadeOut();
    });

    $("body").on("click", ".container .confirm .body .buttons .yes", _ => {

        // Fired when click yes button in confirm element

        // Add class waiting for confirm element

        $(".confirm").addClass('waiting');

        // Ajax request by (DELETE) method and currentId as data

        // @void delete student that ssn in currentId

        $.ajax({
            url: `${window.location.origin}/admin/students/delete/${currentId}`,
            method: 'DELETE',
            error: errors => {

                // if ajax request fails shown error message on screen

                attentionShow('حدث خطأ ما، أعد المحاولة بعد التحقق من اتصالك الشبكة');
            },
            success: result => {

                // If ajax request is success

                if (result === 'success') {

                    // If return success shown success message on screen

                    attentionShow('تم حذف الطالب بنجاح');

                    // Refresh students table

                    refreshStudents();
                } else if (result === 'unexists') {

                    // If return unexists value that's means this student isn't exist and shown unexists message on screen

                    attentionShow('هذا الطالب غير موجود');
                }
            },
            complete: _ => {

                // If ajax request complete

                // Assigning 0 to currentId

                currentId = 0;
                
                // hide confirm element

                $(".confirm").fadeOut(400, () => {

                    // After hide confirm remove class waiting

                    $(".confirm").removeClass('waiting');
                });
            }
        });
    });
});
