'use strict';

/**
 * @namespace gtmIdSet
 * This is a controller to set the gtm id given from the BM
 */

/**
 * gtmIdSet-SetBody : This end point is to set the body tag 
 * @name gtmIdSet-SetBody
 * @function
 * @param {renders} - isml
 */
var server = require('server');

server.get('SetBody', function (req, res, next) {
    var Site = require('dw/system/Site');
    var gtmContainerId = Site.current.getCustomPreferenceValue('GTMID') || '';

    res.render('/tagManager/tagBody', {
        id: gtmContainerId
    });
    next();
});

/**
 * gtmIdSet-SetHead : This end point is to set the Head tag 
 * @name gtmIdSet-SetHead
 * @function
 * @param {renders} - isml
 */
server.get('SetHead', function (req, res, next) {
    var Site = require('dw/system/Site');
    var gtmContainerId = Site.current.getCustomPreferenceValue('GTMID') || '';

    res.render('/tagManager/tagHead', {
        id: gtmContainerId
    });
    next();
});

module.exports = server.exports();
