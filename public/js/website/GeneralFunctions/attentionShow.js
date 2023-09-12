export default (text) => {
    $("body").append(`
        <div class="attention">${text}</div>
    `);

    $(".attention")
        .delay(2000)
        .fadeOut(400, function () {
            $(this).remove();
        });
};
