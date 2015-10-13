# Documentation

### Node.js routing using annotations

This module allows you, to define your routes with annotations instead of using nested callbacks and exports.
It also provides a validator, to automatically validate incoming requests. 
You can use it with express framework. Otherwise you can use the custom (flat and fast) built-in web server.

## Annotations
[See all annotations](/doc/annotations.md)  
[Define constraints on payload](/doc/constraints.md)

## Create a Route
[Read more](/doc/usage.md)

## Configuration
Define your api prefix in [`APIGenerator`](/src/generator.js#L1).  
You can also define the name of our annotations in [`AnnotationTranslator`](/src/translator.js#L1).

You need to run `npm install`, before you are able to use this module.

Read the [Changelog](/doc/changelog.md).

#### Example
Can be found [here](/test/sample.js)
