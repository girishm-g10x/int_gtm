window.dataLayer = window.dataLayer || [];
 
document.addEventListener('DOMContentLoaded', function () {
    
    var submitCouponCliked = false;
    
    var couponElement = document.querySelectorAll('.promo-code-btn');
    
    couponElement.forEach(function (button) {
        button.addEventListener('click', function () {
            submitCouponCliked = true;
        });
    });

    function getCouponDetails(){
  
        var couponCodeElement = document.querySelector('.coupon-promotion-relationship');

        if(couponCodeElement){
            var couponCode = couponCodeElement.textContent.trim();   
            
            dataLayer.push({
                'event': 'couponcheck',
                'couponid': couponCode
              });
        }
      }

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

    var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
          
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              
                var couponTargetNode = mutation.target.querySelectorAll('.coupon-applied');
              
                var pdpTargetNode = mutation.target.querySelectorAll('.product-wrapper');
              
                if (couponTargetNode) {
                    if(submitCouponCliked){
                        getCouponDetails();
                        break;
                    }
                }
                if (pdpTargetNode) {
                    getProductDetails();
                    break;
                }
                var checkoutTargetNode = mutation.target.querySelector('.container.data-checkout-stage');
                if (checkoutTargetNode) {
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
