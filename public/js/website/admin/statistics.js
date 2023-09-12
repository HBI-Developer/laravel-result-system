import getStateStatistics from "./EventFunctions/Statistics/getStateStatistics.js";

$(() => {
    $("body").on("click", ".list-container .list .option", getStateStatistics);

    $("body").on(
        "click",
        ".container .subjects-statistics .statistics-table .statistic > *",
        function () {
            $(this).addClass("active").siblings().removeClass("active");

            $(this)
                .parent()
                .next(".percentage")
                .text(`${$(this).attr("data-percent")}%`);
        }
    );
});
