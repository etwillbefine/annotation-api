# Usage
This module uses the [`annotation`](https://www.npmjs.com/package/annotation) module.  
You can use this module, if you are using express framework.

## Using this module
```js
var express = require('express');
var files = [ __dirname + '/path/to/your/file' ];

var annotationApi = require('annotation-api');
annotationApi(express(), files, optionalCallback);
```

If you want to use our custom built in web server, you should do this:  
```js
var files = [ __dirname + '/path/too/your/file' ];
var annotationApi = require('annotation-api');

annotationApi(null, files, optionalCallback);
```

## Create a Route
1. Create a new file, where you want  
2. Define a method and export it by using `module.exports`  
3. Tag the method with our annotations

[See all Annotations](annotations.md)

#### Use our tests
Take a look into [`/test/test.js`](/test/test.js). 
Change the first parameter, passed to index.js to null, if you want to use our built in web server.
Our built in web server listen on port 3000, if you use express, you can use port 3400.

