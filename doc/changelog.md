# Changelog

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
