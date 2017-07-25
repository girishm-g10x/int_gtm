'use strict';

var HashMap = require('dw/util/HashMap');
var Mail = require('dw/net/Mail');
var OrderMgr = require('dw/order/OrderMgr');
var Order = require('dw/order/Order');
var Site = require('dw/system/Site');
var Template = require('dw/util/Template');
var Resource = require('dw/web/Resource');
var URLUtils = require('dw/web/URLUtils');

var OrderModel = require('*/cartridge/models/order');

/**
* Returns a list of orders for the current customer
* @param {Object} currentCustomer - object with customer properties
* @param {Object} querystring - querystring properties
* @returns {Object} - orderModel of the current dw order object
* */
function getOrders(currentCustomer, querystring) {
    // get all orders for this user
    var customerNo = currentCustomer.profile.customerNo;
    var customerOrders = OrderMgr.searchOrders(
        'customerNo={0} AND status!={1}',
        'creationDate desc',
        customerNo,
        Order.ORDER_STATUS_REPLACED
    );

    var orders = [];

    var filterValues = [
        {
            displayValue: Resource.msg('orderhistory.sixmonths.option', 'order', null),
            optionValue: URLUtils.url('Order-Filtered', 'orderFilter', '6').abs().toString()
        },
        {
            displayValue: Resource.msg('orderhistory.twelvemonths.option', 'order', null),
            optionValue: URLUtils.url('Order-Filtered', 'orderFilter', '12').abs().toString()
        }
    ];
    var orderYear;
    var years = [];
    var customerOrder;
    var SIX_MONTHS_AGO = Date.now() - 15778476000;
    var YEAR_AGO = Date.now() - 31556952000;
    var orderModel;

    while (customerOrders.hasNext()) {
        customerOrder = customerOrders.next();
        var config = {
            numberOfLineItems: 'single'
        };

        orderYear = customerOrder.getCreationDate().getFullYear().toString();
        var orderTime = customerOrder.getCreationDate().getTime();

        if (years.indexOf(orderYear) === -1) {
            var optionURL =
                URLUtils.url('Order-Filtered', 'orderFilter', orderYear).abs().toString();
            filterValues.push({
                displayValue: orderYear,
                optionValue: optionURL
            });
            years.push(orderYear);
        }

        if (querystring.orderFilter
            && querystring.orderFilter !== '12'
            && querystring.orderFilter !== '6') {
            if (orderYear === querystring.orderFilter) {
                orderModel = new OrderModel(customerOrder, { config: config });
                orders.push(orderModel);
            }
        } else if (querystring.orderFilter
            && YEAR_AGO < orderTime
            && querystring.orderFilter === '12') {
            orderModel = new OrderModel(customerOrder, { config: config });
            orders.push(orderModel);
        } else if (SIX_MONTHS_AGO < orderTime) {
            orderModel = new OrderModel(customerOrder, { config: config });
            orders.push(orderModel);
        }
    }

    return {
        orders: orders,
        filterValues: filterValues
    };
}

/**
 * Sends a confirmation email to the newly registered user
 * @param {Object} registeredUser - The newly registered user
 * @returns {void}
 */
function sendConfirmationEmail(registeredUser) {
    var confirmationEmail = new Mail();
    var context = new HashMap();
    var template;
    var content;

    var userObject = {
        email: registeredUser.email,
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName,
        url: URLUtils.https('Login-Show')
    };

    confirmationEmail.addTo(userObject.email);
    confirmationEmail.setSubject(
        Resource.msg('email.subject.new.registration', 'registration', null)
    );
    confirmationEmail.setFrom(Site.current.getCustomPreferenceValue('customerServiceEmail')
        || 'no-reply@salesforce.com');

    Object.keys(userObject).forEach(function (key) {
        context.put(key, userObject[key]);
    });

    template = new Template('checkout/confirmation/accountRegisteredEmail');
    content = template.render(context).text;
    confirmationEmail.setContent(content, 'text/html', 'UTF-8');
    confirmationEmail.send();
}

module.exports = {
    getOrders: getOrders,
    sendConfirmationEmail: sendConfirmationEmail
};
