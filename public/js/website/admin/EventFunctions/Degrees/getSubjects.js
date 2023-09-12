export default (major) => {
    $.ajax({
        url: `${window.location.origin}/admin/major/subjects/${major}`,
        type: "get",
        success: (result) => {
            $(".container .cover .add-degree .degrees").empty();

            $(".container .cover .add-degree .degrees").append(
                `<div class="error"></div>`
            );

            for (let subject of result) {
                $(".container .cover .add-degree .degrees").append(`
                    <div class="label">${subject.subject_name}</div>
                    <input type="number" class="theDegree" data-id="${subject.id}" />
                    <div class="error">لا يمكنك ترك هذا الحقل فارغاً.</div>
                `);
            }
        },
    });
};
