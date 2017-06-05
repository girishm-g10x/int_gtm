'use strict';

var server = require('server');
var array = require('*/cartridge/scripts/util/array');
var helper = require('*/cartridge/scripts/dwHelpers');
var URLUtils = require('dw/web/URLUtils');
var CustomerMgr = require('dw/customer/CustomerMgr');
var HookMgr = require('dw/system/HookMgr');
var Transaction = require('dw/system/Transaction');
var Resource = require('dw/web/Resource');
var PaymentMgr = require('dw/order/PaymentMgr');
var PaymentStatusCodes = require('dw/order/PaymentStatusCodes');
var AccountModel = require('*/cartridge/models/account');
var CSRFProtection = require('*/cartridge/scripts/middleware/csrf');

/**
 * Checks if a credit card is valid or not
 * @param {Object} card - plain object with card details
 * @param {Object} form - form object
 * @returns {boolean} a boolean representing card validation
 */
function verifyCard(card, form) {
    var paymentCard = PaymentMgr.getPaymentCard(card.cardType);
    var error = false;
    var cardNumber = card.cardNumber;
    var creditCardStatus = paymentCard.verify(
        card.expirationMonth,
        card.expirationYear,
        cardNumber
    );

    if (creditCardStatus.error) {
        helper.forEach(creditCardStatus.items, function (item) {
            switch (item.code) {
                case PaymentStatusCodes.CREDITCARD_INVALID_CARD_NUMBER:
                    var formCardNumber = form.cardNumber;
                    formCardNumber.valid = false;
                    formCardNumber.error =
                        Resource.msg('error.message.creditnumber.invalid', 'forms', null);
                    error = true;
                    break;

                case PaymentStatusCodes.CREDITCARD_INVALID_EXPIRATION_DATE:
                    var expirationMonth = form.expirationMonth;
                    var expirationYear = form.expirationYear;
                    expirationMonth.valid = false;
                    expirationMonth.error =
                        Resource.msg('error.message.creditexpiration.expired', 'forms', null);
                    expirationYear.valid = false;
                    error = true;
                    break;
                default:
                    error = true;
            }
        });
    }
    return error;
}

/**
 * Creates an object from form values
 * @param {Object} paymentForm - form object
 * @returns {Object} a plain object of payment instrument
 */
function getDetailsObject(paymentForm) {
    return {
        name: paymentForm.cardOwner.value,
        cardNumber: paymentForm.cardNumber.value,
        cardType: paymentForm.cardType.value,
        expirationMonth: paymentForm.expirationMonth.value,
        expirationYear: paymentForm.expirationYear.value,
        paymentForm: paymentForm
    };
}

/**
 * Creates a list of expiration years from the current year
 * @returns {List} a plain list of expiration years from current year
 */
function getExpirationYears() {
    var currentYear = new Date().getFullYear();
    var creditCardExpirationYears = [];

    for (var i = 0; i < 10; i++) {
        creditCardExpirationYears.push((currentYear + i).toString());
    }

    return creditCardExpirationYears;
}

server.get('List', function (req, res, next) {
    if (!req.currentCustomer.profile) {
        res.redirect(URLUtils.url('Login-Show'));
    } else {
        res.render('account/payment/payment', {
            paymentInstruments: AccountModel.getCustomerPaymentInstruments(
                req.currentCustomer.wallet.paymentInstruments
            ),
            actionUrl: URLUtils.url('PaymentInstruments-DeletePayment').toString(),
            breadcrumbs: [
                {
                    htmlValue: Resource.msg('global.home', 'common', null),
                    url: URLUtils.home().toString()
                },
                {
                    htmlValue: Resource.msg('page.title.myaccount', 'account', null),
                    url: URLUtils.url('Account-Show').toString()
                }
            ]
        });
    }

    next();
});

server.get('AddPayment', CSRFProtection.generateToken, function (req, res, next) {
    var creditCardExpirationYears = getExpirationYears();
    var paymentForm = server.forms.getForm('creditcard');
    paymentForm.clear();
    var months = paymentForm.expirationMonth.options;
    for (var j = 0, k = months.length; j < k; j++) {
        months[j].selected = false;
    }
    res.render('account/payment/editaddpayment', {
        paymentForm: paymentForm,
        expirationYears: creditCardExpirationYears,
        breadcrumbs: [
            {
                htmlValue: Resource.msg('global.home', 'common', null),
                url: URLUtils.home().toString()
            },
            {
                htmlValue: Resource.msg('page.title.myaccount', 'account', null),
                url: URLUtils.url('Account-Show').toString()
            },
            {
                htmlValue: Resource.msg('page.heading.payments', 'payment', null),
                url: URLUtils.url('PaymentInstruments-List').toString()
            }
        ]
    });

    next();
});

server.post('SavePayment', CSRFProtection.validateAjaxRequest, function (req, res, next) {
    var data = res.getViewData();
    if (data && data.csrfError) {
        res.json();
        return next();
    }
    var formErrors = require('*/cartridge/scripts/formErrors');

    var paymentForm = server.forms.getForm('creditcard');
    var result = getDetailsObject(paymentForm);
    var paymentInstruments = req.currentCustomer.wallet.paymentInstruments;

    if (paymentForm.valid && !verifyCard(result, paymentForm, paymentInstruments)) {
        res.setViewData(result);
        this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
            var formInfo = res.getViewData();
            var customer = CustomerMgr.getCustomerByCustomerNumber(
                req.currentCustomer.profile.customerNo
            );
            var wallet = customer.getProfile().getWallet();

            Transaction.wrap(function () {
                var paymentInstrument = wallet.createPaymentInstrument('CREDIT_CARD');
                paymentInstrument.setCreditCardHolder(formInfo.name);
                paymentInstrument.setCreditCardNumber(formInfo.cardNumber);
                paymentInstrument.setCreditCardType(formInfo.cardType);
                paymentInstrument.setCreditCardExpirationMonth(formInfo.expirationMonth);
                paymentInstrument.setCreditCardExpirationYear(formInfo.expirationYear);

                var token = HookMgr.callHook(
                    'app.payment.processor.basic_credit',
                    'createMockToken'
                );

                paymentInstrument.setCreditCardToken(token);
            });
            res.json({
                success: true,
                redirectUrl: URLUtils.url('PaymentInstruments-List').toString()
            });
        });
    } else {
        res.json({
            success: false,
            fields: formErrors(paymentForm)
        });
    }
    return next();
});

server.get('DeletePayment', function (req, res, next) {
    var UUID = req.querystring.UUID;
    var paymentInstruments = req.currentCustomer.wallet.paymentInstruments;
    var paymentToDelete = array.find(paymentInstruments, function (item) {
        return UUID === item.UUID;
    });
    res.setViewData(paymentToDelete);
    this.on('route:BeforeComplete', function () { // eslint-disable-line no-shadow
        var payment = res.getViewData();
        var customer = CustomerMgr.getCustomerByCustomerNumber(
            req.currentCustomer.profile.customerNo
        );
        var wallet = customer.getProfile().getWallet();
        Transaction.wrap(function () {
            wallet.removePaymentInstrument(payment.raw);
        });
        if (wallet.getPaymentInstruments().length === 0) {
            res.json({
                UUID: UUID,
                message: Resource.msg('msg.no.saved.payments', 'payment', null)
            });
        } else {
            res.json({ UUID: UUID });
        }
    });

    next();
});

server.get('Header', server.middleware.include, function (req, res, next) {
    res.render('account/header', { name:
        req.currentCustomer.profile ? req.currentCustomer.profile.firstName : null
    });
    next();
});

server.get('Menu', server.middleware.include, function (req, res, next) {
    res.render('account/menu', { name:
        req.currentCustomer.profile ? req.currentCustomer.profile.firstName : null
    });
    next();
});

module.exports = server.exports();
