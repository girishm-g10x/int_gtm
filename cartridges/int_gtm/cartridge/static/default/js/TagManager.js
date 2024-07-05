window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {
    function getProductDetails() {
        var productNameElement = document.querySelector('.product-name');
        var productName = productNameElement
            ? productNameElement.textContent.trim()
            : '';

        var productContainer = document.querySelector(
            '.product-detail.product-wrapper'
        );
        var productId = productContainer
            ? productContainer.getAttribute('data-pid')
            : '';

        var priceElement = document.querySelector('.prices');
        var productPriceText = priceElement
            ? priceElement.textContent.trim()
            : '';
        var regex = /£[\d,]+\.\d{2}/;
        var match = productPriceText.match(regex);
        var productPrice = match ? match[0] : '';

        var product = {
            name: productName,
            id: productId,
            price: productPrice
        };

        dataLayer.push({
            event: 'p-d-p-page',
            Productname: product.name,
            Productprice: productPrice,
            Productid: product.id
        });
    }

    var removeFromCartButtons = document.querySelectorAll(
        '.cart-delete-confirmation-btn'
    );
    removeFromCartButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Use jQuery to access data attributes set on the button
            var $button = $(this);
            var productId = $button.data('pid'); // Accessing data-pid
            var actionUrl = $button.data('action'); // Accessing data-action
            var uuid = $button.data('uuid'); // Accessing data-uuid

            var modal = this.closest('.modal-content');

            if (modal) {
                // jQuery to find product name element inside modal
                var productNameElement = $(modal).find('.product-to-remove');
                var productName = productNameElement.length
                    ? productNameElement.text().trim()
                    : '';

                // Push data to dataLayer
                window.dataLayer.push({
                    event: 'remove_from_cart',
                    productName: productName,
                    productId: productId,
                    uuid: uuid
                });
            }
        });
    });

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
        var productNameElements =
            document.getElementsByClassName('line-item-name');

        for (var i = 0; i < productNameElements.length / 2; i++) {
            var productName = productNameElements[i]
                .querySelector('span')
                .textContent.trim();

            var product = {
                name: productName
            };

            dataLayer.push({
                event: 'checkout',
                Product_Name: product.name
            });
        }
    }

    var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
            if (
                mutation.type === 'childList' &&
                mutation.addedNodes.length > 0
            ) {
                var targetNodeForCheckout = mutation.target.querySelector(
                    '.container.data-checkout-stage'
                );

                var targetNodeForPdp =
                    mutation.target.querySelector('.product-wrapper');

                if (targetNodeForCheckout) {
                    handleCheckoutEvent();
                    break;
                }
                if (targetNodeForPdp) {
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

    var submitPaymentButton = document.querySelectorAll('.place-order');

    submitPaymentButton.forEach(function (button) {
        button.addEventListener('click', function () {
            var grandTotalPriceElement =
                document.querySelector('.grand-total-price');
            var orderDiscountPrice = document.querySelector(
                '.order-discount-total'
            );
            var shippingTtotalCost = document.querySelector(
                '.shipping-total-cost'
            );
            var grandTotalPrice = grandTotalPriceElement
                ? grandTotalPriceElement.textContent.trim()
                : '';
            var orderDiscount = orderDiscountPrice
                ? orderDiscountPrice.textContent.trim()
                : '';
            var shippingCost = shippingTtotalCost
                ? shippingTtotalCost.textContent.trim()
                : '';
            var productNameElements =
                document.getElementsByClassName('line-item-name');
            var productNames = [];
            for (var i = 0; i < productNameElements.length; i++) {
                var productName = productNameElements[i]
                    .querySelector('span')
                    .textContent.trim();
                productNames.push(productName);
            }
            var purchaseData = {
                totalPrice: grandTotalPrice,
                discount: orderDiscount,
                shippingPrice: shippingCost,
                products: productNames
            };

            dataLayer.push({
                event: 'make_purchase',
                grandTotalPrice: purchaseData.totalPrice,
                orderDiscountPrice: purchaseData.discount,
                shippingCost: purchaseData.shippingPrice,
                productNames: purchaseData.products
            });
        });
    });

    var addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var productNameElements =
                document.getElementsByClassName('product-name');
            var productName =
                productNameElements.length > 0
                    ? productNameElements[0].textContent.trim()
                    : '';

            var priceElement = document.querySelector('.prices');
            var productPriceText = priceElement
                ? priceElement.textContent.trim()
                : '';
            var regex = /£[\d,]+\.\d{2}/;
            var match = productPriceText.match(regex);
            var productPrice = match ? match[0] : '';

            var productId = button.getAttribute('data-pid');

            var product = {
                name: productName,
                id: productId,
                price: productPrice
            };

            dataLayer.push({
                event: 'add_to_cart',
                Productname: product.name,
                productid: product.id,
                price: product.price
            });
        });
    });
});
