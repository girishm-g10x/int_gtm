'use strict';

window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {
    var removeFromCartButtons = document.querySelectorAll('.cart-delete-confirmation-btn');
   
    removeFromCartButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var productNameElement = button.closest('.card').querySelector('.product-name');
            var productName = productNameElement ? productNameElement.textContent.trim() : '';

            var productId = button.getAttribute('data-product-id');

            // Push data to dataLayer
            dataLayer.push({
                'event': 'removeFromCart',
                'productName': productName,
                'productId': productId
            });
        });
    });
});
