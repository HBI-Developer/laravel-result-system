
// This JavaScript File to subjects page in admin dashboard

$(() => { // When page is ready

    // @function refreshSubjects refresh subjects table by info from DB

    const refreshSubjects = _ => {

            $(".wait-table").fadeIn();
            $(".wait-table").css("display", "flex");

            $.ajax({
                url: `${window.location.origin}/admin/major/subjects/0`,
                method: 'GET',
                error: errors => {},
                success: result => {

                    $(".container .subjects-table .column:not(.title)").remove();

                    if (result.length) {
                        for (let subject of result) {
                            $(".container .subjects-table .add").before(`
                                <div class="column">
                                    <div class="subject" data-id="${subject.id}"> ${subject.subject_name} </div>
                                    <div class="major">
                                        <div class="name"> ${subject.specialization} </div>
                                        <div class="options">
                                            <div class="edit">
                                                <div class="icon edit-icon"></div>
                                            </div>
                                            <div class="delete">&minus;</div>
                                        </div>
                                    </div>
                                </div>
                            `);
                        }
                    } else {
                        $(".container .subjects-table .add").before(`
                            <div class="nothing">
                                لا توجد أي مواد مضافة حتى الآن.
                            </div>
                        `);
                    }
                    
                },
                complete: _ => {
                    $(".wait-table").fadeOut();
                }
            });
        };

    // @variable subjectId contains subject id in case edit and delete

    let subjectId = -1;

    $("body").on("click", ".container .subjects-table .column:not(.title) .major .options .edit", function () {

        // Fired when click on edit button on any subject row

        // If confirm element is shown end this function

        if ($(".confirm").css("display") !== 'none')
            return;

        // Assigning id of subject to subjectId
            
        subjectId = +$(this).parents('.column').children(".subject").attr("data-id");

        // @variable major contains major of chosen subject
        // @variable subject contains name of subject
        // @variable majorId contains id for major of chosen subject

        let major = $(this).parent().siblings('.name').text().trim(),
            subject = $(this).parents('.column').children(".subject").text().trim(),
            majorId = $(`.list-container .list .option:contains('${major}')`).attr("data-option");

        // put values in inputs

        $(".list-container .selected .name").text(major);
        $(".list-container .selected .name").attr("data-option", majorId);
        $(".container .cover .add-subject .inputs input").val(subject);

        // Shown cover element

        $(".cover").fadeIn();
    });

    $("body").on("click", ".container .cover .add-subject .buttons > .cancel", () => {

        // Fired when click on cancel button in [add, edit] screen

        if (!$(".container .cover .add-subject .buttons > .send").hasClass('waiting')) {

            // If ajax request isn't processing [By send button isn't has waiting class]

            // @variable currentId contains -1

            subjectId = -1;
        }
    });

    $("body").on("click", '.container .cover .add-subject .buttons > .send:not(.waiting)', async () => {

        // Fired when click on send button and this button isn't has class (waiting)

        // add class waiting for this button

        $(this).addClass('waiting');

        // Reset error elements

        $('.error').text("");
        $('.error').css('display', 'none');

        /*
            @variable formData container for put inputs value in it
            @variable operator contains type of operation execute now [create, edit], through is subjectId
                equals 0 or not
        */

        let formData = new FormData(),
            operator = subjectId !== -1 ? 'edit' : 'create';

        for await (let input of $(".cover .inputs input")) {

            // Append inputs value with name of inputs to formData

            formData.append(input.name, input.value);
        }

        // is operator is edit append subject id to formData

        operator === 'edit' ? formData.append('id', subjectId) : '';

        // @variable list contains selectors of list-containers

        let lists = $(
            ".cover .inputs .list-container .selected .name"
        );

        for await (let input of lists) {

            // @variable value contains selected value in list-container or empty string

            let value = input.dataset.option ?? '';

            // Append value with name of list-conatiner [as class] to formData

            formData.append(input.parentElement.parentElement.classList[1], value);
        }

        // ajax request by (POST) method, depending value of oprerator creating or editing subject with formData as data

        // @void add new subject or editing subject info

        $.ajax({
            url: `${window.location.origin}/admin/subjects/${operator}`,
            method: 'POST',
            data: formData,
            cache: false,
            processType: false,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            error: errors => {

                // If ajax request fails

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

                // If ajax request success

                if (result == 'success') {

                    // If return success

                    // hide cover element

                    $(".cover").fadeOut(400, _ => {

                        // message contains success message of [create, edit] depending of operation

                        let message = operator === 'create' ? 'تم إضافة المقرر بنجاح' : 'تم تعديل بيانات المقرر بنجاح';

                        // Shown success message on screen 
                        
                        attentionShow(message);

                        // Shown scroll of page
                        
                        $('body').css('overflow-y', 'auto');
                        
                        // assigning -1 to subjectId
                        
                        subjectId = -1;
                        
                        // Refresh subjects table

                        refreshSubjects();
                    });
                } else if (result === 'unexists') {

                    // If return unexist [in edit] that means this subject is not exist in DB

                    // Shown message of unexist subject on screen

                    attentionShow('هذا المقرر غير موجود');
                }
            }
        });
    });
    
    $("body").on("click", ".container .subjects-table .column:not(.title) .major .options .delete", function () {

        // Fired when click on delete button on any subject row

        // assigning id for this subject to currentId

        subjectId = +$(this).parents('.column').children(".subject").attr("data-id");

        // Shown confirm element

        $(".confirm").fadeIn();
    });

    $("body").on("click", ".container .confirm .body .buttons .no", () => {

        // Fired when click on no button in confirm element

        // assigning -1 to subjectId

        subjectId = -1;

        // Hide confirm element

        $(".confirm").fadeOut();
    });

    $("body").on("click", ".container .confirm .body .buttons .yes", () => {

        // Fired when click yes button in confirm element

        // Add class waiting for confirm element

        $(".confirm").addClass('waiting');

        // Ajax request by (DELETE) method and subjectId as data

        // @void delete subject that id in subjectId

        $.ajax({
            url: `${window.location.origin}/admin/subjects/delete/${subjectId}`,
            method: "DELETE",
            error: errors => {

                // if ajax request fails shown error message on screen

                attentionShow('حدث خطأ ما، أعد المحاولة بعد التحقق من اتصالك الشبكة');
            },
            success: results => {

                // If ajax request is success

                if (results == 'success') {

                    // If return success shown success message on screen

                    attentionShow('تم حذف المقرر بنجاح');

                    // Refresh subjects table

                    refreshSubjects();
                } else if (result === 'unexists') {

                    // If return unexists value that's means this subject isn't exist and shown unexists message on screen

                    attentionShow('هذا المقرر غير موجود');
                }
            },
            complete: _ => {

                // If ajax request complete

                // Assigning -1 to subjectId

                subjectId = -1;
                
                // hide confirm element

                $(".confirm").fadeOut(400, () => {

                    // After hide confirm remove class waiting

                    $(".confirm").removeClass('waiting');
                });
            }
        });
    });
});