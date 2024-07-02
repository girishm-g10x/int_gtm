window.dataLayer = window.dataLayer || [];
 
document.addEventListener('DOMContentLoaded', function () {
    var checkoutButtons = document.querySelectorAll('.checkout-btn');
 
    checkoutButtons.forEach(function (button) {
        button.addEventListener('click', function () {
           
            var cardElement = button.closest('.card.product-info');
 
            var variationAttributes = cardElement.querySelectorAll('.line-item-attributes');
            var productName = '';
            variationAttributes.forEach(function (attribute) {
                if (textContent.includes('Product Name:')) {
                    productName = textContent.split(': ')[1].trim();
                }
            });
 
            var product = {
                name: productName
            };
 
            dataLayer.push({
                'event': 'checkout',
                'Productname': product.name
            });
        });
    });
});