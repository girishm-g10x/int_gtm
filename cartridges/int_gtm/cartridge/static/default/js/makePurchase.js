window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {
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
                console.log(productName);
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

            // Debugging
            console.log('Grand Total Price:', grandTotalPrice);
 

        });
    });
});
