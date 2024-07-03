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
    var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
            if (
                mutation.type === 'childList' &&
                mutation.addedNodes.length > 0
            ) {
                var targetNode =
                    mutation.target.querySelector('.product-wrapper');
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
});
