$(() => {

    $("body").on("click", ".start-page", () => {

        $(".start-page").animate(
            {
                top: "-100%",
            },
            200,
            function () {

                $(this).remove();

            }

        );

    });
    
});
