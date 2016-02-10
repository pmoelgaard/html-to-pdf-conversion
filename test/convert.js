var path = require('path');
var uuid = require('node-uuid');

var APIPath = path.join(__dirname, '../', 'index');
var API = require(APIPath);

// TEST START
var chai = require('chai');
var expect = chai.expect;
var assert = require('assert');

describe('#convert()', function () {

    this.timeout(30000);

    it('url to pdf', function (done) {

        var api = new API({
            access_key: process.env.ACCESS_KEY,
            secret_key: process.env.SECRET_KEY
        });

        var document = 'https://en.wikipedia.org/wiki/Special:Random';
        var convertQuery = new api.convert.ConvertQuery(document, {});

        api.convert(convertQuery)
            .then(function (result) {
                done(null, result);
            })
            .catch(function (err) {
                done(err);
            });
    });

    it('url to pdf w. export', function (done) {

        var api = new API({
            access_key: process.env.ACCESS_KEY,
            secret_key: process.env.SECRET_KEY
        });

        var document = 'https://en.wikipedia.org/wiki/Special:Random';
        var convertQuery = new api.convert.ConvertQuery(document, {
            'export': path.join(__dirname, '../', '.tmp', uuid.v4() + '.pdf')
        });

        api.convert(convertQuery)
            .then(function (result) {

                expect(result).property('success').is.true;
                expect(result).property('file_name').equals(convertQuery.export);

                done(null, result);
            })
            .catch(function (err) {
                done(err);
            });
    });
});