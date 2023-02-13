$(() => {

    $("body").on("click", ".list-container .list .option", function() {

        $(".wait-table").fadeIn();

        $(".wait-table").css("display", "flex");

        let state = +$(this).attr("data-option");

        $.ajax({
            url: `${window.location.origin}/admin/statistics/${state}`,
            method: "POST",
            error: () => {
                
                attentionShow('حدث خطأ ما، تأكد من اتصالك بالإنترنت ثم أعد المحاولة.');

            },
            success: result => {

                let details = result.details_statistics,
                    total = result.total_statistics;

                for (let detail of details) {
    
                    let statistic = $(`.container .subjects-statistics .statistics-table .subject:contains(${detail.subject})`).next('.statistic');

                    statistic.children('.male').css("width", `${detail.males}%`);

                    statistic.children('.female').css("width", `${detail.females}%`);

                    statistic.children('.all').css("width", `${detail.all}%`);

                    statistic.next(".percentage").text(`${detail.all}%`);

                }

                $(".container .subjects-statistics .statistics-table .statistic > *").removeClass("active");

                $(".container .subjects-statistics .statistics-table .statistic > .all").addClass("active");

                $(".container .gender-statistics .statistics .statistic-box:nth-child(1) .percentage .small-circle").text(`${
                    total.males
                }%`);

                $(".container .gender-statistics .statistics .statistic-box:nth-child(2) .percentage .small-circle").text(`${
                    total.females
                }%`);

                $(".container .gender-statistics .statistics .statistic-box:nth-child(3) .percentage .small-circle").text(`${
                    total.all
                }%`);

                $(".container .gender-statistics .statistics .statistic-box:nth-child(1) .percentage .cover-one").css("--degree", `${
                        (total.males / 100) * 360
                    }deg`);

                $(".container .gender-statistics .statistics .statistic-box:nth-child(2) .percentage .cover-one").css("--degree", `${
                        (total.females / 100) * 360
                    }deg`);

                $(".container .gender-statistics .statistics .statistic-box:nth-child(3) .percentage .cover-one").css("--degree", `${
                        (total.all / 100) * 360
                    }deg`);

            },
            complete: _ => {

                $(".wait-table").fadeOut();

            }

        });

    });
    
    $("body").on("click", ".container .subjects-statistics .statistics-table .statistic > *", function () {

        $(this).addClass("active").siblings().removeClass("active");

        $(this).parent().next(".percentage").text(`${$(this).attr("data-percent")}%`)

    });
    
});