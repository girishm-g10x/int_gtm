'use strict';

/**
 * @namespace gtmIdSet
 * This is a controller to set the gtm id given from the BM
 */

var server = require('server');

server.get('SetBody',function (req, res, next) {

    var Site = require('dw/system/Site');
    var gtmContainerId = Site.current.getCustomPreferenceValue('GTMID') || '';

    res.render('/tagManager/tagBody',{
        id: gtmContainerId
        });
    
next();
});

server.get('SetHead',function (req, res, next) {

    var Site = require('dw/system/Site');
    var gtmContainerId = Site.current.getCustomPreferenceValue('GTMID') || '';
    
    res.render('/tagManager/tagHead',{
        id: gtmContainerId
        });
    
next();
});

module.exports = server.exports();
