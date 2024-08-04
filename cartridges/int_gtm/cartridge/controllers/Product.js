'use strict';
 
/**
 * @namespace Product
 */
 
var server = require('server');
var base = module.superModule;
server.extend(base);

/**
 * Product-Show : This end point is to set Product Details for GTM
 * @name Product-Show
 * @function
 * @param {renders} - isml
 */
 
server.append('Show', function (req, res, next) {

    var Site = require('dw/system/Site');
    var gtmEnable = Site.current.getCustomPreferenceValue('GTMEnable') || false;

    if(gtmEnable){
        var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
        var productDetailsHelper = require('*/cartridge/scripts/commonHelper');

        var productDetails = productHelper.showProductPage(req.querystring, req.pageMetaData);
        var result = productDetailsHelper.recieveProductDetails(productDetails.product);

        res.setViewData({
            productDetails: result
        });
    }
    next();
});
 
module.exports = server.exports();
