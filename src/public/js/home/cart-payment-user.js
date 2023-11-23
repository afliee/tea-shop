$(document).ready(function () {
    const btnPlaceOrder = $('#btn-place');

    btnPlaceOrder.on('click', function () {
        const total = $('#total').data('total');
        const toast = $('.toast');
        console.log(total);
        if (total === 0) {
            toast.find('.toast-body').text('Please!! Select things you want to buy');
            toast.toast('show');
            return;
        }
        const province = $('#province option:selected').text().trim();
        const district = $('#district option:selected').text().trim();
        const ward = $('#ward option:selected').text().trim();
        const address = $('#detail-address').val().trim();
        const productTable = $('.product');
        const products = [];
        productTable.each(function () {
            const id = $(this).data('product-id');
            const quantity = $(this).find('.quantity').text();
            products.push({ product: id, quantity: +quantity });
        });
        const data = {
            email: $('#mail').val(),
            name: $('#fullname').val(),
            address: `${ address }, ${ ward }, ${ district }, ${ province }`,
            amount: total,
            note: $('#note').val(),
            products
        }

        console.log(data)
        $.ajax({
            url:`/cart/payment/create-payment-intent`,
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (data) {
                const url = data.url;
                console.log(url);
                window.location.href = url;
            },
            error: function (e) {
                console.log(e);
            }
        })
    })
});