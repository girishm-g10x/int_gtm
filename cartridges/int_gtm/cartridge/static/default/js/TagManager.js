window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {
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
});
