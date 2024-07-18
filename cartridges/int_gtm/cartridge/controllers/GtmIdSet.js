'use strict';
 
/**
 * @namespace GtmIdSet
 * This is a controller to set the gtm id given from the BM
 */
 
/**
 * GtmIdSet-SetBody : This end point is to set the body tag
 * @name GtmIdSet-SetBody
 * @function
 * @param {renders} - isml
 */
var server = require('server');
 
server.get('SetBody', function (req, res, next) {
    var Site = require('dw/system/Site');
    var gtmContainerId = Site.current.getCustomPreferenceValue('GTMID') || '';
    var gtmEnable = Site.current.getCustomPreferenceValue('GTMEnable') || false;
 
    if(gtmEnable){
        res.render('/tagManager/tagBody', {
            gtmId: gtmContainerId
        });
    }
    next();
});
 
/**
 * GtmIdSet-SetHead : This end point is to set the Head tag
 * @name GtmIdSet-SetHead
 * @function
 * @param {renders} - isml
 */
server.get('SetHead', function (req, res, next) {
    var Site = require('dw/system/Site');
    var gtmContainerId = Site.current.getCustomPreferenceValue('GTMID') || '';
    var gtmEnable = Site.current.getCustomPreferenceValue('GTMEnable') || false;
 
    if(gtmEnable){
        res.render('/tagManager/tagHead', {
            gtmId: gtmContainerId
        });
    }
    next();
});
 
module.exports = server.exports();
 