'use strict';

/**
 * Sends a 'remove from cart' event to Google Tag Manager's data layer.
 * This function is used to track when a product is removed from the cart.
 *
 * @param {string} productID - The ID of the product being removed.
 * @param {string} productName - The name of the product being removed.
 * @returns {void}
 */
function pushRemoveFromCartToDataLayer(productID, productName) {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
        'event': 'removeFromCart',
        'ecommerce': {
            'remove': {
                'products': [{
                    'id': productID,
                    'name': productName
                }]
            }
        }
    });
}

