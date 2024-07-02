window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {
    var addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var productNameElements = document.getElementsByClassName('product-name');
            var productName = productNameElements.length > 0 ? productNameElements[0].textContent.trim() : '';

            var priceElement = document.querySelector('.prices');
            var productPriceText = priceElement ? priceElement.textContent.trim() : '';
            var regex = /£[\d,]+\.\d{2}/; // Matches a price format starting with £, followed by numbers with commas and decimals
            var match = productPriceText.match(regex);
            var productPrice = match ? match[0] : ''; // Extracted numerical price
            console.log(productPrice);
            
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
