'use strict';

/**
 * @namespace PlaceOrder
 */

var server = require('server');
var base = module.superModule;
server.extend(base);

server.prepend('PlaceOrder', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var basketDetailsHelper = require('*/cartridge/scripts/commonHelper');
    var currentBasket2 = BasketMgr.getCurrentBasket();
    var result2 = basketDetailsHelper.getBasketDetails(currentBasket2);
    console.log(result2)
    
    // Log the result to see the output in the console
    require('dw/system/Logger').getLogger('PlaceOrder').debug(JSON.stringify(result2));

    // You can now pass `result2` to the frontend as needed

    next();
});

module.exports = server.exports();
