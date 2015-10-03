# Annotations

You must tag your routes with `@Method("alias");`

`@HTTP("GET");`:  
GET, PUT, POST, ... (you are also able to write it in lower case)

`@Route("/route");`:  
Define the URI, without the api prefix and an starting `/`.

`@Payload({ ... });`:  
Accepts a json object, to define the validation rules.  
Take a look to our [example](/test/sample.js)

`@Security("");`:  
Coming soon

__Note:__ `;` is required after each annotation.  
You can also define your custom annotations or doc blocks.
