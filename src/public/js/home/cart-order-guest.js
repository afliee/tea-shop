$(document).ready(function () {
    getTotal();

    const checkAll = $('#checkAll');

    const btnCheckout = $('#btn-checkout');

    const tableOrders = $('#table-orders');
    fetchProducts();


    checkAll.on('click', function () {
        const isChecked = $(this).prop('checked');
        $('input[name="product"]').prop('checked', isChecked);
    });

    btnCheckout.on('click', function () {
        const products = $('input[name="product"]:checked');
        const toast = $('.toast');
        if (!products.length) {
            toast.find('.toast-header').removeClass('bg-primary').addClass('bg-danger');
            toast.find('.toast-header').text('Error');
            toast.find('.toast-body').text('Please choose at least one product');
            toast.toast('show');
            return;
        }

        const btnConfirmShow = $('.btn-confirm:not(.d-none)');
        if (btnConfirmShow.length) {
            toast.find('.toast-header').removeClass('bg-primary').addClass('bg-danger');
            toast.find('.toast-header').text('Error');
            toast.find('.toast-body').text('Please confirm all changes');
            toast.toast('show');
            return;
        }

        const data = []

        products.each(function () {
            const id = $(this).val();
            const quantity = $(`.input-quantity.${ id }`).val();
            data.push({ id, quantity });
        })

        $.ajax({
            url: '/cart/guest/checkout',
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function ( response) {
                console.log(response);
                const { redirect } = response;

                window.location.href = redirect;
            },
            error: function (err) {
                console.log(err);
            }
        });
    })

    function fetchProducts() {
        $.ajax({
            url: '/cart/guest/products',
            method: 'GET',
            beforeSend: function () {
                tableOrders.find('tbody').html(`
                    <tr>
                        <td colspan="5" class="text-center">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </td>
                    </tr>
                `);
            },
            success: function ( response ) {
                console.log(response);
                const body = tableOrders.find('tbody');
                body.html('');
                let total = 0;

                if (!response.products.length) {
                    body.html(`
                        <tr>
                            <td colspan="5" class="text-center">
                                <h4 class="text-danger">Your cart is empty!! <a href="/store" class="text-primary">Buy Something</a></h4>
                            </td>
                        </tr>
                    `);

                    $('#btn-checkout').addClass('d-none');
                    return;
                }
                response.products.forEach(( product, index ) => {
                    const { _id, name, salePrice } = product;
                    const row = `<tr itemscope="col" class="py-3">
                        <td data-product-id="${ _id }">
                            <input type="checkbox" class="form-check-input" name="product" value="${ _id }">
                        </td>
                        <td  class="text-center">${ name }</td>
                        <td class="text-center">${ parseInt(salePrice).toLocaleString('vi-VN', {
                        currency: 'VND',
                        style: 'currency'
                    }) }</td>
                        <td class="text-center">
                            <button class="btn btn-minus btn-sm" data-product-id="${ _id }">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="input-quantity ${ _id }" data-product-id="${ _id }" value="${ response.total[index] }" min="1" width="3rem">
                            <button class="btn btn-plus btn-sm" data-product-id="${ _id }">
                               <i class="fas fa-plus"></i>
                            </button>
                        </td>
                        <td  class="text-center" data-product-id="${ _id }">
                            <button type="button" class="btn d-none btn-confirm  ${ _id }">
                                <i class="fas fa-check me-2"></i>
                            </button>
                            <button type="button" class="btn btn-remove" data-product-id="${ _id }">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>`;
                    body.append(row);
                });

                registerChangeQuantity();
                registerConfirmUpdate();
                registerRemove();
            },
            error: function ( err ) {
                console.log(err);
            }
        })


    }

    function registerChangeQuantity() {
        const btnPlus = $('.btn-plus');
        const btnMinus = $('.btn-minus');

        btnPlus.on('click', function () {
            const productId = $(this).data('product-id');
            const quantity = $(`.input-quantity.${ productId }`).val();
            $(`.input-quantity.${ productId }`).val(parseInt(quantity) + 1);
            $(`.btn-confirm.${ productId }`).removeClass('d-none');
        })

        btnMinus.on('click', function () {
            const productId = $(this).data('product-id');

            const quantity = $(`.input-quantity.${ productId }`).val();
            if (quantity > 1) {
                $(`.input-quantity.${ productId }`).val(parseInt(quantity) - 1);
            }

            $(`.btn-confirm.${ productId }`).removeClass('d-none');
        })

        $('.input-quantity').on('change', function () {
            const productId = $(this).data('product-id');
            $(`.btn-confirm.${ productId }`).removeClass('d-none');

            // check if input is not a number
            if (isNaN(parseInt($(this).val()))) {
                $(this).val(1);
            }

            let quantity = parseInt($(this).val());
            if (quantity < 1) {
                $(this).val(1);
            }
        })
    }

    function registerConfirmUpdate() {
        const btnConfirm = $('.btn-confirm');

        btnConfirm.on('click', function () {
            const $this = $(this);

            const productId = $this.parent().data('product-id');
            const quantity = $(`.input-quantity.${ productId }`).val();

            const data = {
                id: productId,
                quantity
            }

            console.log(data)
            $.ajax({
                url: '/cart/guest',
                method: 'POST',
                data,
                success: function ( response ) {
                    console.log(response);
                    const toast = $('.toast');
                    toast.find('.toast-header').removeClass('bg-danger').addClass('bg-primary');
                    toast.find('.toast-body').text('Your product has been updated');
                    toast.toast('show');
                    getTotal();

                    $this.addClass('d-none');
                },
                error: function ( err ) {
                    console.log(err);
                }
            })
        })
    }

    function registerRemove() {
        const btnRemove = $('.btn-remove');

        btnRemove.on('click', function () {
            console.log('remove');
            const productId = $(this).data('product-id');

            const data = {
                id: productId
            }

            console.log(data)
            $.ajax({
                url: `/cart/guest`,
                method: 'DELETE',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function ( response ) {
                    console.log(response);
                    const toast = $('.toast');
                    toast.find('.toast-header').removeClass('bg-danger').addClass('bg-primary');
                    toast.find('.toast-body').text('Your product has been removed');
                    toast.toast('show');
                    getTotal();
                    fetchProducts();
                },
                error: function ( err ) {
                    console.log(err);
                }
            })
        })
    }
})