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
    

/**
 * Creates an account model for the current customer
 * @param {Object} req - local instance of request object
 * @returns {Object} a plain object of the current customer's account
 */
function recieveProductDetails(data) {
    var productDetails = {
        product_Name: data.productName,
        product_ID:data.id,
        product_Price:data.price.sales.value,
        product_Rating:data.rating
    }
    return productDetails;

}

module.exports = {
    recieveProductDetails: recieveProductDetails,
    getBasketDetails: getBasketDetails
};
