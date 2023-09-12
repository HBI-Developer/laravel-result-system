export default (_) => {
    $(".wait-table").fadeIn();

    $(".wait-table").css("display", "flex");

    $.ajax({
        url: `${window.location.origin}/admin/major/subjects/0`,
        method: "GET",
        success: (result) => {
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
        complete: (_) => {
            $(".wait-table").fadeOut();
        },
    });
};
