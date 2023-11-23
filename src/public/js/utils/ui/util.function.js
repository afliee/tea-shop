function getTotal() {
    return fetch('/cart/total', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            $('.cart-count').text(data.total);
            return data.total;
        })
        .catch(err => {
            console.log(err);
        })
}