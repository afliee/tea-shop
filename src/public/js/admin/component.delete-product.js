$(document).ready(function () {
    const btnDelete = $('.btn-delete');

    btnDelete.on('click', function (e) {
        e.preventDefault();
        const $this = $(this);
        const id = $this.data('id');
        const name = $this.data('name');

        Swal.fire({
            title: `Are you sure to delete ${name}?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Delete`,
            cancelButtonText: `Cancel`,
        }).then(result => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/admin/products/${id}`,
                    type: 'DELETE',
                    success: function (response) {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your item has been deleted.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            window.location.reload();
                        })
                    },
                    error: function (error) {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Something went wrong.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        })
                    }
                })
            }
        })
    })
})