'use strict';

window.dataLayer = window.dataLayer || [];
document.addEventListener('DOMContentLoaded', function () {
    var removeFromCartButtons = document.querySelectorAll(
        '.cart-delete-confirmation-btn'
    );
    removeFromCartButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Use jQuery to access data attributes set on the button
            var $button = $(this);
            var productId = $button.data('pid'); // Accessing data-pid
            var actionUrl = $button.data('action'); // Accessing data-action
            var uuid = $button.data('uuid'); // Accessing data-uuid

            var modal = this.closest('.modal-content');

            if (modal) {
                // jQuery to find product name element inside modal
                var productNameElement = $(modal).find('.product-to-remove');
                var productName = productNameElement.length
                    ? productNameElement.text().trim()
                    : '';

                // Push data to dataLayer
                window.dataLayer.push({
                    event: 'removeFromCart',
                    productName: productName,
                    productId: productId,
                    uuid: uuid
                });
            }
        });
    });
});
