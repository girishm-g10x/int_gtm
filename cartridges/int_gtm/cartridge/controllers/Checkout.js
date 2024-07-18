'use strict';

var server = require('server');
var base = module.superModule;
server.extend(base);

server.append('Begin', function (req, res, next) {
    var Site = require('dw/system/Site');
    var gtmEnable = Site.current.getCustomPreferenceValue('GTMEnable') || false;
 
    if(gtmEnable){
    var BasketMgr = require('dw/order/BasketMgr');
    var basketDetailsHelper = require('*/cartridge/scripts/commonHelper');
    var currentBasket = BasketMgr.getCurrentBasket();
    var basketDetails = basketDetailsHelper.getBasketDetails(currentBasket);
 

    // Pass basketDetails to the view
    res.setViewData({ basketDetails: basketDetails });
    }

    next();
});

module.exports = server.exports();
