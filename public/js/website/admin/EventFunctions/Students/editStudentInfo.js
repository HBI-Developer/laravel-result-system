export default function () {
    if ($(".confirm").css("display") !== "none") return;

    let nameSelector = $(this).parent().siblings(".name").children("span"),
        name = [
            nameSelector.eq(0).text(),
            nameSelector.eq(1).text(),
            nameSelector.eq(2).text(),
        ],
        info = $(this)
            .parents(".info-name")
            .siblings(".info")
            .children(".value"),
        inputs = $(".cover .student-inputs .inputs"),
        gender = inputs
            .children(".gender")
            .children(".list")
            .children(`.option:contains('${info.eq(2).text()}')`),
        state = inputs
            .children(".state")
            .children(".list")
            .children(`.option:contains('${info.eq(4).text()}')`),
        major = inputs
            .children(".major")
            .children(".list")
            .children(`.option:contains('${info.eq(6).text()}')`);

    inputs.children("[name='first_name']").val(name[0]);

    inputs.children("[name='middle_name']").val(name[1]);

    inputs.children("[name='last_name']").val(name[2]);

    inputs.children("[name='ssn']").val(info.eq(0).text());

    inputs.children("[name='ssn']").prop("disabled", true);

    inputs.children("[name='age']").val(info.eq(1).text());

    inputs.children("[name='school']").val(info.eq(3).text());

    inputs.children("[name='sitting_number']").val(info.eq(5).text());

    inputs
        .children(".gender")
        .children(".selected")
        .children(".name")
        .text(gender.text())
        .attr("data-option", gender.attr("data-option"));

    inputs
        .children(".state")
        .children(".selected")
        .children(".name")
        .text(state.text())
        .attr("data-option", state.attr("data-option"));

    inputs
        .children(".major")
        .children(".selected")
        .children(".name")
        .text(major.text())
        .attr("data-option", major.attr("data-option"));

    currentId = info.eq(0).text();

    $(".cover").fadeIn();

    $(".cover").css("display", "flex");

    $("body").css("overflow", "hidden");
}
