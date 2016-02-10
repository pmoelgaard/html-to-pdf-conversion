var path = require('path');

var APIPath = path.join(__dirname, '../', 'index');
var API = require(APIPath);

// TEST START
var chai = require('chai');
var expect = chai.expect;
var assert = require('assert');

describe('#convert()', function () {

    this.timeout(20000);

    it('url to pdf', function (done) {

        var api = new API({
            access_key: process.env.ACCESS_KEY,
            secret_key: process.env.SECRET_KEY
        });

        var document_url = 'https://en.wikipedia.org/wiki/Special:Random';
        var convertQuery = new api.convert.ConvertQuery(document_url);

        api.convert(convertQuery)
            .then(function (result) {
                done(null, result);
            })
            .catch(function (err) {
                done(err);
            });
    });
});