var API = require('email-address-validation');
var api = new API({
    access_key: 'access_key',
    secret_key: 'secret_key'
});

var document_url = 'https://en.wikipedia.org/wiki/Special:Random';
var convertQuery = new api.ConvertQuery(document_url);

api.convert(convertQuery, function (err, result) {
    if (err) {
        return console.log('Convert Callback (Error): ' + JSON.stringify(err));
    }
    console.log('Convert Callback (Success)');
});