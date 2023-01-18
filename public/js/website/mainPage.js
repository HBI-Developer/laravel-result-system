
// This JavaScript File execute in first page in website [index file]

$(() => { // When page be ready

    $("body").on("click", ".start-page", () => {

        // Fired when click on start page element

        // Move start page element to top with animation

        $(".start-page").animate(
            {
                top: "-100%",
            },
            200,
            function () {

                // After animation end remove start page element

                $(this).remove();
            }
        );
    });
});
