'use strict';

var crypto = require('crypto');
var async = require('async');
var path = require('path');
var utils = require('../lib/utils');
var Promise = require('../lib/promise');
var APIError = require('../lib/apirequest-error');


// Declare our main module scope
var API;


/**
 * Check Email
 *
 * @param  {object} params - Parameters for request
 * @param  {callback} callback - The callback that handles the response.
 * @return {object} Result
 */
API = function (params, callback, options) {


    options = utils.defaults({}, options, this.options, {
            service: API.SERVICE_NAME,
            method: API.SERVICE_METHOD
        }
    );


    // Declare the promise we will use to wrap the request call
    var promise = new Promise(function (resolve, reject) {

        // Input Validation (we only do the most basic, and let the server do the most so validation will always be up to date)
        if (!params) {
            return reject(new APIError.MissingArgumentError(API.SERVICE_NAME, 'params'));
        }
        else if (!utils.has(params, API.PARAM_DOCUMENT_URL) && !utils.has(params, API.PARAM_DOCUMENT_HTML)) {
            return reject(new APIError.MissingArgumentError(API.SERVICE_NAME, 'params.' + API.PARAM_DOCUMENT_URL + ' | params.' + API.PARAM_DOCUMENT_HTML));
        }

        var args = utils.clone(params);

        if (utils.has(args, API.PARAM_DOCUMENT_URL)) {

            var secretKey = utils.get(args, API.PARAM_DOCUMENT_URL) + utils.get(options, API.PARAM_SECRET_KEY);
            secretKey = crypto.createHash('md5').update(secretKey).digest('hex');
            utils.set(args, API.PARAM_SECRET_KEY, secretKey);

            utils.set(args, API.PARAM_DOCUMENT_URL, encodeURIComponent(utils.get(params, API.PARAM_DOCUMENT_URL)));
        }


        // Prepare Parameters and prepare it for the Request modus
        var query = {
            options: options,
            params: {
                json: true,
                qs: args
            }
        };


        var APIRequest = require('../lib/apirequest');
        APIRequest.request(query, function (err, result) {

            if (utils.isNull(err) && utils.has(result, 'error')) {
                err = utils.get(result, 'error');
            }

            // If an error happens, we return early
            if (err) {
                return reject(err);
            }

            return resolve(result);
        });
    });

    // Ensure callback is set to make the main functions slightly simpler by avoiding nested conditionals
    callback = callback || utils.noop;

    // We offer callback support in addition to promise style (we know callback is set as we default it in the beginning)
    promise
        .then(function (result) {
            callback(null, result);
        })
        .catch(function (err) {
            callback(err);
        });


    // return the promise to the caller
    return promise;
};


var ConvertQuery = function (document) {
    var documentType = utils.startsWith(document, 'http') ? API.PARAM_DOCUMENT_URL : API.PARAM_DOCUMENT_HTML;
    utils.set(this, documentType, document);
};
API.ConvertQuery = ConvertQuery;


API.SERVICE_NAME = 'convert';
API.SERVICE_METHOD = 'POST';

API.PARAM_SECRET_KEY = 'secret_key';
API.PARAM_DOCUMENT_URL = 'document_url';
API.PARAM_DOCUMENT_HTML = 'document_html';


/**
 * Exports the APIs
 * @type {Object}
 */
module.exports = API;