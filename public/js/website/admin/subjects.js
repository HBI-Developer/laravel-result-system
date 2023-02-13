$(() => {

    const refreshSubjects = _ => {

            $(".wait-table").fadeIn();

            $(".wait-table").css("display", "flex");

            $.ajax({
                url: `${window.location.origin}/admin/major/subjects/0`,
                method: 'GET',
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

    let subjectId = -1;

    $("body").on("click", ".container .subjects-table .column:not(.title) .major .options .edit", function () {

        if ($(".confirm").css("display") !== 'none')
            return;
            
        subjectId = +$(this).parents('.column').children(".subject").attr("data-id");

        let major = $(this).parent().siblings('.name').text().trim(),
            subject = $(this).parents('.column').children(".subject").text().trim(),
            majorId = $(`.list-container .list .option:contains('${major}')`).attr("data-option");

        $(".list-container .selected .name").text(major);

        $(".list-container .selected .name").attr("data-option", majorId);

        $(".container .cover .add-subject .inputs input").val(subject);

        $(".cover").fadeIn();

    });

    $("body").on("click", ".container .cover .add-subject .buttons > .cancel", () => {

        if (!$(".container .cover .add-subject .buttons > .send").hasClass('waiting')) {

            subjectId = -1;

        }

    });

    $("body").on("click", '.container .cover .add-subject .buttons > .send:not(.waiting)', async () => {

        $(this).addClass('waiting');

        $('.error').text("");

        $('.error').css('display', 'none');

        let formData = new FormData(),
            operator = subjectId !== -1 ? 'edit' : 'create';

        for await (let input of $(".cover .inputs input")) {

            formData.append(input.name, input.value);

        }

        operator === 'edit' ? formData.append('id', subjectId) : '';

        let lists = $(
            ".cover .inputs .list-container .selected .name"
        );

        for await (let input of lists) {

            let value = input.dataset.option ?? '';

            formData.append(input.parentElement.parentElement.classList[1], value);

        }

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

                if (errors.status === 422) {

                    let errorsJson = JSON.parse(errors.responseText);
                    
                    $.each(errorsJson.errors, (input, error) => {

                        $(`input[name="${input}"] + .error, list-container.${input} + .error`).css('display', 'block').text(error[0]);

                    });

                }

            },
            success: result => {

                if (result == 'success') {

                    $(".cover").fadeOut(400, _ => {

                        let message = operator === 'create' ? 'تم إضافة المقرر بنجاح' : 'تم تعديل بيانات المقرر بنجاح';
                        
                        attentionShow(message);
                        
                        $('body').css('overflow-y', 'auto');
                        
                        subjectId = -1;

                        refreshSubjects();

                    });

                } else if (result === 'unexists') {

                    attentionShow('هذا المقرر غير موجود');

                }

            }

        });

    });
    
    $("body").on("click", ".container .subjects-table .column:not(.title) .major .options .delete", function () {

        subjectId = +$(this).parents('.column').children(".subject").attr("data-id");

        $(".confirm").fadeIn();

    });

    $("body").on("click", ".container .confirm .body .buttons .no", () => {

        subjectId = -1;

        $(".confirm").fadeOut();

    });

    $("body").on("click", ".container .confirm .body .buttons .yes", () => {

        $(".confirm").addClass('waiting');

        $.ajax({
            url: `${window.location.origin}/admin/subjects/delete/${subjectId}`,
            method: "DELETE",
            error: () => {

                attentionShow('حدث خطأ ما، أعد المحاولة بعد التحقق من اتصالك الشبكة');

            },
            success: results => {

                if (results == 'success') {

                    attentionShow('تم حذف المقرر بنجاح');

                    refreshSubjects();

                } else if (result === 'unexists') {

                    attentionShow('هذا المقرر غير موجود');

                }

            },
            complete: _ => {

                subjectId = -1;

                $(".confirm").fadeOut(400, () => {

                    $(".confirm").removeClass('waiting');

                });

            }

        });

    });
    
});