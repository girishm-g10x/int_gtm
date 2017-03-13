'use strict';

import { assert } from 'chai';
import { config } from '../webdriver/wdio.conf';
import * as homePage from '../../mocks/testDataMgr/pageObjects/home';
import * as productDetailPage from '../../mocks/testDataMgr/pageObjects/productDetail';
import * as cartPage from '../../mocks/testDataMgr/pageObjects/cart';
import * as checkoutPage from '../../mocks/testDataMgr/pageObjects/checkout';
import * as checkoutInterceptPage from '../../mocks/testDataMgr/pageObjects/CheckoutLoginIntercept';
import * as testDataMgr from '../../mocks/testDataMgr/main';
import * as common from '../../mocks/testDataMgr/helpers/common';
import * as Resource from '../../mocks/dw/web/Resource';


/*
Verify the ability to go back and edit billing address from place order page.
From place order page, edit payment an do the following:
 - uncheck "Billing and Shipping details are the same"
   set billing address different from shipping address
 - submit payment form and verify
 - check "Billing and Shipping details are the same"
 - submit payment form and verify
 */

describe('Checkout - As Guest - Editing billing address', () => {
    const locale = config.locale;
    const userEmail = config.userEmail;

    let shippingData = {};
    let billingData = {};
    let paymentData = {};

    const productVariantId1 = '701644388652';
    let productVariant1;

    const prodIdUnitPricesMap = {};

    const groundShipMethodIndex = 0;

    // in before block:
    // - prepare shipping and payment data
    // - add product to cart
    // - navigate to cart
    // - checkout
    before(() => {
        return testDataMgr.load()
            .then(() => {
                const creditCard = testDataMgr.creditCard1;
                const customer = testDataMgr.getCustomerByLogin(userEmail);

                shippingData = common.createShippingData(customer, locale);
                billingData = common.createBillingData(locale);
                paymentData = common.createPaymentData(creditCard);

                prodIdUnitPricesMap[productVariantId1] = testDataMgr.getPricesByProductId(productVariantId1, locale);

                productVariant1 = testDataMgr.getProductById(productVariantId1);
            })
            .then(() => browser.url(productVariant1.getUrlResourcePath()))
            .then(() => productDetailPage.clickAddToCartButton())
            .then(() => cartPage.navigateTo())
            .then(() => browser.waitForVisible(cartPage.SHIPPING_METHODS))
            .then(() => browser.selectByIndex(cartPage.SHIPPING_METHODS, groundShipMethodIndex))
            .then(() => browser.waitForVisible(cartPage.BTN_CHECKOUT))
            .then(() => browser.pause(1000))
            .then(() => browser.click(cartPage.BTN_CHECKOUT))
            .then(() => browser.waitForVisible(checkoutInterceptPage.BTN_CHECKOUT_AS_GUEST))
            .then(() => browser.click(checkoutInterceptPage.BTN_CHECKOUT_AS_GUEST))
            .then(() => browser.waitForExist(checkoutPage.SHIPPING_ACTIVE_TAB))
            .then(() => checkoutPage.fillOutShippingForm(shippingData, locale))
            .then(() => browser.click(checkoutPage.BTN_NEXT_PAYMENT))
            .then(() => browser.waitForExist(checkoutPage.BTN_NEXT_PLACE_ORDER))
            .then(() => browser.waitForVisible(checkoutPage.PAYMENT_FORM))
            .then(() => checkoutPage.fillOutPaymentForm(paymentData))
            .then(() => browser.click(checkoutPage.BTN_NEXT_PLACE_ORDER))
            .then(() => browser.waitForExist(checkoutPage.BTN_PLACE_ORDER))
            .then(() => browser.waitForVisible(checkoutPage.PAYMENT_SUMMARY));
    });

    after(() => homePage.navigateTo()
        .then(() => cartPage.emptyCart())
    );

    describe('Edit payment information and set different billing address', () => {
        it('Edit payment card', () => {
            return browser.waitForVisible(checkoutPage.BTN_PAYMENT_EDIT)
                .click(checkoutPage.BTN_PAYMENT_EDIT)
                .then(() => browser.waitForVisible(checkoutPage.PAYMENT_FORM_TITLE))
                .then(() => browser.getText(checkoutPage.PAYMENT_FORM_TITLE))
                .then((paymentCardTitle) => {
                    const expectedPaymentCardTitle = Resource.msgf('heading.payment', 'checkout', null);
                    return assert.equal(paymentCardTitle, expectedPaymentCardTitle, 'Expected to be back on payment page with card title = ' + expectedPaymentCardTitle);
                });
        });

        it('Uncheck Billing and Shipping details are the same', () => {
            return checkoutPage.uncheckSameBillingShipping()
                .then(() => browser.waitForVisible(checkoutPage.BILLING_ADDRESS_FORM));
        });

        // Fill in Billing Form and submit
        it('Fill required fields in billing form and submit', () => {
            return checkoutPage.fillOutBillingForm(billingData, locale)
                .then(() => browser.isEnabled(checkoutPage.BTN_NEXT_PLACE_ORDER))
                .then(btnEnabled => assert.ok(btnEnabled))
                .then(() => browser.click(checkoutPage.BTN_NEXT_PLACE_ORDER))
                .then(() => browser.waitForExist(checkoutPage.BTN_PLACE_ORDER))
                .then(() => browser.waitForVisible(checkoutPage.PAYMENT_SUMMARY));
        });
    });

    describe('Summary of billing information - different billing and shipping address', () => {
        it('Verify billing address label', () => {
            return browser.getText(checkoutPage.BILLING_ADDRESS_LABEL)
                .then((billingAddrLabel) => {
                    const expectedBillingAddrLabel = Resource.msgf('label.order.billing.address', 'confirmation', null);
                    return assert.equal(billingAddrLabel, expectedBillingAddrLabel, 'Expected to be have billing address label = ' + expectedBillingAddrLabel);
                });
        });

        it('Verify name', () => {
            return browser.getText(checkoutPage.BILLING_ADDR_FIRST_NAME)
                .then((firstName) => {
                    const expectedFirstName = billingData[checkoutPage.BILLING_FIRST_NAME];
                    return assert.equal(firstName, expectedFirstName, 'Expected billing first name to be = ' + expectedFirstName);
                })
                .then(() => browser.getText(checkoutPage.BILLING_ADDR_LAST_NAME))
                .then((lastName) => {
                    const expectedLastName = billingData[checkoutPage.BILLING_LAST_NAME];
                    return assert.equal(lastName, expectedLastName, 'Expected billing last name to be = ' + expectedLastName);
                });
        });


        it('Verify street name', () => {
            return browser.getText(checkoutPage.BILLING_ADDR_ADDRESS1)
                .then((address1) => {
                    const expectedAddress1 = billingData[checkoutPage.BILLING_ADDRESS_ONE];
                    return assert.equal(address1, expectedAddress1, 'Expected billing address1 to be = ' + expectedAddress1);
                });
        });

        it('Verify city name', () => {
            return browser.getText(checkoutPage.BILLING_ADDR_CITY)
                .then((city) => {
                    const expectedCity = billingData[checkoutPage.BILLING_ADDRESS_CITY];
                    return assert.equal(city, expectedCity, 'Expected billing city to be = ' + expectedCity);
                });
        });

        it('Verify state code', () => {
            if (locale && locale === 'x_default') {
                return browser.getText(checkoutPage.BILLING_ADDR_STATE_CODE)
                    .then((stateCode) => {
                        const expectedStateCode = billingData[checkoutPage.BILLING_STATE];
                        return assert.equal(stateCode, expectedStateCode, 'Expected billing state code to be = ' + expectedStateCode);
                    });
            }
            return Promise.resolve();
        });

        it('Verify postal code', () => {
            return browser.getText(checkoutPage.BILLING_ADDR_POSTAL_CODE)
                .then((zipCode) => {
                    const expectedZipCode = billingData[checkoutPage.BILLING_ZIP_CODE];
                    return assert.equal(zipCode, expectedZipCode, 'Expected billing zip code to be = ' + expectedZipCode);
                });
        });

        it('Verify email', () => {
            return browser.getText(checkoutPage.ORDER_SUMMARY_EMAIL)
                .then((email) => {
                    const expectedEmail = paymentData[checkoutPage.PAYMENT_EMAIL];
                    return assert.equal(email, expectedEmail, 'Expected payment email to be = ' + expectedEmail);
                });
        });

        it('Verify phone', () => {
            return browser.getText(checkoutPage.ORDER_SUMMARY_PHONE)
                .then((phone) => {
                    const expectedPhone = paymentData[checkoutPage.PAYMENT_PHONE_NUMBER];
                    return assert.equal(phone, expectedPhone, 'Expected payment email to be = ' + expectedPhone);
                });
        });
    });

    describe('Summary payment information - on Place Order page', () => {
        it('Verify payment label', () => {
            return browser.getText(checkoutPage.PAYMENT_INFO_LABEL)
                .then((paymentLabel) => {
                    const expectedPaymentLabel = Resource.msgf('label.order.payment.info', 'confirmation', null);
                    return assert.equal(paymentLabel, expectedPaymentLabel, 'Expected to be have payment label = ' + expectedPaymentLabel);
                });
        });

        it('Verify credit type', () => {
            return browser.getText(checkoutPage.PAYMENT_DETAILS)
                .then((creditCard) => {
                    const creditCardType = Resource.msgf('msg.payment.type.credit', 'confirmation', null) + ' Visa';
                    const last4Char = paymentData[checkoutPage.PAYMENT_CARD_NUMBER].substring(12);
                    const maskedCardNumber = '************' + last4Char;

                    const endingText = Resource.msgf('msg.card.type.ending', 'confirmation', null);
                    const yearStr = paymentData[checkoutPage.PAYMENT_EXPIRATION_YEAR].split('.')[0];
                    const expirationDate = paymentData[checkoutPage.PAYMENT_EXPIRATION_MONTH] + '/' + yearStr;

                    const expectedCreditCard = creditCardType + '\n' + maskedCardNumber + '\n' + endingText + ' ' + expirationDate;
                    return assert.equal(creditCard, expectedCreditCard, 'Expected credit card info to be = ' + expectedCreditCard);
                });
        });
    });

    describe('Edit billing information, set billing address same as shipping address', () => {
        it('Verify billing form no longer visible. Submit form', () => {
            return browser.waitForVisible(checkoutPage.BTN_PAYMENT_EDIT)
                .click(checkoutPage.BTN_PAYMENT_EDIT)
                .then(() => browser.waitForVisible(checkoutPage.PAYMENT_FORM_TITLE))
                .then(() => checkoutPage.checkSameBillingShipping())
                .then(() => browser.waitForVisible(checkoutPage.BILLING_ADDRESS_FORM, 500, true))
                .then(() => browser.click(checkoutPage.BTN_NEXT_PLACE_ORDER))
                .then(() => browser.waitForExist(checkoutPage.BTN_PLACE_ORDER))
                .then(() => browser.waitForVisible(checkoutPage.PAYMENT_SUMMARY));
        });
    });

    describe('Summary of billing information - same billing and shipping address', () => {
        it('Verify name', () => {
            return browser.getText(checkoutPage.BILLING_ADDR_FIRST_NAME)
                .then((firstName) => {
                    const expectedFirstName = shippingData[checkoutPage.BILLING_FIRST_NAME];
                    return assert.equal(firstName, expectedFirstName, 'Expected billing first name to be = ' + expectedFirstName);
                })
                .then(() => browser.getText(checkoutPage.BILLING_ADDR_LAST_NAME))
                .then((lastName) => {
                    const expectedLastName = shippingData[checkoutPage.BILLING_LAST_NAME];
                    return assert.equal(lastName, expectedLastName, 'Expected billing last name to be = ' + expectedLastName);
                });
        });


        it('Verify street name', () => {
            return browser.getText(checkoutPage.BILLING_ADDR_ADDRESS1)
                .then((address1) => {
                    const expectedAddress1 = shippingData[checkoutPage.BILLING_ADDRESS_ONE];
                    return assert.equal(address1, expectedAddress1, 'Expected billing address1 to be = ' + expectedAddress1);
                });
        });

        it('Verify city name', () => {
            return browser.getText(checkoutPage.BILLING_ADDR_CITY)
                .then((city) => {
                    const expectedCity = shippingData[checkoutPage.BILLING_ADDRESS_CITY];
                    return assert.equal(city, expectedCity, 'Expected billing city to be = ' + expectedCity);
                });
        });

        it('Verify state code', () => {
            if (locale && locale === 'x_default') {
                return browser.getText(checkoutPage.BILLING_ADDR_STATE_CODE)
                    .then((stateCode) => {
                        const expectedStateCode = shippingData[checkoutPage.BILLING_STATE];
                        return assert.equal(stateCode, expectedStateCode, 'Expected billing state code to be = ' + expectedStateCode);
                    });
            }
            return Promise.resolve();
        });

        it('Verify postal code', () => {
            return browser.getText(checkoutPage.BILLING_ADDR_POSTAL_CODE)
                .then((zipCode) => {
                    const expectedZipCode = shippingData[checkoutPage.BILLING_ZIP_CODE];
                    return assert.equal(zipCode, expectedZipCode, 'Expected billing zip code to be = ' + expectedZipCode);
                });
        });

        it('Verify email', () => {
            return browser.getText(checkoutPage.ORDER_SUMMARY_EMAIL)
                .then((email) => {
                    const expectedEmail = paymentData[checkoutPage.PAYMENT_EMAIL];
                    return assert.equal(email, expectedEmail, 'Expected payment email to be = ' + expectedEmail);
                });
        });

        it('Verify phone', () => {
            return browser.getText(checkoutPage.ORDER_SUMMARY_PHONE)
                .then((phone) => {
                    const expectedPhone = paymentData[checkoutPage.PAYMENT_PHONE_NUMBER];
                    return assert.equal(phone, expectedPhone, 'Expected payment email to be = ' + expectedPhone);
                });
        });
    });
});
