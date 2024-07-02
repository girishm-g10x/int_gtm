window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {
    var addToCartButtons = document.querySelectorAll('.checkout-btn');

    addToCartButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var productNameElements = document.getElementsByClassName('product-name');
            var productName = productNameElements.length > 0 ? productNameElements[0].textContent.trim() : '';

            var productId = button.getAttribute('data-pid') || '';

            if (productName && productId) {
                var product = {
                    name: productName,
                    id: productId
                };

                dataLayer.push({
                    'event': 'checkout',
                    'Productname': product.name,
                    'productid': product.id
                });
            } else {
                console.warn('Product name or ID is missing.');
            }
        });
    });
});
