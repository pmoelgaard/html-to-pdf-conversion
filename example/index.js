var path = require('path');

var APIPath = path.join(__dirname, '../', 'index');
var API = require(APIPath);

var api = new API({
    access_key: process.env.ACCESS_KEY,
    secret_key: process.env.SECRET_KEY
});

var document_url = 'https://en.wikipedia.org/wiki/Special:Random';
var convertQuery = new api.convert.ConvertQuery(document_url);

api.convert(convertQuery, function (err, result) {
    if (err) {
        return console.log('Convert Callback (Error): ' + JSON.stringify(err));
    }
    console.log('Convert Callback (Success)');
});