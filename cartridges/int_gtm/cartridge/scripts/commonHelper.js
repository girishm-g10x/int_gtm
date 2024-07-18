'use strict';
 
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
    recieveProductDetails: recieveProductDetails
};