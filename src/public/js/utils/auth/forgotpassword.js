$(document).ready(function () {
    const formForgotPassword = $('#formForgotPassword');
    const password = $('#password');
    const confirmPassword = $('#confirmpassword');

    const url = window.location.href
    const id = url.split("/")[url.split("/").length - 1]


    formForgotPassword.on("submit", (e) => {
        e.preventDefault()
        $.ajax({
            url: `/auth/forgot-password?id=${id}`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                id: id,
                password: password.val(),
                confirmPassword: confirmPassword.val()
            }),
            success: (data) => {
                console.log(data)
                window.location.href = "/auth/login"
            },
            error: (error) => {
                console.log(error)
                $('.error').removeClass('d-none');
                // $('.error').html("<strong>Oh snap!</strong> Change a few things up and try submitting again.")
                $('.error').html(error.responseJSON.message)
            }
        })
    })
})