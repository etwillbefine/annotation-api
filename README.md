# Documentation
[![Build Status](https://travis-ci.org/etwillbefine/annotation-api.svg?branch=master)](https://travis-ci.org/etwillbefine/annotation-api)
[![Code Climate](https://codeclimate.com/github/etwillbefine/annotation-api/badges/gpa.svg?branch=master)](https://codeclimate.com/github/etwillbefine/annotation-api)
[![Test Coverage](https://codeclimate.com/github/etwillbefine/annotation-api/badges/coverage.svg)](https://codeclimate.com/github/etwillbefine/annotation-api/coverage)

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

```js
/**
 * es6 example
 * @Method("route");
 * @Route("/somewhere");
 * @HTTP("POST");
 * @Append("MyTransferObject.class");
 * @Query({ ... });
 * @Security("is_authenticated");
 * @RedirectErrorHandler("/err");
 */
module.exports.route = (req, res) => {
    res.end('validated');
};
```

## Installation
- Clone this repository
- Run `npm install`
- Run `npm start`

#### Example
Can be found [here](/sample/sample.js)

#### Doc-Builder
[Create a documentation via CLI](doc/doc-builder.md)

#### Tests
Execute the tests, using `npm test`.
