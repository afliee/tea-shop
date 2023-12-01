!(function ( n ) {
    'use strict';

    function t() {
        this.$body = n('body');
    }

    const ACCEPTED_EXTENSIONS = ['csv', 'xls', 'xlsx'];
    (t.prototype.init = function () {
        (Dropzone.autoDiscover = !1),
            n('[data-plugin="dropzone"]').each(function () {
                var t = n(this).attr('action'),
                    i = n(this).data('previewsContainer'),
                    e = { url: t };
                i && (e.previewsContainer = i);
                var o = n(this).data('uploadPreviewTemplate');
                o && (e.previewTemplate = n(o).html());

                e.maxFiles = 1;
                e.acceptedFiles = "text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                e.maxfilesexceeded = function ( file ) {
                    this.removeAllFiles();
                    this.addFile(file);
                };
                e.init = function () {
                    this.on('addedfile', function ( file ) {
                        console.log(file);
                        const fileName = file.name;
                        const ext = fileName.split('.').pop();

                        if (!ACCEPTED_EXTENSIONS.includes(ext)) {
                            this.removeFile(file);
                            return;
                        }

                        //     change icon for file type

                        switch (ext) {
                            case 'csv':
                                file.previewElement.querySelector('.dz-thumbnail').src = '/img/csv.png';
                                break;
                            case 'xls':
                            case 'xlsx':
                                file.previewElement.querySelector('.dz-thumbnail').src = '/img/xls.png';
                                break;
                        }
                    });
                    //     prevent submit form
                    this.on('success',async  function ( file, response ) {
                        console.log(response);
                        const data = response?.data;
                        if (!data) {
                            n('#product_table').addClass('d-none');
                            n('.alert .message').text('File type not supported');
                            n('.alert').removeClass('d-none');
                            return;
                        }

                        console.log(data);
                        const table = n('#product_table').DataTable({
                            responsive: true,
                            rowReorder: {
                                selector: 'td:nth-child(2)'
                            },
                            language: {
                                paginate: {
                                    previous: '<i class="mdi mdi-chevron-left"> </i>',
                                    next: '<i class="mdi mdi-chevron-right"> </i>'
                                },
                                info: 'Showing page _PAGE_ of _PAGES_',
                                lengthMenu:
                                    '<select class="form-control form-control-sm">' +
                                    '<option value="10">10</option>' +
                                    '<option value="20">20</option>' +
                                    '<option value="30">30</option>' +
                                    '<option value="40">40</option>' +
                                    '<option value="50">50</option>' +
                                    '<option value="-1">All</option>' +
                                    '</select> records'
                            },
                            _id: 'index',
                            // order: [[1, 'asc']],
                            drawCallback: function () {
                                n('.dataTables_paginate > .pagination').addClass(
                                    'pagination-rounded'
                                );
                            },
                            pageLength: 10,
                            data: data,
                            columns: [
                                {
                                    title: 'Name',
                                    data: 'name',
                                    render: function ( data ) {
                                        // format truncate string
                                        return `
                                            <p class="text-truncate text-center" style="max-width: 450px">${data}</p>
                                        `
                                    }
                                },
                                {
                                    title: 'Description',
                                    data: 'description',
                                    render: function ( data ) {
                                        // format truncate string
                                        return `
                                            <p class="text-truncate" style="max-width: 450px">${data}</p>
                                        `
                                    }
                                },
                                {
                                    title: 'Price',
                                    data: 'price',
                                    //     convert price to string vnd
                                    render: function ( data ) {
                                        return `
                                            <span class="text-center" data-value="${data}">${parseInt(data).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                        `;
                                    }
                                },
                                {
                                    title: 'Quantity',
                                    data: 'quantity',
                                    render: function (data) {
                                        return `
                                            <div class="text-center">
                                                <span class="text-center" data-value="${data}">${data}</span>
                                            </div> 
                                        `;
                                    }
                                },
                                {
                                    title: 'Unit',
                                    data: 'units',
                                    render: function ( data ) {
                                        return `
                                            <select class="form-control form-control-sm">
                                                <option value="" selected>Select Unit</option>
                                                ${data.map(( item ) => `<option value="${item}">${item}</option>`)}
                                            </select>
                                        `;
                                    }
                                },
                                {
                                    title: 'Action',
                                    // data like index of data variable
                                    data: 'index',
                                    render: function ( data ) {
                                        const modal = n('#viewProduct');

                                        return `
                                            <button type="button" class="btn btn-primary btn-sm btn-view-product" data-bs-toggle="modal" data-bs-target="#viewProduct" data-id="${data}">
                                                View
                                            </button>
                                        `
                                    }
                                }
                            ]
                        })

                        const modal = n('#viewProduct');
                        modal.find('.btn-save-change').on('click', function (e) {
                            const id = n(this).data('id');
                            e.preventDefault();
                            e.stopPropagation();
                            const name = modal.find('#name').val();
                            const description = modal.find('#description').val();
                            const price = modal.find('#price').val();
                            const quantity = modal.find('#quantity').val();
                            const expiredAt = modal.find('#expiredAt').val();

                            table.row(id).data({
                                name,
                                description,
                                price,
                                quantity,
                                expiredAt,
                                units: data[id].units
                            }).draw();

                            data[id] = {
                                name,
                                description,
                                price,
                                quantity,
                                expiredAt,
                                units: data[id].units
                            }
                            //     hide modal
                            modal.modal('hide');
                        });
                        n('.btn-view-product').on('click', function () {
                            const id = n(this).data('id');
                            const product = data[id];
                            const modal = n('#viewProduct');

                            modal.find('#name').val(product.name);
                            modal.find('#description').val(product.description);
                            modal.find('#price').val(product.price);
                            modal.find('#quantity').val(product.quantity);
                            modal.find('#expiredAt').val(product.expiredAt);
                            modal.find('.btn-save-change').data('id', id);
                            modal.modal('show');

                            // modal.find('.btn-save-change').on('click', function (e) {
                            //
                            //     e.preventDefault();
                            //     e.stopPropagation();
                            //     const name = modal.find('#name').val();
                            //     const description = modal.find('#description').val();
                            //     const price = modal.find('#price').val();
                            //     const quantity = modal.find('#quantity').val();
                            //     const expiredAt = modal.find('#expiredAt').val();
                            //     table.row(id).data({
                            //         name,
                            //         description,
                            //         price,
                            //         quantity,
                            //         expiredAt,
                            //         units: product.units
                            //     }).draw();
                            //
                            //     console.log(`name: ${name}, description: ${description}, price: ${price}, quantity: ${quantity}, expiredAt: ${expiredAt}, id: ${id}`)
                            //     //     hide modal
                            //     modal.modal('hide');
                            // });
                        });

                        n('.btn-save').removeClass('d-none');

                        n('.btn-save').on('click', function () {
//      check column category has value
                            const unit = n('#product_table').find('select').toArray().map(( item ) => n(item).val());
                            if (unit.includes('')) {
                                n('.toast').find('.toast-body').text('Please select unit for each product');
                                n('.toast').toast('show');
                                return;
                            }

                            //     change unit each product to category selected
                            data.forEach(( item, index ) => {
                                item.unit = unit[index];
                                //     remove categories in data
                                delete item.units;
                            });
                            console.log(data);

                            n.ajax({
                                url: '/import/create',
                                method: 'POST',
                                data: JSON.stringify(data),
                                contentType: 'application/json',
                                beforeSend: function () {
                                    n('.btn-save').attr('disabled', true);
                                    n('.btn-save').text('Saving...');
                                },
                                success: function ( response ) {
                                    console.log(response);
                                    n('.toast').find('.toast-body').text('Import products success');
                                    n('.toast').toast('show');
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 2000);
                                },
                                error: function ( response ) {
                                    console.log(response);
                                    n('.toast').find('.toast-body').text('Something went wrong');
                                    n('.toast').toast('show');
                                }
                            })
                        });


                        n('#product_table').removeClass('d-none');
                    });

                    //     on fail send file to server
                    this.on('error', function ( file, response ) {
                        console.log(response);
                        n('#product_table').addClass('d-none');
                        n('.toast').find('.toast-body').text('Something went wrong');
                        n('.toast').toast('show');
                        n('.btn-save').addClass('d-none');
                    });
                }
                n(this).dropzone(e);

            });
    }),
        (n.FileUpload = new t()),
        (n.FileUpload.Constructor = t);
})(window.jQuery),
    (function () {
        'use strict';
        window.jQuery.FileUpload.init();
    })();
