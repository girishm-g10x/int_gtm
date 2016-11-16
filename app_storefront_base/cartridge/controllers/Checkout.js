'use strict';

var server = require('server');
var locale = require('~/cartridge/scripts/middleware/locale');

var BasketMgr = require('dw/order/BasketMgr');
var HookMgr = require('dw/system/HookMgr');
var PaymentInstrument = require('dw/order/PaymentInstrument');
var PaymentMgr = require('dw/order/PaymentMgr');
var Resource = require('dw/web/Resource');
var ShippingMgr = require('dw/order/ShippingMgr');
var Transaction = require('dw/system/Transaction');

var AddressModel = require('~/cartridge/models/address');
var BillingModel = require('~/cartridge/models/billing');
var OrderModel = require('~/cartridge/models/order');
var Payment = require('~/cartridge/models/payment');
var ProductLineItemModel = require('~/cartridge/models/productLineItems');
var ShippingModel = require('~/cartridge/models/shipping');
var TotalsModel = require('~/cartridge/models/totals');

/**
 * Main entry point for Checkout
 */
server.get('Start', locale, function (req, res, next) {
    var applicablePaymentCards;
    var applicablePaymentMethods;
    var countryCode = 'US'; // req.geolocation.countryCode;
    var currentBasket = BasketMgr.getCurrentBasket();
    var currentCustomer = req.currentCustomer.raw;
    var billingAddress = currentBasket.billingAddress;
    var paymentAmount = currentBasket.totalGrossPrice;
    var paymentInstruments;
    var shipment = currentBasket.defaultShipment;
    var shippingAddress = shipment.shippingAddress;
    var shipmentShippingModel;

    // models
    var billingAddressModel;
    var billingModel;
    var orderModel;
    var orderTotals;
    var paymentModel;
    var productLineItemModel;
    var shippingAddressModel;
    var shippingModel;

    shipmentShippingModel = ShippingMgr.getShipmentShippingModel(
        currentBasket.defaultShipment
    );
    shippingAddressModel = new AddressModel(shippingAddress);
    shippingModel = new ShippingModel(
        currentBasket.defaultShipment,
        shipmentShippingModel,
        shippingAddressModel
    );

    applicablePaymentMethods = PaymentMgr.getApplicablePaymentMethods(
        currentCustomer,
        countryCode,
        paymentAmount.value
    );

    applicablePaymentCards = PaymentMgr.getPaymentMethod(PaymentInstrument.METHOD_CREDIT_CARD)
        .getApplicablePaymentCards(currentCustomer, countryCode, paymentAmount.value);

    paymentInstruments = currentBasket.paymentInstruments;

    paymentModel = new Payment(applicablePaymentMethods,
        applicablePaymentCards,
        paymentInstruments
    );

    billingAddressModel = new AddressModel(billingAddress);
    billingModel = new BillingModel(billingAddressModel, paymentModel);

    productLineItemModel = new ProductLineItemModel(currentBasket);
    orderTotals = new TotalsModel(currentBasket);

    var shippingForm = server.forms.getForm('singleShipping');
    var billingForm = server.forms.getForm('payment');

    orderModel = new OrderModel(
        currentBasket,
        shippingModel,
        billingModel,
        orderTotals,
        productLineItemModel
    );

    var forms = {
        shippingForm: shippingForm,
        billingForm: billingForm
    };

    res.render('checkout/checkout', { order: orderModel, forms: forms });
    next();
});

/**
 * Validate billing form
 * @param {Object} form - the form object with pre-validated form fields
 * @param {Array} formKeys - the name of the form fields to validate in form
 * @returns {Object} the names of the invalid form fields
 */
function validateFields(form, formKeys) {
    var result = {};

    //
    // Look for invalid form fields
    //
    formKeys.forEach(function (key) {
        if (form[key] instanceof Object) {
            if (form[key].valid === false) {
                result[form[key].htmlName] = Resource.msg(form[key].error, 'address', null);
            }
        }
    });

    return result;
}

/**
 * Validate billing form fields
 * @param {Object} form - the form object with pre-validated form fields
 * @param {Array} fields - the fields to validate
 * @returns {Object} the names of the invalid form fields
 */
function validateBillingForm(form) {
    var formKeys = [
        'firstName',
        'lastName',
        'address1',
        'address2',
        'city',
        'postal',
        'country',
        'states'
    ];

    return validateFields(form, formKeys);
}

/**
 * Validate credit card form fields
 * @param {Object} form - the form object with pre-validated form fields
 * @returns {Object} the names of the invalid form fields
 */
function validateCreditCard(form) {
    var result = {};
    var currentBasket = BasketMgr.getCurrentBasket();

    if (!form.paymentMethod.value) {
        if (currentBasket.totalGrossPrice.value > 0) {
            result[form.paymentMethod.htmlName] =
                Resource.msg('error.no.selected.payment.method', 'creditCard', null);
        }

        return result;
    }

    var formKeys = [
        'cardNumber',
        'expirationYear',
        'expirationMonth',
        'securityCode',
        'email',
        'phone'
    ];

    return validateFields(form, formKeys);
}

/**
 * Validate billing form fields
 * @param {Object} form - the form object with pre-validated form fields
 * @param {Array} fields - the fields to validate
 * @returns {Object} the names of the invalid form fields
 */
function validateShippingForm(form) {
    var formKeys = [
        'firstName',
        'lastName',
        'address1',
        'address2',
        'city',
        'postalCode',
        'country',
        'states'
    ];

    return validateFields(form, formKeys);
}

/**
 * Handle Ajax shipping form submit
 */
server.post('SubmitShipping', function (req, res, next) {
    var form = server.forms.getForm('singleShipping');
    var shippingFormErrors;
    var result = {};

    // verify shipping form data
    shippingFormErrors = validateShippingForm(form.shippingAddress.addressFields);

    if (Object.keys(shippingFormErrors).length > 0) {
        res.json({
            form: form,
            fieldErrors: [shippingFormErrors],
            serverErrors: [],
            error: true
        });
    } else {
        result.address = {
            firstName: form.shippingAddress.addressFields.firstName.value,
            lastName: form.shippingAddress.addressFields.lastName.value,
            address1: form.shippingAddress.addressFields.address1.value,
            address2: form.shippingAddress.addressFields.address2.value,
            city: form.shippingAddress.addressFields.city.value,
            stateCode: form.shippingAddress.addressFields.states.state.value,
            postalCode: form.shippingAddress.addressFields.postalCode.value,
            countryCode: form.shippingAddress.addressFields.country.value,
            phone: form.shippingAddress.addressFields.phone.value
        };

        result.shippingBillingSame = form.shippingAddress.shippingAddressUseAsBillingAddress.value;
        result.shippingMethod = form.shippingAddress.shippingMethodID.value.toString();

        res.setViewData(result);

        this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
            var shippingData = res.getViewData();

            var currentBasket = BasketMgr.getCurrentBasket();
            var billingAddress = currentBasket.billingAddress;
            var orderTotals;
            var shipment = currentBasket.defaultShipment;
            var shippingAddress = shipment.shippingAddress;
            var shippingAddressModel;
            var shippingModel;
            var shipmentShippingModel;
            var shippingMethodID = shippingData.shippingMethod;

            Transaction.wrap(function () {
                if (shippingAddress === null) {
                    shippingAddress = shipment.createShippingAddress();
                }

                shippingAddress.setFirstName(shippingData.address.firstName);
                shippingAddress.setLastName(shippingData.address.lastName);
                shippingAddress.setAddress1(shippingData.address.address1);
                shippingAddress.setAddress2(shippingData.address.address2);
                shippingAddress.setCity(shippingData.address.city);
                shippingAddress.setPostalCode(shippingData.address.postalCode);
                shippingAddress.setStateCode(shippingData.address.stateCode);
                shippingAddress.setCountryCode(shippingData.address.countryCode);
                shippingAddress.setPhone(shippingData.address.phone);

                if (shippingData.shippingBillingSame === true) {
                    if (!billingAddress) {
                        billingAddress = currentBasket.createBillingAddress();
                    }

                    billingAddress.setFirstName(shippingData.address.firstName);
                    billingAddress.setLastName(shippingData.address.lastName);
                    billingAddress.setAddress1(shippingData.address.address1);
                    billingAddress.setAddress2(shippingData.address.address2);
                    billingAddress.setCity(shippingData.address.city);
                    billingAddress.setPostalCode(shippingData.address.postalCode);
                    billingAddress.setStateCode(shippingData.address.stateCode);
                    billingAddress.setCountryCode(shippingData.address.countryCode);
                    billingAddress.setPhone(shippingData.address.phone);
                }
            });

            if (shippingMethodID !== shipment.shippingMethod.ID) {
                Transaction.wrap(function () {
                    ShippingModel.selectShippingMethod(shipment, shippingMethodID);
                    HookMgr.callHook('dw.ocapi.shop.basket.calculate', 'calculate', currentBasket);
                });
            }

            shippingAddressModel = new AddressModel(shippingAddress);
            shipmentShippingModel = ShippingMgr.getShipmentShippingModel(shipment);
            shippingModel = new ShippingModel(
                shipment,
                shipmentShippingModel,
                shippingAddressModel
            );

            orderTotals = new TotalsModel(currentBasket);

            res.json({
                totals: orderTotals,
                shippingData: shippingModel,
                form: server.forms.getForm('singleShipping')
            });
        });
    }

    next();
});

/**
 *  Handle Ajax payment (and billing) form submit
 */
server.post('SubmitPayment', function (req, res, next) {
    var paymentForm = server.forms.getForm('payment');
    var billingFormErrors = {};
    var creditCardErrors;
    var viewData = {};

    // verify billing form data
    if (!paymentForm.shippingAddressUseAsBillingAddress.value) {
        billingFormErrors = validateBillingForm(paymentForm);
    }

    // verify credit card form data
    creditCardErrors = validateCreditCard(paymentForm);

    if (Object.keys(creditCardErrors).length || Object.keys(billingFormErrors).length) {
        // respond with form data and errors
        res.json({
            form: paymentForm,
            fieldErrors: [billingFormErrors, creditCardErrors],
            serverErrors: [],
            error: true
        });
    } else {
        viewData.address = {
            firstName: { value: paymentForm.firstName.value },
            lastName: { value: paymentForm.lastName.value },
            address1: { value: paymentForm.address1.value },
            address2: { value: paymentForm.address2.value },
            city: { value: paymentForm.city.value },
            stateCode: { value: paymentForm.states.state.value },
            postalCode: { value: paymentForm.postal.value },
            countryCode: { value: paymentForm.country.value }
        };

        viewData.shippingAddressUseAsBillingAddress = {
            value: paymentForm.shippingAddressUseAsBillingAddress.value
        };

        viewData.paymentMethod = {
            value: paymentForm.paymentMethod.value,
            htmlName: paymentForm.paymentMethod.value
        };

        viewData.paymentInformation = {
            cardType: {
                value: paymentForm.cardType.value,
                htmlName: paymentForm.cardType.htmlName
            },
            cardNumber: {
                value: paymentForm.cardNumber.value,
                htmlName: paymentForm.cardNumber.htmlName
            },
            securityCode: {
                value: paymentForm.securityCode.value,
                htmlName: paymentForm.securityCode.htmlName
            },
            expirationMonth: {
                value: paymentForm.expirationMonth.value,
                htmlName: paymentForm.expirationMonth.htmlName
            },
            expirationYear: {
                value: paymentForm.expirationYear.value,
                htmlName: paymentForm.expirationYear.htmlName
            }
        };

        viewData.email = {
            value: paymentForm.email.value
        };

        res.setViewData(viewData);

        this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
            var currentBasket = BasketMgr.getCurrentBasket();
            var billingAddress = currentBasket.billingAddress;
            var billingData = res.getViewData();
            var paymentInstruments;
            var paymentMethodID = billingData.paymentMethod.value;
            var result;
            var shippingAddress;

            var billingAddressModel;
            var billingModel;
            var paymentModel;

            Transaction.wrap(function () {
                // If checkbox isn't checked set billing address from form
                if (billingData.shippingAddressUseAsBillingAddress.value !== true) {
                    if (!billingAddress) {
                        billingAddress = currentBasket.createBillingAddress();
                    }

                    billingAddress.setFirstName(billingData.address.firstName.value);
                    billingAddress.setLastName(billingData.address.lastName.value);
                    billingAddress.setAddress1(billingData.address.address1.value);
                    billingAddress.setAddress2(billingData.address.address2.value);
                    billingAddress.setCity(billingData.address.city.value);
                    billingAddress.setPostalCode(billingData.address.postalCode.value);
                    billingAddress.setStateCode(billingData.address.stateCode.value);
                    billingAddress.setCountryCode(billingData.address.countryCode.value);
                }

                // if checkbox is not checked on shipping but checked on billing
                if (billingData.shippingAddressUseAsBillingAddress.value === true &&
                    (!billingAddress || !billingAddress.isEquivalentAddress(
                        currentBasket.defaultShipment.shippingAddress
                    ))) {
                    shippingAddress = currentBasket.defaultShipment.shippingAddress;
                    billingAddress = currentBasket.createBillingAddress();

                    billingAddress.setFirstName(shippingAddress.firstName);
                    billingAddress.setLastName(shippingAddress.lastName);
                    billingAddress.setAddress1(shippingAddress.address1);
                    billingAddress.setAddress2(shippingAddress.address2);
                    billingAddress.setCity(shippingAddress.city);
                    billingAddress.setPostalCode(shippingAddress.postalCode);
                    billingAddress.setStateCode(shippingAddress.stateCode);
                    billingAddress.setCountryCode(shippingAddress.countryCode);
                }

                currentBasket.setCustomerEmail(billingData.email.value);
            });

            // if there is no selected payment option and balance is greater than zero
            if (!paymentMethodID && currentBasket.totalGrossPrice.value > 0) {
                var noPaymentMethod = {};
                noPaymentMethod[billingData.paymentMethod.htmlName] =
                    Resource.msg('error.no.selected.payment.method', 'creditCard', null);

                res.json({
                    form: server.forms.getForm('payment'),
                    fieldErrors: [noPaymentMethod],
                    serverErrors: [],
                    error: true
                });
                return;
            }

            // check to make sure there is a payment processor
            if (!PaymentMgr.getPaymentMethod(paymentMethodID).paymentProcessor) {
                throw new Error(Resource.msg('error.payment.processor.missing', 'checkout', null));
            }

            var processor = PaymentMgr.getPaymentMethod(paymentMethodID).getPaymentProcessor();

            if (HookMgr.hasHook('app.payment.processor.' + processor.ID.toLowerCase())) {
                result = HookMgr.callHook('app.payment.processor.' + processor.ID.toLowerCase(),
                    'Handle',
                    currentBasket,
                    billingData.paymentInformation
                );
            } else {
                result = HookMgr.callHook('app.payment.processor.default', 'Handle');
            }

            // need to invalidate credit card fields
            if (result.error) {
                res.json({
                    form: server.forms.getForm('payment'),
                    fieldErrors: result.fieldErrors,
                    serverErrors: result.serverErrors,
                    error: true
                });
                return;
            }

            paymentInstruments = currentBasket.paymentInstruments;
            paymentModel = new Payment(null, null, paymentInstruments);

            billingAddressModel = new AddressModel(billingAddress);
            billingModel = new BillingModel(billingAddressModel, paymentModel);

            var resource = {
                cardType: Resource.msg('msg.payment.type.credit', 'confirmation', null),
                cardEnding: Resource.msg('msg.card.type.ending', 'confirmation', null)
            };

            res.json({
                billingData: billingModel,
                form: server.forms.getForm('payment'),
                resource: resource,
                error: false
            });
        });
    }
    next();
});

server.get('UpdateShippingMethodsList', function (req, res, next) {
    var address = {
        postalCode: req.querystring.postal,
        stateCode: req.querystring.state
    };
    var applicableShippingMethods;
    var currentBasket = BasketMgr.getCurrentBasket();
    var orderTotals;
    var shipment = currentBasket.defaultShipment;
    var shipmentShippingModel;
    var shippingAddressModel;
    var shippingModel;

    shipmentShippingModel = ShippingMgr.getShipmentShippingModel(shipment);
    applicableShippingMethods = shipmentShippingModel.getApplicableShippingMethods(address);

    Transaction.wrap(function () {
        ShippingModel.selectShippingMethod(shipment, null, applicableShippingMethods, address);
        HookMgr.callHook('dw.ocapi.shop.basket.calculate', 'calculate', currentBasket);
    });

    orderTotals = new TotalsModel(currentBasket);

    shippingAddressModel = new AddressModel(address);
    shippingModel = new ShippingModel(shipment, shipmentShippingModel, shippingAddressModel);

    res.json({
        totals: orderTotals,
        shipping: shippingModel,
        shippingForm: server.forms.getForm('singleShipping')
    });
    next();
});

module.exports = server.exports();
