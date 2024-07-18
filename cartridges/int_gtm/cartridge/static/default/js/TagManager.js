window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {
    
    var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                var targetNode = mutation.target.querySelector('.container.data-checkout-stage');
                if (targetNode) {
                    handleCheckoutEvent();
                    break;
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function handleCheckoutEvent() {
        var productDataElement = document.getElementById('productData');
        if (productDataElement) {
            var products = JSON.parse(productDataElement.getAttribute('data-product-list'));
            products.forEach(function (product) {
                dataLayer.push({
                    'event': 'checkout',
                    'Product_ID': product.id,
                    'Product_Name': product.name,
                    'Product_Price': product.price,
                    'Product_Quantity': product.quantity
                });
            });
        }
    }

    var makePurchaseButton = document.querySelectorAll('.place-order');

    makePurchaseButton.forEach(function (button) {
        button.addEventListener('click', function () {
            var productDataElement = document.getElementById('productData');
            var productListAttribute = productDataElement.getAttribute('data-product-list');
            if(productDataElement){
            try {
                var productList = JSON.parse(productListAttribute);

                if (Array.isArray(productList)) {
                    productList.forEach(function (product) {
                        window.dataLayer.push({
                            'event': 'make_purchase',
                            'productid': product.id,
                            'Productname': product.name,
                            'price': product.price,
                            'quantity' : product.quantity
                            
                        });
                    });
                } else {
                    console.error('productList is not an array:', productList);
                }
            } catch (e) {
                console.error('Error parsing productList:', e, productListAttribute);
            }
        }
        });
    });
});
