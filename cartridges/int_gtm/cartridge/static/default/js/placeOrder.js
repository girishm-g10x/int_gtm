document.addEventListener('DOMContentLoaded', function () {
    var submitPaymentButton = document.querySelector('.submit-payment');
 
    submitPaymentButton.addEventListener('click', function () {
        // Extract grand total price
        var grandTotalPriceElement = document.querySelector('.grand-total-price');
        var grandTotalPrice = grandTotalPriceElement ? grandTotalPriceElement.textContent.trim() : '';
        
        // Extract product description
        var productDescriptionElement = document.querySelector('.product-description');
        var productDescription = productDescriptionElement ? productDescriptionElement.textContent.trim() : '';
        
        // Extract product ID
        var productIdElement = document.querySelector('.product-id');
        var productId = productIdElement ? productIdElement.textContent.trim() : '';
 
        // Push data to dataLayer
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'submit_payment',
            'grandTotalPrice': grandTotalPrice,
            'productDescription': productDescription,
            'productId': productId
        });
 
    });
});
