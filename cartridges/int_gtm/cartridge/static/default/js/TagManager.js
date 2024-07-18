window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {
    var addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            
            var productDataElement = document.getElementById('productData');

            if(productDataElement){
                var productID = productDataElement.getAttribute('data-product-id');
                var productName = productDataElement.getAttribute('data-product-name');
                var productPrice = productDataElement.getAttribute('data-product-price');
                var productRating = productDataElement.getAttribute('data-product-rating');

                var product = {
                    name: productName,
                    id: productID,
                    price: productPrice,
                    rating: productRating
                };
                
                dataLayer.push({
                    event: 'add_to_cart',
                    Productname: product.name,
                    price: product.price,
                    productid: product.id,
                    Productrating: product.rating
                });
            }
            else{
                return;
            }
        });
    });
});
