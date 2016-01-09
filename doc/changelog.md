# Changelog

#### V.0.1.4
New:
Tonic example file (npm)
Jasmine for unit testing
Api-Prefix as 3rd parameter

Fixes:
Fix RegExp validation
Object and Array type validation

#### V.0.1.3
New:  
Responsibility to get errors if something went wrong. This allows you to return a customized error response.  
New Annotation `CustomErrorHandler`  
Updated README and usage documentation  
Removed log when starting our generator  
Make type definition for parameters optional 

Fixes:  
RegExp-Constraint comparing required regexp with constraint's value 

#### V.0.1.2
New:  
`APIGenerator` allows you, to change the api prefix at the runtime.  
Documentation about test.js

Fixes:  
`minLength` requires string length >= (instead of >)  
Wording in documentation

#### V.0.1.1
New:  
`APIGenerator` accessible as return type from `require('annotation-api')(..);`

#### V.0.1.0 
First "stable", complete release

#### V.0.0.6
New:  
Built-In HTTP-Server (allows usage without express)

Fixes:  
If no payload is required, parser does not reject the request.
