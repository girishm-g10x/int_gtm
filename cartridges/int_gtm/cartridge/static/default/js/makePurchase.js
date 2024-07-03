window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {
    var submitPaymentButton = document.querySelectorAll('.place-order');

    submitPaymentButton.forEach(function (button) {
        button.addEventListener('click', function () {
            var grandTotalPriceElement = document.querySelector('.grand-total-price');
            var grandTotalPrice = grandTotalPriceElement ? grandTotalPriceElement.textContent.trim() : '';

            // Extract product description
            var productDescriptionElement = document.querySelector('.product-description');
            var productDescription = productDescriptionElement ? productDescriptionElement.textContent.trim() : '';
            
            // Extract product ID
            var productIdElement = document.querySelector('.product-id');
            var productId = productIdElement ? productIdElement.textContent.trim() : '';

            dataLayer.push({
                'event': 'make_purchase',
                'grandTotalPrice': grandTotalPrice,
                'productDescription': productDescription,
                'productId': productId
            });

            // Debugging
            console.log('Grand Total Price:', grandTotalPrice);
            console.log('Product Description:', productDescription);
            console.log('Product ID:', productId);
        });
    });
});
