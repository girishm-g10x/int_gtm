window.dataLayer = window.dataLayer || [];
 
document.addEventListener('DOMContentLoaded', function () {
    
    var submitCouponCliked = false;
    var checkoutButtonClickFlag = true;
    
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

        var productDataElement = document.getElementById('productBasketData');

        if (productDataElement) {
            var productsAttributes = productDataElement.getAttribute('data-product-list');
            
            var productList = JSON.parse(productsAttributes);

            if (Array.isArray(productList)) {
                productList.forEach(function (product) {

                    window.dataLayer.push({
                        'event': 'checkout',
                        'productid': product.id,
                        'Productname': product.name,
                        'price': product.price,
                        'quantity' : product.quantity
                        
                    });
                });
            }

            checkoutButtonClickFlag = false;
            
        }
    }

    var checkoutButtonClickElement = document.querySelectorAll('.checkout-btn '); 

    checkoutButtonClickElement.forEach(function (button) {
        button.addEventListener('click', function () {

            checkoutButtonClickFlag = true;
            
        });
    });

    var makePurchaseButton = document.querySelectorAll('.place-order');

    makePurchaseButton.forEach(function (button) {
        button.addEventListener('click', function () {
            var productDataElement = document.getElementById('productBasketData');
            var productListAttribute = productDataElement.getAttribute('data-product-list');
            if(productDataElement){

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
                }
            }
        });
    });

    var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
          
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              
                var couponTargetNode = mutation.target.querySelectorAll('.coupon-applied');
              
                var pdpTargetNode = mutation.target.querySelectorAll('.product-wrapper');
                
                var checkoutTargetNode = mutation.target.querySelectorAll('.data-checkout-stage');
              
                if (couponTargetNode.length) {
                    if(submitCouponCliked){
                        getCouponDetails();
                        couponTargetNode = null;
                        break;
                    }
                }
                if (pdpTargetNode.length) {
                    setupClickListeners();
                    getProductDetails();
                    break;
                }
                if (checkoutTargetNode) {
                    if(checkoutButtonClickFlag){
                        handleCheckoutEvent();
                        checkoutTargetNode = null;
                        break;
                    }
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

    var gtmElement = document.getElementById('gtmid');
    var gtmID = gtmElement ? gtmElement.textContent.trim() : '';
    
    if (gtmID) {
        var flag = false;
        var product = {};

        var removeButtons = document.querySelectorAll('.remove-product');
        removeButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var productId = this.getAttribute('data-product-id');
                var productName = this.getAttribute('data-product-name');
                var productPrice = this.getAttribute('data-product-price');

                product = {
                    id: productId,
                    name: productName,
                    price: productPrice
                };

                flag = true;
            });
        });

        var deleteConfirm = document.querySelectorAll('.cart-delete-confirmation-btn');
        deleteConfirm.forEach(function(button) {
            button.addEventListener('click', function() {
                if (flag && product.id) {
                    
                    dataLayer.push({
                        event: 'remove_from_cart',
                        Productname: product.name,
                        price: product.price,
                        productid: product.id,
                        gtmID: product.gtmID
                    });

                    flag = false;
                    product = {};
                }
            });
        });
    }
    
    function setFlag(value) {
        sessionStorage.setItem('pdpFlag', value);
    }

    function getProductDetails() {
        var productDataElement = document.getElementById('productData');
        if (sessionStorage.getItem('pdpFlag') === 'true') {
            if (productDataElement) {
                var productId = productDataElement.getAttribute('data-product-id');
                var productName = productDataElement.getAttribute('data-product-name');
                var productPrice = productDataElement.getAttribute('data-product-price');
                var productRating = productDataElement.getAttribute('data-product-rating');

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
                
                setFlag('false');
            }
        }
    }
    
    function setupClickListeners() {
        var pdpLinks = document.querySelectorAll('.pdp-link');
        pdpLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                setFlag('true');
            });
        });
        
        var imageContainers = document.querySelectorAll('.image-container > a');
        imageContainers.forEach(function (link) {
            link.addEventListener('click', function () {
                setFlag('true');
            });
        });
        
        var searchContainers = document.querySelectorAll('.suggestions-wrapper');
        searchContainers.forEach(function (link) {
            link.addEventListener('click', function () {
                setFlag('true');
            });
        });
    }
    setupClickListeners();
});