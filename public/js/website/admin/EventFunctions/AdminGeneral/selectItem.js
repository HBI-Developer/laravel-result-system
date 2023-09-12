export default function () {
    if (
        $(this).next().hasClass("list") &&
        !$(this).parent().hasClass("disabled")
    ) {
        let isOpen =
            $(this).next().css("transform") === "matrix(1, 0, 0, 1, 0, 0)";

        $(".selected + .list").css("transform", "scaleY(0)");

        $(".selected .open-arrow").css("transform", "rotateZ(90deg)");

        if (!isOpen) {
            $(this).next().css("transform", "scaleY(1)");

            $(this).children(".open-arrow").css("transform", "rotateZ(270deg)");
        }
    }
}
