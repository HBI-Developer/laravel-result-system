
// This JavaScript File to statistics page in admin dashboard

$(() => { // if page is ready


    $("body").on("click", ".list-container .list .option", function() {

        // fired when change state in statistics tables

        // Shown wait element in statistics table

        $(".wait-table").fadeIn();
        $(".wait-table").css("display", "flex");

        // @varible state contains chosen state

        let state = +$(this).attr("data-option");

        // Ajax request by (POST) method and state as data
        // @return students statistics from DB

        $.ajax({
            url: `${window.location.origin}/admin/statistics/${state}`,
            method: "POST",
            error: errors => {

                // If ajax request fails shown error message on screen 

                attentionShow('حدث خطأ ما، تأكد من اتصالك بالإنترنت ثم أعد المحاولة.');
            },
            success: result => {

                // If ajax request success

                // @variable details has statistics for each subject
                // @variable total has total degrees for (males, females, both)

                let details = result.details_statistics,
                    total = result.total_statistics;

                for (let detail of details) {

                    // For each subject

                    // @variable statistic has selector for this subject statistic place
                    
                    let statistic = $(`.container .subjects-statistics .statistics-table .subject:contains(${detail.subject})`).next('.statistic');

                    // add statistic for this subject in subject statistics place for (males, females, all)

                    statistic.children('.male').css("width", `${detail.males}%`);
                    statistic.children('.female').css("width", `${detail.females}%`);
                    statistic.children('.all').css("width", `${detail.all}%`);

                    // Shown degree for both in subject percentage place

                    statistic.next(".percentage").text(`${detail.all}%`);
                }

                // remove active class from statistics and add active class for (all) statistics

                $(".container .subjects-statistics .statistics-table .statistic > *").removeClass("active");
                $(".container .subjects-statistics .statistics-table .statistic > .all").addClass("active");

                // Add total degrees for graphs with degrees number for (males, females, both)

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

                // After ajax request complete

                // Hide wait element in table

                $(".wait-table").fadeOut();
            }
        });
    });
    
    $("body").on("click", ".container .subjects-statistics .statistics-table .statistic > *", function () {

        // Fired when user select statistic in certain subject for see degree number in percentage place

        // Add active class for this statistic and remove from siblings statistics

        $(this).addClass("active").siblings().removeClass("active");

        // Put this degree number in percentage for this subject

        $(this).parent().next(".percentage").text(`${$(this).attr("data-percent")}%`)
    });
});