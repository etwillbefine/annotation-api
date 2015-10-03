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

## Create a Route
1. Create a new file, where you want  
2. Define a method and export it by using `module.exports`  
3. Tag the method with our annotations

[See all Annotations](annotations.md)
