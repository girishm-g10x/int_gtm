document.addEventListener('DOMContentLoaded', function () {
    var submitPaymentButton = document.querySelector('.submit-payment');
 
    submitPaymentButton.addEventListener('click', function () {
        // Extract grand total price
        var grandTotalPriceElement = document.querySelector('.grand-total-price');
        var grandTotalPrice = grandTotalPriceElement ? grandTotalPriceElement.textContent.trim() : '';
 
        // Extract shipping name
        //var shippingNameElement = document.querySelector('.shipping-name');
        //var shippingName = shippingNameElement ? shippingNameElement.textContent.trim() : '';
 
        // Push data to dataLayer
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'submit_payment',
            'grandTotalPrice': grandTotalPrice,
            //'shippingName': shippingName
        });
 
        // Debugging
        console.log('Grand Total Price:', grandTotalPrice);
        console.log('Shipping Name:', shippingName);
    });
});