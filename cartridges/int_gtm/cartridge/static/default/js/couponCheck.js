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
});
