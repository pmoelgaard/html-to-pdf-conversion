
[![Travis](https://travis-ci.org/pmoelgaard/html-to-pdf-conversion.svg)](Travis)

Node JavaScript wrapper for [the pdflayer API](https://pdflayer.com/).

Supports both traditional callbacks and Promises/A+.

---

## Installation
	npm install html-to-pdf-conversion [--save]


## Configuration

Before using the pdflayer API client you have to setup your account and obtain your API Access Key.  
You can get it by signing up at [https://pdflayer.com/product](https://pdflayer.com/product).

---

## Usage

The general API is documented here: [https://pdflayer.com/documentation](https://pdflayer.com/documentation).  
You can find parameters, result set definitions and status codes documented here as well.


### Setup

	var API = require('html-to-pdf-conversion');
	var api = new API({
    	access_key: [ACCESS_KEY],
    	secret_key: [SECRET_KEY],
    	secure: [true|false] (Optional, defaults to false)
	});

#### Optional Parameters

##### Secure (only available for Basic, Pro and Enterprise accounts)
Boolean value to indicate if the calls to the API should use a secure protocol or insecure (HTTP/HTTPS). Defaults to false (HTTP, insecure).

---

## Callbacks vs. Promises

The Promises/A+ implementation used for this is this excellent bare bones library:  
[https://www.npmjs.com/package/promise](https://www.npmjs.com/package/promise)

The html-to-pdf-conversion library supports either mode and use of either one is not mutually exclusive to the alternative, so it's possible to use one exclusively or a combination, even in the same call, both the callback will be called and the promise handlers invoked.

---

## API Overview
All endpoints in the public API is available through this library.

- convert

---

## convert
Takes a URL and returns the captured image, optionally if the export or filename options are passed, will export and save the image respectively.

###### Define Query

	var convertQuery = {
    	document_url: 'https://en.wikipedia.org/wiki/Special:Random'
	};

###### Simple Request (using Callback)

	convert(convertQuery, function (err, result) {
    	if (err) {
        	return console.log('Convert Callback (Error): ' + JSON.stringify(err));
    	}
	    console.log('Convert Callback (Result)');
	});
    
###### Response
 

---

## Example Application

In the [rootdir]/example directory there is a fully functional application which runs all requests against all the endpoints in the API, the examples above can be seen there as source code.

The example application uses a process.env variable to hold the access key.

For running in development environments, it's easy to use the [https://www.npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv) to load variables from a local file into the environment.

---

## Tests

The tests are written for any NodeJS testing library, but has been run and targeted at the [https://mochajs.org/](https://mochajs.org/) testing library.

In order to run the tests, the following environment variables needs to be set:

```
ACCESS_KEY = [access_key]
SECRET_KEY = [secret_key]
```


---

## Customer Support

Need any assistance? [Get in touch with Customer Support](mailto:support@apilayer.net?subject=%pdflayer%5D).

---

## Updates
Stay up to date by following [@apilayernet](https://twitter.com/apilayernet) on Twitter.

---

## Legal

All usage of the languagelayer website, API, and services is subject to the [pdflayer Terms & Conditions](https://pdflayer.com/terms) and all annexed legal documents and agreements.

---

## Author
Peter Andreas Moelgaard ([GitHub](https://github.com/pmoelgaard), [Twitter](https://twitter.com/petermoelgaard))

---

## License
Licensed under the The MIT License (MIT)

Copyright (&copy;) 2016 Peter Andreas Moelgaard & apilayer

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.