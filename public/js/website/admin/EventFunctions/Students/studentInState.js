export default function () {
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
                        </div>`);
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
