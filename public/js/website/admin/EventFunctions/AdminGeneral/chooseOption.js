export default function () {
    $(this)
        .parent()
        .prev()
        .children(".name")
        .text($(this).text())
        .attr("data-option", $(this).attr("data-option"));

    $(".selected + .list").css("transform", "scaleY(0)");

    $(".selected .open-arrow").css("transform", "rotateZ(90deg)");
}
