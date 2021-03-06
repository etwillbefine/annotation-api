# Annotations

You must tag your routes with `@Method("alias");`.   
Use the method name as alias.

`@HTTP("GET");`:  
GET, PUT, POST, ... (you are also able to write it in lower case)

`@Route("/route");`:  
Define the URI, without the api prefix and an starting `/`.  
You are able to define your routes likewise when you define routes with express (if you are using express framework).

`@Query({ ... });`:  
Define the required query parameters (`?p=something`)  
Accepts a json object, to define the validation rules.  
Take a look to our [example](/test/sample.js)

`@Body({ ... });`:  
Define the required post parameters.  
Accepts a json object, to define the validation rules.  
Take a look to our [example](/test/sample.js)

`@Append("MyClass.class");`:  
Append properties from an custom object:  
Add custom class or object:
```
api.addReference(myObject, 'MyClass');
```
For further information [read here](/src/annotation-api.js#L109)

`@CustomErrorHandler();`:  
When using this annotation, you will get a list of errors as the third parameter from your callback. 
In this case, our controller will not reject the request. Feel free to send a customized response.

`@RedirectErrorHandler("/goto/%code%/%message%");`:  
If you want to redirect in the case of an error, you can add this annotation. 
It is possible to redirect to a route which contains the error code or message.
This is very useful, when you want to throw a customized authentication error:
```js
generator.addSecurityMethod('my_authenticator', function(request, callback) {
    callback({ code: 401, message: 'unauthorized' });
    
    // otherwise (redirect-handler has a higher priority):
    callback(null, null, '/goto');
});

/**
 * @RedirectErrorHandler("/login&err=%message%");
 * @Security("my_authenticator");
 */
module.exports = function(req, res, next) {};
```

`@Security("authenticated_method");`:  
You can use the security annotation, to check if the user has a valid session. To check whether a session is valid or not,
you can push a `SessionStorageInterface` to the generator. Otherwise you can define an own authenticated method. 

Example:
```js
/**
 * ....
 * @Security("my_method");
 * @CustomErrorHandler(); (you can use it without custom error)
 */
module.exports.auth = function(req, res, next, err) {};
 
generator.addSecurityMethod('my_method', function (request, callback) {
    // ...
    callback(error, session);
});

// or:
generator.setSessionStorage(storageInterface);
```

A `storageInterface` must provide a `.get` method. If this method contains 2 arguments, we'll use it to fetch the session.
Otherwise if there is only one argument available, we'll try to execute the query as a promise or with `.exec`.

By default this module provides two authentication methods by default:
- `session_exists` requires: { method: "session_exists", "session": "session-name" }
- `session_contains` requires (rules and type are optional): 
```json
{ 
    "method": "session_contains", 
    "session": "session-name", 
    "properties": { 
        "id": { "type": "string", "rules": { "regexp": "regexp" }} 
    } 
}
```
Rules can be defined like rules on query or body payload.

You can add the `authenticator` property, when using these methods, to specify your custom authenticator.

As an alternative to a sessionStorage or the custom methods, you can use `express-session`.
We'll test whether the session exists on `request.session` (first check).

[complete example](/sample/sample.js#L117)

---
__Note:__ `;` is required after each annotation.  
You can also define your custom annotations or doc blocks.
---

#### Documentation
You can add the following annotations, to improve the auto generated documentation.
 
`@Response`:  
When using this annotation you can define the response send from your "controller".

Example:
```
@Security("is_authenticated");
@Response({ status: 401 });
@Response({ json: { success: true }, contentType: "application/json" });
@Response({ xml: { success: false }, contentType: "application/xml" });
...
```

