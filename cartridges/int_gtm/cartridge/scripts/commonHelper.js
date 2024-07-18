'use strict';

var collections = require('*/cartridge/scripts/util/collections');

function getBasketDetails(basket) {
    var result = {
        error: false,
        products: []
    };

    if (!basket || !basket.productLineItems) {
        result.error = true;
        return result;
    }

    var productLineItems = basket.productLineItems.iterator();

    while (productLineItems.hasNext()) {
        var item = productLineItems.next();

        if (item.product === null || !item.product.online) {
            result.error = true;
            continue;
        }

        var productDetails = {
            id: item.product.ID,
            name: item.product.name,
            price: item.basePrice.value,
            quantity: item.quantity.value

        };

        result.products.push(productDetails);
    }

    return result;
}

module.exports = {
    getBasketDetails: getBasketDetails
};
