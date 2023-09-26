$(document).ready(function () {
    $('.logout').on('click', function (e) {
        e.preventDefault();

        const href = $(this).attr('href');

        $.ajax({
            url: href,
            method: 'GET',
            success: function (data) {
                window.location.href = data.redirect;
            },
            error: function (err) {
                console.log(err);
            }
        })
    })
})