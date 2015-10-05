"use strict";

/**
 * @Method("testApi");
 * @HTTP("POST");
 * @Route("/test");
 * @Query({
 *  "page": { "required": true, "type": "number" }
 * });
 * @Body({
 *  "name": { "required": true, "type": "string", "rules": { "minLength": 5, "maxLength": 25 }},
 *  "email": { "required": true, "type": "string", "rules": { "minLength": 5 }},
 *  "password": { "required": true, "type": "string", "rules": { "minLength": 8 }},
 *  "token": { "required": true, "type": "string", "rules": { "equals": "handshake" }}
 * });
 *
 * @param req
 * @param res
 */
module.exports.testApi = function(req, res) {
    res.send('If you see this messages, then the request payload is valid.');
};
