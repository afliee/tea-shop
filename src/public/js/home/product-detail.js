$(document).ready(function () {
    console.log('product detail');
    const btnPlus = $('.btn-plus');
    const btnMinus = $('.btn-minus');
    const btnAddToCart = $('.btn__add-cart');
    const inputQuantity = $('.input-quantity');

    getTotal();

    btnPlus.on('click', function () {
        let quantity = parseInt(inputQuantity.val());
        inputQuantity.val(quantity + 1);
    })

    btnMinus.on('click', function () {
        let quantity = parseInt(inputQuantity.val());
        if (quantity > 1) {
            inputQuantity.val(quantity - 1);
        }
    })

    inputQuantity.on('change', function () {
        // check if input is not a number
        if (isNaN(parseInt(inputQuantity.val()))) {
            inputQuantity.val(1);
        }

        let quantity = parseInt(inputQuantity.val());
        if (quantity < 1) {
            inputQuantity.val(1);
        }
    })

    btnAddToCart.on('click', function (e) {
        e.preventDefault();
        const userId = $('#user_id').val();
        let quantity = parseInt(inputQuantity.val());
        if (isNaN(quantity)) {
            quantity = 1;
        }
        const id = $(this).data('product-id');

        const data = {
            id,
            quantity
        }

        if (userId) {
            addToCardWithUser(userId, data);
        } else {
            addToCardWithGuest(data);
        }
    })

    function addToCardWithGuest(data) {
        $.ajax({
            url: '/cart/guest',
            method: 'POST',
            data,
            success: async function (response) {
                console.log(response);
                const toast = $('.toast');
                toast.find('.toast-body').text('Your product has been added to cart');
                toast.toast('show');
                await getTotal();
            },
            error: function (err) {
                console.log(err);
            }
        })
    }

    function addToCardWithUser(userId, data) {
        $.ajax({
            url: `/cart/${userId}`,
            method: 'POST',
            data,
            success:async function (response) {
                console.log(response);
                const toast = $('.toast');
                toast.find('.toast-body').text('Your product has been added to cart');
                toast.toast('show');
                await getTotal();
            },
            error: function (err) {
                console.log(err);
            }
        })
    }


})