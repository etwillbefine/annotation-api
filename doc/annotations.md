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

`@CustomErrorHandler();`:  
If you add this annotation to your route definition, you will get a list of errors as the third parameter from your callback. 
In this case our controller will not reject the request. Feel free to send a customized response.

`@Security("");`:  
Coming soon

__Note:__ `;` is required after each annotation.  
You can also define your custom annotations or doc blocks.
