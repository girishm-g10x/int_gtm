window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {
    
    function getProductDetails() {
        
        var productDataElement = document.getElementById('productData');
        if (productDataElement) {
            var productId = productDataElement.getAttribute('data-product-id');
            var productName =
                productDataElement.getAttribute('data-product-name');
            var productPrice =
                productDataElement.getAttribute('data-product-price');
            var productRating = productDataElement.getAttribute(
                'data-product-rating'
            );

            var product = {
                name: productName,
                id: productId,
                price: productPrice,
                rating: productRating
            };

            dataLayer.push({
                event: 'p-d-p-page',
                Productname: product.name,
                price: product.price,
                productid: product.id,
                Productrating: product.rating
            });
        }
    }

    var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
            if (
                mutation.type === 'childList' &&
                mutation.addedNodes.length > 0
            ) {
                var targetNode =
                    mutation.target.querySelectorAll('.product-wrapper');
                if (targetNode) {
                    getProductDetails();
                    break;
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

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
