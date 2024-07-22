'use strict';

var server = require('server');
var base = module.superModule;
server.extend(base);

server.append('Show', function (req, res, next) {
    var Site = require('dw/system/Site');
    var gtmEnable = Site.current.getCustomPreferenceValue('GTMEnable') || false;
    var gtmID = Site.current.getCustomPreferenceValue('GTMID') || '';

    res.setViewData({ gtmEnable: gtmEnable, gtmID: gtmID });
    next();
});

module.exports = server.exports();
