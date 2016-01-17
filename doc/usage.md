# Usage
This module uses the [`annotation`](https://www.npmjs.com/package/annotation) module.  

## Using this module
```js
var express = require('express');
var files = [ __dirname + '/path/to/your/file' ];
var customerApi = [ __dirname + '/path/to/customer/api/file' ];

var annotationApi = require('annotation-api');
var generator = annotationApi(express(), files, optionalCallback);
generator.setApiPrefix('/api/customer');
generator.generate(customerApi, optionalCallback);
```

__Please note:__ When you are using the express-framework you must also install and activate express `body-parser`.

If you want to use our custom built in web server, you can use this:  
```js
var files = [ __dirname + '/path/too/your/file' ];
var annotationApi = require('annotation-api');

var generator = annotationApi(null, files, '/endpoint1');
generator.setApiPrefix('/endpoint2');
generator.generate(files, optionalCallback);
```

## Create a Route
1. Create a new file, where you want  
2. Define a method and export it by using `module.exports`  
3. Tag the method with our annotations
4. Pass your file locations to `require('annotation-api')()` or pass them to `generator.generate()`.

[See all Annotations](annotations.md)

#### Example & Tests
##### Tests
To run the tests, execute `npm test`.

Take a look into [`/sample/test.js`](/sample/test.js).  
Change the first parameter, passed to index.js to null, if you want to use our built in web server.
Our built in web server listen on port 3000, if you use express, you can use port 3400.  
[Example](/test/sample.js)

