window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {
    var addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var productNameElements = document.getElementsByClassName('product-name');
            var productName = productNameElements.length > 0 ? productNameElements[0].textContent.trim() : '';

            var priceElement = document.querySelector('.prices');
            var productPriceText = priceElement ? priceElement.textContent.trim() : '';
            var regex = /£[\d,]+\.\d{2}/; 
            var match = productPriceText.match(regex);
            var productPrice = match ? match[0] : ''; 
            
            var productId = button.getAttribute('data-pid');
            
            var product = {
                name: productName,
                id: productId,
                price: productPrice,
            };

            dataLayer.push({
                'event': 'add_to_cart',
                'Productname': product.name,
                'productid': product.id,
                'price': product.price,
            });
        });
    });
});
