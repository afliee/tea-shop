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
                            n('#import-table').addClass('d-none');
                            return;
                        }

                        console.log(data);
                        const table = n('#import-table').DataTable({
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
                            order: [[1, 'asc']],
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
                                    data: 'name'
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
                                        return parseInt(data).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                    }
                                },
                                {
                                    title: 'Sell Price',
                                    data: 'sellPrice',
                                //     convert price to string vnd
                                    render: function ( data ) {
                                        return parseInt(data).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                    }
                                },
                                {
                                    title: 'Quantity',
                                    data: 'quantity'
                                },
                                {
                                    title: 'Category',
                                    data: 'categories',
                                    render: function ( data ) {
                                        return `
                                            <select class="form-control form-control-sm">
                                                <option value="" selected>Select category</option>
                                                ${data.map(( item ) => `<option value="${item._id}">${item.name}</option>`)}
                                            </select>
                                        `;
                                    }
                                },
                                {
                                    title: 'Type',
                                    data: 'type',
                                },
                                {
                                    title: 'Action',
                                    data: null,
                                    render: function ( data ) {
                                        return `
                                            <a href="/product/${data._id}" class="btn btn-primary btn-sm">View</a>
                                        `
                                    }
                                }
                            ]
                        })

                        n('#import-table').removeClass('d-none');
                    });

                    //     on fail send file to server
                    this.on('error', function ( file, response ) {
                        console.log(response);
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
