# Documentation
[![Build Status](https://travis-ci.org/etwillbefine/annotation-api.svg?branch=master)](https://travis-ci.org/etwillbefine/annotation-api)

### Node.js routing using annotations

This module allows you, to define your routes with annotations instead of using nested callbacks and exports.
It also provides a validator, to automatically validate incoming requests. 
You can use it with express framework. Otherwise you can use the custom (flat and fast) [built-in web server](/doc/builtinserver.md).

Read the [Changelog](/doc/changelog.md).

## Annotations
- [See all annotations](/doc/annotations.md)
- [Define constraints on payload](/doc/constraints.md)

## Create a Route
[Read more](/doc/usage.md)

## Configuration
By default we use a prefix foreach route. You can change the prefix, using `generator.setApiPrefix('')`.  
You have to run `npm install`, before you are able to use this module.

#### Example
Can be found [here](/test/sample.js)

#### Tests
Before running the tests, execute `npm install --save-dev`  
Execute the tests, using `npm test`.