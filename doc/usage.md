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

If you want to use our custom built in web server, you can use this:  
```js
var files = [ __dirname + '/path/too/your/file' ];
var annotationApi = require('annotation-api');

var generator = annotationApi();
generator.setApiPrefix('/my-api');
generator.generate(files, optionalCallback);
```

## Create a Route
1. Create a new file, where you want  
2. Define a method and export it by using `module.exports`  
3. Tag the method with our annotations
4. Pass your file locations to `require('annotation-api')()` or pass them to `generator.generate()`.

[See all Annotations](annotations.md)

#### Example
Take a look into [`/test/test.js`](/test/test.js).  
Change the first parameter, passed to index.js to null, if you want to use our built in web server.
Our built in web server listen on port 3000, if you use express, you can use port 3400.  
[Example](/test/sample.js)

