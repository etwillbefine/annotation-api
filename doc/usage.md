# Usage

```js
var express = require('express');
var files = [ __dirname + '/path/to/your/file' ];
var customerApi = [ __dirname + '/path/to/customer/api/file' ];

var annotationApi = require('annotation-api');
var api = annotationApi(express(), files, optionalCallback);
api.setApiPrefix('/api/customer');
api.generate(customerApi, optionalCallback);
```

__Please note:__ When you are using the express-framework you must also install and activate express `body-parser`.

#### Relative paths or glob usage
You can pass a plain string to `annotationApi()` or `.generate`. 
In this case this module uses `glob` to fetch all files automatically.
```js
// ... express, body-parser, ...
var annotationApi = require('annotation-api');
var api = annotationApi(app, './routes/**/*.js', '/prefix', callback);
```

If you want to use our custom built in web server, you can use this:  
```js
var files = [ './relative/path/to/your/file' ];
var annotationApi = require('annotation-api');

var api = annotationApi(null, files, '/endpoint1');
api.getGenerator().setApiPrefix('/endpoint2');
api.generate(files, optionalCallback);
```

## Create a Route
1. Create a new file, where you want  
2. Define a method and export it by using `module.exports`  
3. Tag the method with our annotations
4. Pass your file locations to `require('annotation-api')()` or pass them to `generator.generate()`.

[See all Annotations](annotations.md)

#### Example
Take a look into [`/sample/test.js`](/sample/test.js).  
Change the first parameter, passed to index.js to null, if you want to use our built in web server.
Our built in web server listen on port 3000, if you use express, you can use port 3400.  
[Example](/sample/sample.js)
