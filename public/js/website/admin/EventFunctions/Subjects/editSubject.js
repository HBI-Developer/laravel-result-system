export default function () {
    if ($(".confirm").css("display") !== "none") return;

    subjectId = +$(this)
        .parents(".column")
        .children(".subject")
        .attr("data-id");

    let major = $(this).parent().siblings(".name").text().trim(),
        subject = $(this).parents(".column").children(".subject").text().trim(),
        majorId = $(`.list-container .list .option:contains('${major}')`).attr(
            "data-option"
        );

    $(".list-container .selected .name").text(major);

    $(".list-container .selected .name").attr("data-option", majorId);

    $(".container .cover .add-subject .inputs input").val(subject);

    $(".cover").fadeIn();
}
