'use strict';

var Site = require('dw/system/Site');
var ISML = require('dw/template/ISML');

var gtmContainerId = Site.current.getCustomPreferenceValue('GTMID') || '';
var gtmEnable = Site.current.getCustomPreferenceValue('GTMEnable') || false;

/**
 * Function to enable GTM BodyTag.
 * @param {Object} pdict - The pipeline dictionary
 * @param {renders} - isml
 */
function beforeHeader(pdict) {
    if(gtmEnable){
        ISML.renderTemplate('/tagManager/tagBody', { 
            gtmId: gtmContainerId
        });
    }
}

/**
 * Function to enable GTM HeadTag.
 * @param {Object} pdict - The pipeline dictionary
 * @param {renders} - isml
 */
function htmlHead(pdict) {
    if(gtmEnable){
        ISML.renderTemplate('/tagManager/tagHead', { 
            gtmId: gtmContainerId
        });
    }
}

module.exports = {
    beforeHeader: beforeHeader,
    htmlHead: htmlHead
};
