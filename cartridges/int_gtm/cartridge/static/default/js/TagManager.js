window.dataLayer = window.dataLayer || [];
 
document.addEventListener('DOMContentLoaded', function () {

  var promoForm = document.querySelector('.promo-code-form');
 
    promoForm.addEventListener('submit', function (event) {
        event.preventDefault();
 
        var couponCodeField = document.querySelector('.coupon-code-field');
        var couponCode = couponCodeField.value;
 
        if (couponCode.trim() === '') {
            document.getElementById('missingCouponCode').style.display =
                'block';
            return;
        } else {
            document.getElementById('missingCouponCode').style.display = 'none';
        }
 
        dataLayer.push({
            event: 'couponcheck',
            couponid: couponCode
        });
    });
  
    function handleCheckoutEvent() {
        var productNameElements = document.getElementsByClassName('line-item-name');
        
        for (var i = 0; i < (productNameElements.length/2); i++) {
            var productName = productNameElements[i].querySelector('span').textContent.trim();
            
            var product = {
                name: productName 
            };
            
            dataLayer.push({
                'event': 'checkout',
                'Product_Name': product.name
            });
        }
    }

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
  
  
    var submitPaymentButton = document.querySelectorAll('.place-order');

    submitPaymentButton.forEach(function (button) {
        button.addEventListener('click', function () {
            var grandTotalPriceElement = document.querySelector('.grand-total-price');
            var orderDiscountPrice = document.querySelector('.order-discount-total');
            var shippingTtotalCost = document.querySelector('.shipping-total-cost');
            var grandTotalPrice = grandTotalPriceElement ? grandTotalPriceElement.textContent.trim() : '';
            var orderDiscount = orderDiscountPrice ? orderDiscountPrice.textContent.trim() : '';
            var shippingCost = shippingTtotalCost ? shippingTtotalCost.textContent.trim() : '';
            var productNameElements = document.getElementsByClassName('line-item-name');
            var productNames = [];
            for (var i = 0; i < productNameElements.length; i++) {
                var productName = productNameElements[i].querySelector('span').textContent.trim();
                productNames.push(productName);
            }
            var purchaseData = {
                totalPrice: grandTotalPrice,
                discount:orderDiscount,
                shippingPrice:shippingCost,
                products:productNames

            };

            dataLayer.push({
                'event': 'make_purchase',
                'grandTotalPrice': purchaseData.totalPrice,
                'orderDiscountPrice':purchaseData.discount,
                'shippingCost':purchaseData.shippingPrice,
                'productNames':purchaseData.products

            });
        });
    });
   
});
