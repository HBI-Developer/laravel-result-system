
// This JavaScript File to degrees page in admin dashboard

$(() => { // When page is ready

    // @variable lastDetailsPage contains number of last page in details degrees pagination
    // @variable lastFinalPage contains number of last page in final degrees pagination
    // @variable currentId contains student ssn in case edit and delete degrees

    let lastDetailsPage = +$(
            ".container .details-degrees .pagination .pages > .pages-number"
        ).text(),
        lastFinalPage = +$(
            ".container .final-degrees .pagination .pages > .pages-number"
        ).text(),
        currentId = 0,

        // @function refreshDegrees refresh degrees tables by info from DB

        refreshDegrees = () => {

            // Put wait element on tables

            $(".wait-table").fadeIn();
            $(".wait-table").css("display", "flex");

            // @variable currentDetailsPage contains current page in details table in pagination
            // @variable currentFinalPage contains current page in final table in pagination
            // @variable currentDetailsState contains current state selected in details table
            // @variable currentFinalState contains current state selected in final table

            let currentDetailsPage = +$(".container .details-degrees .pagination .pages > .current").text(),
                currentFinalPage = +$(".container .final-degrees .pagination .pages > .current").text(),
                currentDetailsState = +$(".container .details-degrees .states .selected .name").attr("data-option"),
                currentFinalState = +$(".container .final-degrees .states .selected .name").attr("data-option");

            if (currentDetailsPage < 1 || isNaN(currentDetailsPage)) {

                // If currentDetailsPage less than 1 or Not a Number

                // currentDetailsPage assigning 1

                currentDetailsPage = 1;
            } else if (currentDetailsPage > lastDetailsPage) {

                // If currentDetailsPage greater than global variable lastDetailsPage

                // currentDetailsPage assigning lastDetailsPage

                currentDetailsPage = lastDetailsPage;
            }

            if (currentFinalPage < 1 || isNaN(currentFinalPage)) {

                // If currentFinalPage less than 1 or Not a Number

                // currentFinalPage assigning 1

                currentFinalPage = 1;
            } else if (currentFinalPage > lastFinalPage) {

                // If currentFinalPage greater than global variable lastFinalPage

                // currentFinalPage assigning lastFinalPage

                currentFinalPage = lastFinalPage;
            }

            /*
                send ajax request by (POST) method with [currentDetailsState, currentDetailsPage] as data
                
                @return students from this state or all students if currentDetailsState variable equals 0
                [depending to currentDetailsState], with it details degrees, from certain page [depending to
                currentDetailsPage]
            */

            $.ajax({
                url: `${window.location.origin}/admin/page/degrees/details/${currentDetailsState}?page=${currentDetailsPage}`,
                type: "POST",
                error: errors => {
                    // If ajax request fails
                },
                success: details => {

                    // If ajax request success get result in (details) variable

                    /*
                       send ajax request by (POST) method with [currentFinalState, currentFinalPage] as data
                        
                        @return students from this state or all students if currentFinalState variable equals 0
                        [depending to currentFinalState], with it final degrees, from certain page [depending to
                        currentFinalPage]
                    */

                    $.ajax({
                        url: `${window.location.origin}/admin/page/degrees/final/${currentFinalState}?page=${currentFinalPage}`,
                        type: "POST",
                        error: errors => {
                            // If ajax request fails
                        },
                        success: async final => {

                            // If ajax request success get result in (final) variable

                            // empty details & final tables

                            $(".container .details-degrees .details").empty();

                            $(".final-degrees .degrees *:not(.title)").remove();

                            if (details.data.length) {

                                // If details variables have data [There's students degrees]

                                for (let student of details.data) {

                                    // For loop to add details degrees to details table

                                    let degreesInfo = "";

                                    for await (let degrees of student.degrees) {

                                        // For loop to add degree for each subject in info element

                                        degreesInfo += `
                                            <div class="name">${degrees.subject.subject_name}</div>
                                            <div class="value">${degrees.degree}%</div>
                                        `;
                                    }

                                    // Add student with his degrees to details table

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

                                    // For loop to add final degrees

                                    // With final degrees to final table

                                    $(".container .final-degrees .degrees")
                                        .append(`
                                        <div class="student">
                                            ${student.first_name} ${student.middle_name} ${student.last_name}
                                        </div>
                                        <div class="degree">${student.degree}%</div>`);
                                }
                            } else {

                                // If details variable doesn't have data

                                // @variable nothing contains template of nothing degrees in template

                                let nothing = `<div class="nothing">
                                                    <div class="message">لا يوجد أي طلاب مسجلين حتى الآن</div>
                                                </div>`;


                                // Add nothing template to details & final tables
    
                                $(
                                    ".container .details-degrees .details"
                                ).append(nothing);

                                $(
                                    ".container .final-degrees .degrees"
                                ).append(nothing);
                            }

                            setTimeout(() => {

                                // After commands above end, execute the next...

                                // set last page value in details variable to lastDetailsPage
                                // set last page value in final variable to lastFinalPage

                                lastDetailsPage = details.last_page;
                                lastFinalPage = final.last_page;

                                /*
                                    Set [lastDetailsPage, lastFinalPage] to pages number pagination to details &
                                    final tables
                                */

                                $(".container .details-degrees .pagination .pages > .pages-number").text(lastDetailsPage);
                                $(".container .final-degrees .pagination .pages > .pages-number").text(lastFinalPage);

                                
                                if (currentDetailsPage === 1) {

                                    /*
                                        If currentDetailsPage equals 1 let pervious arrow in pagination in details
                                        table disabled
                                    */

                                    $(".container .details-degrees .pagination .prev").addClass("disabled");
                                } else {

                                    /*
                                        If currentDetailsPage greater than 1 let pervious arrow in pagination in details
                                        table enaled
                                    */

                                    $(".container .details-degrees .pagination .prev").removeClass("disabled");
                                }

                                if (currentDetailsPage === lastDetailsPage) {

                                    /*
                                        If currentDetailsPage equals lastDetailsPage let next arrow in pagination in details
                                        table disabled
                                    */

                                    $(".container .details-degrees .pagination .next").addClass("disabled");
                                } else {

                                    /*
                                        If currentDetailsPage equals lastDetailsPage let next arrow in pagination in details
                                        table enaled
                                    */

                                    $(".container .details-degrees .pagination .next").removeClass("disabled");
                                }
                                
                                if (currentFinalPage === 1) {

                                    /*
                                        If currentFinalPage equals 1 let pervious arrow in pagination in final
                                        table disabled
                                    */

                                    $(".container .final-degrees .pagination .prev").addClass("disabled");
                                } else {

                                    /*
                                        If currentFinalPage greater than 1 let pervious arrow in pagination in final
                                        table enaled
                                    */

                                    $(".container .final-degrees .pagination .prev").removeClass("disabled");
                                }

                                if (currentFinalPage === lastFinalPage) {

                                    /*
                                        If currentFinalPage equals lastFinalPage let next arrow in pagination in final
                                        table disabled
                                    */

                                    $(".container .final-degrees .pagination .next").addClass("disabled");
                                } else {

                                    /*
                                        If currentFinalPage equals lastFinalPage let next arrow in pagination in final
                                        table enaled
                                    */

                                    $(".container .final-degrees .pagination .next").removeClass("disabled");
                                }
                            }, 0);

                            setTimeout(() => {

                                // After commands above end, execute the next...

                                // hide wait element in table

                                $(".wait-table").fadeOut();
                            }, 1);
                        }
                    });
                }
            });
        },

        /*
            @function getSubjects
            @param major contains requied major
            @return all subjects related with this major + shared subjects, and put it in inputs [add or edit] screen
        */

        getSubjects = major => {

            // Send ajax request by (GET) method with (major) as data

            // @return all subjects for certain major [depending to major] with shared subjects

            $.ajax({
                url: `${window.location.origin}/admin/major/subjects/${major}`,
                type: "get",
                error: (errors) => {
                    // If ajax request fails
                },
                success: (result) => {

                    // If ajax request success

                    // empty degrees inputs container
                    // add error element as first element [as error element for students without degrees list-container]

                    $(".container .cover .add-degree .degrees").empty();
                    $(".container .cover .add-degree .degrees").append(`<div class="error"></div>`);
                    for (let subject of result) {

                        // for loop to append inputs for subjects returned from DB + label & error elements for it

                        $(".container .cover .add-degree .degrees").append(`
                            <div class="label">${subject.subject_name}</div>
                            <input type="number" class="theDegree" data-id="${subject.id}" />
                            <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>
                        `);
                    }
                },
            });
        },

        /*
            @function firstStudentWithoutDegree
            @return first student without degrees in students list-container
        */
        
        firstStudentWithoutDegree = () => {

            // @variable student container first student in list of list-container
            // @variable major contains major of this student 

            let student = $(".container .cover .add-degree .students .list .option").eq(0),
                major = student.attr("data-major");

            if (student.length) {

                // If there's value in student variable

                /* 
                    put text & value of student to selected name element [Put it as selected option] &
                    remove (disabled) class from student list-container isn't exist
                */

                $(".container .cover .add-degree .students .selected .name").text(student.text());
                $(".container .cover .add-degree .students .selected .name").attr("data-option", student.attr("data-option"));
                $(".container .cover .add-degree .students").removeClass("disabled");

                // Get subject & put its unput

                getSubjects(major);
            } else {

                // If there's not value in student variable

                // Remove students list-container is it exist

                $(`.container .cover .add-degree .students`).remove();

                // Add nothing element to degrees inputs container

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

            // Fired when clicking on pagination arrows [Previous, Next] if it isn't disabled

            // @variable page contains number of page what need
            // @variable currentPage contains number of current page
            // @variable state contains state of that table [Details or Final]
            // @variable isNext contains boolean is user want next page or previous page
            // @variable anyDegrees contains is table we deal with it Details table or Final table
            // @variable lastPage contains lastDetailsPage or lastFinalPage, That depending table we deal with

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

            // Shown wait element for this table

            $(this)
                .parents(".pagination")
                .siblings(".wait-table")
                .css("display", "flex");


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
                    ajax request by (POST) method with (anyDegrees, state, page) as data

                    @return students from this state or all students if state variable equals 0 [depending to state],
                    with it final degrees or details degrees [depending to anyDegrees], from certain page [depending
                    to page]
                */

                $.ajax({
                    url: `${window.location.origin}/admin/page/degrees/${anyDegrees}/${state}?page=${page}`,
                    type: "POST",
                    error: (error) => {
                        // If ajax request fails
                    },
                    success: async (result) => {

                        // If ajax request success execute this asynchronous function

                        // @variable removedSelector contains selector for table we need empty [depeneding anyDegrees value]

                        let removedSelector =
                            anyDegrees === "details"
                                ? ".details-degrees .details .student, .details-degrees .details .nothing"
                                : ".final-degrees .degrees .student:not(.title), .final-degrees .degrees .degree:not(.title),.final-degrees .degrees .nothing";

                        // empty table by it selector that in removedSelector

                        $(`.container ${removedSelector}`).remove();

                        if (result.data.length) {

                            // If result of ajax request has data

                            if (anyDegrees === "details") {

                                // If we deals with details table

                                for (let student of result.data) {
                                    let degreesInfo = "";

                                    for await (let degrees of student.degrees) {

                                        // Put each subject with it degree in degreesInfo [as template]

                                        degreesInfo += `
                                            <div class="name">${degrees.subject.subject_name}</div>
                                            <div class="value">${degrees.degree}%</div>
                                        `;
                                    }

                                    // append each student with his degrees [in info element] in details table

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

                                // If we deals with final table

                                for (let student of result.data) {

                                    // Append each student with total degree in final table

                                    $(".container .final-degrees .degrees")
                                        .append(`
                                        <div class="student">
                                            ${student.first_name} ${student.middle_name} ${student.last_name}
                                        </div>
                                        <div class="degree">${student.degree}%</div>`);
                                }
                            }
                        } else {

                            // If result of ajax request hasn't data

                            // @variable nothing contains nothing template

                            let nothing = `
                                <div class="nothing">
                                    <div class="message">لا يوجد أي طلاب مسجلين حتى الآن</div>
                                </div>
                                `;

                            // Put nothing tamplate in table we deal with

                            anyDegrees === "details"
                                ? $(
                                      ".container .details-degrees .details"
                                  ).append(nothing)
                                : $(
                                      ".container .final-degrees .degrees"
                                  ).append(nothing);
                        }

                        if (page === 1) {

                            // If page equals 1 diable previous arrow in table we deal with

                            $(
                                `.container .${anyDegrees}-degrees .pagination .prev`
                            ).addClass("disabled");
                        } else {

                            // Else enable previous arrow in table we deal with

                            $(
                                `.container .${anyDegrees}-degrees .pagination .prev`
                            ).removeClass("disabled");
                        }

                        if (page === lastPage) {

                            // If page equals lastPage diable next arrow in table we deal with

                            $(
                                `.container .${anyDegrees}-degrees .pagination .next`
                            ).addClass("disabled");
                        } else {

                            // Else enable next arrow in table we deal with

                            $(
                                `.container .${anyDegrees}-degrees .pagination .next`
                            ).removeClass("disabled");
                        }

                        // Put page number in current page in pagination

                        $(
                            `.container .${anyDegrees}-degrees .pagination .pages > .current`
                        ).text(page);

                        setTimeout(() => {

                            // After all above commands end, hide wait element in table

                            $(this)
                                .parents(".pagination")
                                .siblings(".wait-table")
                                .css("display", "none");
                        }, 0);
                    },
                });
            } else {

                // If page greater than lastPage or less than 1, hide wait element in table

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

            // Fired when change state of students, from details table or final table

            // @variable state contains state the user choose it

            state = +$(this).attr("data-option");

            // Shown wait element on this table

            $(this)
                .parents(".list-container")
                .siblings(".wait-table")
                .css("display", "flex");

            // @variable anyDegrees contains is table we deal with it Details table or Final table

            let anyDegrees = $(this)
                .parents(".list-container")
                .parent()
                .hasClass("details-degrees")
                ? "details"
                : "final";

            /*
                Ajax request by (POST) method with [anyDegrees, state] as data

                @return students from this state or all students if state variable equals 0 [depending to state],
                with it final degrees or details degrees [depending to anyDegrees]
            */

            $.ajax({
                url: `${window.location.origin}/admin/page/degrees/${anyDegrees}/${state}`,
                type: "POST",
                error: (error) => {
                    // If ajax request it fails
                },
                success: async (result) => {

                    // If ajax request success

                    // @variable removedSelector contains selector for table we need empty [depeneding anyDegrees value]

                    let removedSelector =
                        anyDegrees === "details"
                            ? ".details-degrees .details .student, .details-degrees .details .nothing"
                            : ".final-degrees .degrees .student:not(.title), .final-degrees .degrees .degree:not(.title),.final-degrees .degrees .nothing";

                    // empty table by it selector that in removedSelector

                    $(`.container ${removedSelector}`).remove();

                    if (result.data.length) {

                        // If result of ajax request has data

                        if (anyDegrees === "details") {

                            // If we deals with details table

                            for (let student of result.data) {
                                let degreesInfo = "";

                                for await (let degrees of student.degrees) {

                                    // Put each subject with it degree in degreesInfo [as template]

                                    degreesInfo += `
                                        <div class="name">${degrees.subject.subject_name}</div>
                                        <div class="value">${degrees.degree}%</div>
                                    `;
                                }

                                // append each student with his degrees [in info element] in details table

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

                            // If we deals with final table

                            for (let student of result.data) {

                                // Append each student with total degree in final table

                                $(".container .final-degrees .degrees").append(`
                                    <div class="student">
                                        ${student.first_name} ${student.middle_name} ${student.last_name}
                                    </div>
                                    <div class="degree">${student.degree}%</div>`);
                            }
                        }
                    } else {

                        // If result of ajax request hasn't data
                        // @variable nothing contains nothing template

                        let nothing = `
                            <div class="nothing">
                                <div class="message">لا يوجد أي طلاب مسجلين حتى الآن</div>
                            </div>
                            `;

                        // Put nothing tamplate in table we deal with


                        anyDegrees === "details"
                            ? $(".container .details-degrees .details").append(
                                  nothing
                              )
                            : $(".container .final-degrees .degrees").append(
                                  nothing
                              );
                    }

                    // Remove what in bottom of this table [Pagination of Footer]

                    $(
                        `.container .${anyDegrees}-degrees .pagination, .container .${anyDegrees}-degrees .footer-table`
                    ).remove();

                    /*
                        If anyDegrees equals details then assigning value (result.last_page) to (lastDetailsPage)
                        else assigning value (result.last_page) to (lastFinalPage)
                    */

                    anyDegrees === 'details' ?
                        lastDetailsPage = result.last_page :
                        lastFinalPage = result.last_page;


                    if (result.last_page > 1) {

                        // If (result.last_page) greater than 1

                        // Append Pagination to end of this table

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

                        // Else, append footer to end of this table

                        $(`.container .${anyDegrees}-degrees .add`).after(`
                            <div class="footer-table"></div>
                        `);
                    }

                    setTimeout((_) => {

                        // After all above commands end, hide wait element in this table

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

            // Fired when change student user want add degrees to him in students list-container

            // @variable major contains major of this student

            let major = $(this).attr("data-major");

            /* @function getSubject return all subjects related with this major + shared subjects,
            and put it in inputs [add or edit] screen */

            getSubjects(major);
        }
    );

    $("body").on("click" , ".container .details-degrees .details .student .info-name .title .options .edit", function () {

        // Fired when click on edit button on any student row

        // If confirm element is shown end this function

        if ($(".confirm").css("display") !== 'none')
            return;

        // @variable currentId contains SSN for chosen student

        currentId = +$(this).parents(".student").attr("data-ssn");

        /*
            Ajax request by (GET) method with (currentId) as data

            @return details degrees of certain student by SSN of him
        */

        $.ajax({
            url: `${window.location.origin}/admin/student/degrees/${currentId}`,
            method: "GET",
            error: errors => {
                // If ajax request fails
            },
            success: async result => {

                // If ajax request success

                // @variable student has details degrees of student with subjects names

                let student = result[0];

                if (!$(".container .cover .add-degree .students").length) {

                    /*
                        If students list-container is not exist [this happen when all students in system
                        have degrees]
                    */

                   // Append list-contains before degrees element

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

                // Get full name with ssn value in selected name
                
                $(".container .cover .add-degree .students .selected .name").text(
                    `${student.first_name} ${student.middle_name} ${student.last_name}`
                );
                $(".container .cover .add-degree .students .selected .name").attr("data-option", student.ssn);

                // Add class disabled to students list-container

                $(".container .cover .add-degree .students").addClass("disabled");

                // Empty degrees element

                $(".container .cover .add-degree .degrees").empty();

                // Append error element as first element in degrees [this error element for students list-container]

                $(".container .cover .add-degree .degrees").append(`<div class="error"></div>`);


                for await (let degree of student.degrees) {

                    // Append each subject with it degree in degrees element

                    $(".container .cover .add-degree .degrees").append(`
                        <div class="label">${degree.subject.subject_name}</div>
                        <input type="text" class="theDegree" data-id="${degree.subject_id}" value="${degree.degree}" />
                        <div class="error"></div>
                    `);
                }

                // Shown cover element and hidden the scroll of page

                $(".cover").fadeIn();
                $("body").css("overflow", "hidden");
            }   
        });
    });

    $("body").on("click", ".container .cover .add-degree .buttons > .cancel", () => {

        // Fired when click on cancel button in [add, edit] screen

        if (!$(".container .cover .add-degree .buttons > .send").hasClass('waiting')) {

            // If ajax request isn't processing [By send button isn't has waiting class]

            // @variable currentId contains 0

            currentId = 0;

            // @function firstStudentWithoutDegree to put first student without degree in students list-container

            firstStudentWithoutDegree();
        }
    });

    $("body").on(
        "click",
        ".container .cover .add-degree .buttons > .send:not(.waiting)",
        async function () {

            // Fired when click on send button and this button isn't has class (waiting)

            // add class waiting for this button

            $(this).addClass('waiting');

            // Reset error elements

            $(".container .cover .add-degree .degrees .error").text("");
            $(".container .cover .add-degree .degrees .error").css(
                "display",
                "none"
            );

            /*
                @variable formData container for put inputs value in it
                @variable degreesArray to contains degrees in inputs
                @variable operator contains type of operation execute now [create, edit], through is currentId
                    equals 0 or not
                @variable ssn has ssn for selected student
            */

            let formData = new FormData(),
                degreesArray = {},
                operator = currentId === 0 ? 'create' : 'edit',
                ssn = $(
                    ".container .cover .add-degree .students .selected .name"
                ).attr("data-option");

            // Add ssn value to formData by name student

            formData.append("student", ssn);

            for await (let input of $(
                ".container .cover .add-degree .degrees input.theDegree"
            )) {

                // add each degree to degreesArray by index name id of subject

                degreesArray[$(input).attr("data-id")] = $(input).val();
            }

            // convert degreesArray to string and append to formData by name degrees

            degreesArray = JSON.stringify(degreesArray);
            formData.append("degrees", degreesArray);

            // ajax request by (POST) method, depending value of oprerator creating or editing student degrees with formData as data

            // @void add new student degrees or editing student degrees

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

                    // If ajax request fails

                    if (errors.status === 422) {

                        // If status 422 that means error in entered value by user

                        // @variable error has error in inputs
                        // @variable studentError has error if it in students list-container
                        // @variable inputs contains selector for all inputs

                        let error = errors.responseJSON.message,
                            studentError = errors.responseJSON.errors.student,
                            inputs = $(
                                ".container .cover .add-degree .degrees input.theDegree"
                            );

                        if (studentError) {

                            // If error in students list-container put error in first error element

                            $(".container .cover .add-degree .degrees .error")
                                .eq(0)
                                .text(studentError[0]);
                        }

                        if (error === "er100") {

                            // If error is er100 that means there's subject/s id/s field/s is empty

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

                            // If error is er101 that means there's subject/s id/s not number/s

                            inputs
                                .filter(function () {
                                    return isNaN(+$(this).attr("data-id"));
                                })
                                .next(".error")
                                .text("المعرّف الخاص بهذه المادة ليس رقماً.");
                        } else if (error === "er102") {

                            // If error is er102 that means there's input/s empty

                            inputs
                                .filter(function () {
                                    return $(this).val().trim() === "";
                                })
                                .next(".error")
                                .text("لا يمكنك ترك هذه المادة من دون درجة.");
                        } else if (error === "er103") {

                            // If error is er103 that means there's input/s hasn't number/s

                            inputs
                                .filter(function () {
                                    return isNaN(+$(this).val().trim());
                                })
                                .next(".error")
                                .text("يجب أن تكون درجة المادة رقماً.");
                        } else if (error === "er104") {

                            // If error is er104 that means there's input/s with number/s greater than 100

                            inputs
                                .filter(function () {
                                    return $(this).val().trim() > 100;
                                })
                                .next(".error")
                                .text(
                                    "لا يمكن أن تكون درجة المادة أكثر من 100."
                                );
                        } else if (error === "er105") {

                            // If error is er105 that means there's input/s with number/s less than 0

                            inputs
                                .filter(function () {
                                    return $(this).val().trim() < 0;
                                })
                                .next(".error")
                                .text("لا يمكن أن تكون درجة المادة أقل من 0.");
                        } else if (!isNaN(+error)) {

                            // This's error mean there's id for subject and this id is not exist in DB

                            $(
                                `.container .cover .add-degree .degrees input[data-id='${error}']`
                            )
                                .next(".error")
                                .text("هذه المادة غير موجودة.");
                        }

                        // Shown any error element contains error [not empty]

                        $(".container .cover .add-degree .degrees .error")
                            .filter(function () {
                                return $(this).text() !== "";
                            })
                            .css("display", "block");
                    }
                },
                success: (result) => {

                    // If ajax request success

                    if (result === "success") {

                        // If operation success

                        // hide cover element

                        $(".cover").fadeOut(400, () => {

                            // After hide cover element

                            if (operator === 'create') {

                                // If operator was create

                                // remove this student from list of students list-container

                                $(
                                    `.container .cover .add-degree .students .list .option[data-option='${ssn}']`
                                ).remove();

                            } else {

                                // If operator was edit

                                // assigning 0 to currentId

                                currentId = 0;
                            }

                            // Put first student without degree to students list-container

                            firstStudentWithoutDegree();

                            // Shown scroll of page

                            $("body").css("overflow-y", "auto");
                        });

                        // this's was create or edit operation, to put create success or edit success in message variable

                        let message = operator === 'create' ? 'تمت إضافة درجات الطالب بنجاح' : 'تم تعديل درجات الطالب بنجاح';

                        // Shown this's message

                        attentionShow(message);

                        // Refresh degrees tables

                        refreshDegrees();
                    }
                },
                complete: _ => {

                    // After ajax request end, remove waiting class from send button

                    $(this).removeClass('waiting');
                }
            });
        }
    );

    $("body").on("click", ".container .details-degrees .details .student .info-name .title .options .delete", function () {

        // Fired when click on delete button on any student row

        // assigning ssn for this student to currentId

        currentId = $(this).parents(".student").attr("data-ssn");

        // Shown confirm element

        $(".confirm").fadeIn();
    });

    $("body").on("click", ".container .confirm .body .no", () => {

        // Fired when click on no button in confirm element

        // assigning 0 to currentId

        currentId = 0;

        // Hide confirm element

        $(".confirm").fadeOut();
    });

    $("body").on("click", ".container .confirm .body .yes", () => {

        // Fired when click yes button in confirm element

        // Add class waiting for confirm element

        $(".confirm").addClass('waiting');

        // Shown wait element on degrees tables

        $(".wait-table").fadeIn();
        $(".wait-table").css('display', 'flex');

        // Ajax request by (DELETE) method and currentId as data

        // @void delete student degree that ssn in currentId

        $.ajax({
            url: `${window.location.origin}/admin/degrees/delete/${currentId}`,
            method: 'DELETE',
            error: errors => {

                // if ajax request fails shown error message on screen

                attentionShow('حدث خطأ ما، أعد المحاولة بعد التحقق من اتصالك الشبكة');
            },
            success: result => {

                // If ajax request is success

                if (result === 'success') {

                    // If return success shown success message on screen

                    attentionShow('تم حذف درجات الطالب بنجاح');

                    // Refresh degrees tables

                    refreshDegrees();
                } else if (result === 'unexists') {

                    // If return unexists value that's means this student isn't exist and shown unexists message on screen

                    attentionShow('هذه الدرجات ليس لها وجود');
                }
            },
            complete: _ => {

                // If ajax request complete

                // Assigning 0 to currentId

                currentId = 0;

                // Hide wait element in tables

                $(".wait-table").fadeOut();

                // hide confirm element
                
                $(".confirm").fadeOut(400, () => {

                    // After hide confirm remove class waiting

                    $(".confirm").removeClass('waiting');
                });
            }
        });
    });
});
