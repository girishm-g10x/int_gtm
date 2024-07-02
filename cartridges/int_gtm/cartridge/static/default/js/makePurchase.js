window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {
    var submitPaymentButton = document.querySelectorAll('.place-order');

    submitPaymentButton.forEach(function (button) {
        button.addEventListener('click', function () {
            var grandTotalPriceElement = document.querySelector('.grand-total-price');
            var grandTotalPrice = grandTotalPriceElement ? grandTotalPriceElement.textContent.trim() : '';

            var test = {
                testvalue: grandTotalPrice
            };

            dataLayer.push({
                'event': 'make_purchase',
                'grandTotalPrice': test.testvalue
            });

            // Debugging
            console.log('Grand Total Price:', grandTotalPrice);
        });
    });
});
