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
                'couponid': couponCode,
            });
        }
    }

    var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                var targetNode = mutation.target.querySelectorAll('.coupon-applied');
                if (targetNode) {
                    if(submitCouponCliked){
                        getCouponDetails();
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
});
