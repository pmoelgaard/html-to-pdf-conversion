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
                encoding: null,
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

            if (utils.has(args, API.PARAM_EXPORT)) {

                var exportFilename = utils.get(args, API.PARAM_EXPORT);

                var fs = require('fs-path');
                fs.writeFile(exportFilename, result, function (err) {

                    if (err) {
                        return reject(err);
                    }

                    result = {
                        "success": true,
                        "info": "The PDF file has been saved to your local file system",
                        "file_name": exportFilename
                    };

                    return resolve(result);
                });
            }
            else {
                // and we resolve and return (not necessary to return, but keeps consistency)
                return resolve(result);
            }
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


var ConvertQuery = function (document, options) {
    utils.extend(this, options);
    var documentType = utils.startsWith(document, 'http') ? API.PARAM_DOCUMENT_URL : API.PARAM_DOCUMENT_HTML;
    utils.set(this, documentType, document);
};
API.ConvertQuery = ConvertQuery;


API.SERVICE_NAME = 'convert';
API.SERVICE_METHOD = 'POST';

API.PARAM_SECRET_KEY = 'secret_key';
API.PARAM_DOCUMENT_URL = 'document_url';
API.PARAM_DOCUMENT_HTML = 'document_html';
API.PARAM_EXPORT = 'export';
API.PARAM_DOCUMENT_NAME = 'document_name';
API.PARAM_DOCUMENT_NAME_DEFAULT = 'pdflayer.com';
API.PARAM_DOCUMENT_UNIT = 'document_unit';
API.PARAM_DOCUMENT_UNIT_MM = 'mm';
API.PARAM_DOCUMENT_UNIT_IN = 'in';
API.PARAM_DOCUMENT_UNIT_PX = 'px';
API.PARAM_DOCUMENT_UNIT_PT = 'pt';
API.PARAM_DOCUMENT_UNIT_DEFAULT = API.PARAM_DOCUMENT_UNIT_PX;
API.PARAM_USER_AGENT = 'user_agent';
API.PARAM_ACCEPT_LANG = 'accept_lang';
API.PARAM_TEXT_ENCODING = 'text_encoding';
API.PARAM_TEXT_ENCODING_UTF8 = 'utf8';
API.PARAM_TEXT_ENCODING_UTF16 = 'utf16';
API.PARAM_TEXT_ENCODING_DEFAULT = API.PARAM_TEXT_ENCODING_UTF8;
API.PARAM_TTL = 'ttl';
API.PARAM_TTL_DEFAULT = 2592000;
API.PARAM_FORCE = 'force';
API.PARAM_INLINE = 'inline';
API.PARAM_AUTH_USER = 'auth_user';
API.PARAM_AUTH_PASSWORD = 'auth_password';
API.PARAM_ENCRYPTION = 'encryption';
API.PARAM_ENCRYPTION_40 = 'encryption_40';
API.PARAM_ENCRYPTION_128 = 'encryption_128';
API.PARAM_NO_IMAGES = 'no_images';
API.PARAM_NO_IMAGES_TRUE = 1;
API.PARAM_NO_IMAGES_FALSE = 0;
API.PARAM_NO_HYPERLINKS = 'no_hyperlinks';
API.PARAM_NO_HYPERLINKS_TRUE = 1;
API.PARAM_NO_HYPERLINKS_FALSE = 0;
API.PARAM_NO_BACKGROUNDS = 'no_backgrounds';
API.PARAM_NO_JAVASCRIPT = 'no_javascript';
API.PARAM_USE_PRINT_MEDIA = 'use_print_media';
API.PARAM_GRAYSCALE = 'grayscale';
API.PARAM_LOW_QUALITY = 'low_quality';
API.PARAM_FORMS = 'forms';
API.PARAM_NO_PRINT = 'no_print';
API.PARAM_NO_MODIFY = 'no_modify';
API.PARAM_NO_COPY = 'no_copy';
API.PARAM_PAGE_SIZE = 'page_size';
API.PARAM_PAGE_SIZE_A = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'];
API.PARAM_PAGE_SIZE_B = ['B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9'];
API.PARAM_PAGE_SIZE_OTHER = ['C5E', 'Comm10E', 'DLE', 'Executive', 'Folio', 'Ledger', 'Legal', 'Letter', 'Tabloid'];
API.PARAM_PAGE_WIDTH = 'page_width';
API.PARAM_PAGE_HEIGHT = 'page_height';
API.PARAM_ORIENTATION = 'orientation';
API.PARAM_ORIENTATION_PORTRAIT = 'portrait';
API.PARAM_ORIENTATION_LANDSCAPE = 'landscape';
API.PARAM_HEADER_TEXT = 'header_text';
API.PARAM_HEADER_ALIGN = 'header_align';
API.PARAM_HEADER_ALIGN_CENTER = 'center';
API.PARAM_HEADER_ALIGN_LEFT = 'left';
API.PARAM_HEADER_ALIGN_RIGHT = 'right';
API.PARAM_HEADER_ALIGN_DEFAULT = API.PARAM_HEADER_ALIGN_CENTER;
API.PARAM_HEADER_URL = 'header_url';
API.PARAM_HEADER_HTML = 'header_html';
API.PARAM_HEADER_SPACING = 'header_spacing';
API.PARAM_FOOTER_TEXT = 'footer_text';
API.PARAM_FOOTER_ALIGN = 'footer_align';
API.PARAM_FOOTER_ALIGN_CENTER = 'center';
API.PARAM_FOOTER_ALIGN_LEFT = 'left';
API.PARAM_FOOTER_ALIGN_RIGHT = 'right';
API.PARAM_FOOTER_ALIGN_DEFAULT = API.PARAM_FOOTER_ALIGN_CENTER;
API.PARAM_FOOTER_URL = 'footer_url';
API.PARAM_FOOTER_HTML = 'footer_html';
API.PARAM_FOOTER_SPACING = 'footer_spacing';
API.PARAM_CSS_URL = 'css_url';
API.PARAM_DELAY = 'delay';
API.PARAM_DPI = 'dpi';
API.PARAM_DPI_DEFAULT = 96;
API.PARAM_ZOOM = 'zoom';
API.PARAM_PAGE_NUMBERING_OFFSET = 'page_numbering_offset';
API.PARAM_WATERMARK_URL = 'watermark_url';
API.PARAM_WATERMARK_OPACITY = 'watermark_opacity';
API.PARAM_WATERMARK_OPACITY_DEFAULT = 20;
API.PARAM_WATERMARK_OFFSET_X = 'watermark_offset_x';
API.PARAM_WATERMARK_OFFSET_Y = 'watermark_offset_y';
API.PARAM_WATERMARK_IN_BACKGROUND = 'watermark_in_background';
API.PARAM_WATERMARK_IN_BACKGROUND_TRUE = 1;
API.PARAM_WATERMARK_IN_BACKGROUND_FALSE = 0;
API.PARAM_TITLE = 'title';
API.PARAM_SUBJECT = 'subject';
API.PARAM_CREATOR = 'creator';
API.PARAM_CREATOR_DEFAULT = 'pdflayer.com';
API.PARAM_AUTHOR = 'author';

/**
 * Exports the APIs
 * @type {Object}
 */
module.exports = API;