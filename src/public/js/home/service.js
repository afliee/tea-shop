$(document).ready(function () {
    const formService = $('#form_service');

    formService.on('submit', function (e) {
        e.preventDefault();

        const name = $('#name').val();
        const email = $('#email').val();
        const subject = $('#subject').val();
        const message = $('#message').val();

        if (!name || !email || !subject || !message) {
            $('.error_alert').removeClass('d-none').addClass('d-block');
            $('.error_alert').addClass('alert-danger');

            $('.error_message').html('All fields are required');
        }

        $.ajax({
            url: '/service',
            method: 'POST',
            data: {
                name,
                email,
                subject,
                message
            },
            success: function (response) {
                console.log(response);
                $('.error_alert').removeClass('d-none').addClass('d-block');
                $('.error_alert').addClass('alert-success');

                $('.error_message').html(response.message);
            },
            error: function (error) {
                console.log(error);
                $('.error_alert').removeClass('d-none').addClass('d-block');
                $('.error_alert').addClass('alert-danger');

                $('.error_message').html(error.responseJSON.message);
            }
        });
    })
})