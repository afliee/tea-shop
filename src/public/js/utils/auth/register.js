$(document).ready(function () {
    const signUpForm = $("#formAuthentication");

    signUpForm.on("submit", function ( event ) {
        event.preventDefault();

        const email = $("#email").val();
        const password = $("#password").val();

        const terms = $(".terms").is(":checked");

        if (!terms) {
            // remove class d-none
            $('.error').removeClass('d-none');
            $('.error').html("<strong>Oh snap!</strong> Change a few things up and try submitting again.")
        }

        const data = email && password && terms ? {
            email,
            password
        } : null;

        if (data) {
            $.ajax({
                url: '/auth/register',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                beforeSend: function () {
                    $('.error').addClass('d-none');
                    $('.next-notify').addClass('d-none');
                    $('.btn-signup').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...')
                },
                success: function ( data ) {
                    console.log(data)
                    // hide regis-card class in 300ms
                    $('.regis-card').animate({
                        opacity: 0
                    }, 300, function () {
                        $(this).addClass('d-none');
                    })
                    $('.btn-signup').html('Sign up')
                    $('.next-notify').removeClass('d-none');

                    $('#email-notify').val(email);
                },
                error: function ( error ) {
                    console.log(error)
                    $('.error').removeClass('d-none');
                    // $('.error').html("<strong>Oh snap!</strong> Change a few things up and try submitting again.")
                    $('.error').html(error.responseJSON.message)
                }
            })
        }
    });
})