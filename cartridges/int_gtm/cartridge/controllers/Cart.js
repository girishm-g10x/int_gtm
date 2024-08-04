'use strict';

var server = require('server');
var base = module.superModule;
server.extend(base);

/**
 * Cart-Show : This end point is to set GtmEnable to the isml
 * @name Cart-Show
 * @function
 * @param {renders} - isml
 */

server.append('Show', function (req, res, next) {
    var Site = require('dw/system/Site');
    var gtmEnable = Site.current.getCustomPreferenceValue('GTMEnable') || false;

    res.setViewData({ gtmEnable: gtmEnable });
    next();
});

module.exports = server.exports();
