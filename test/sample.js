"use strict";

/**
 * @Method("testApi");
 * @HTTP("GET");
 * @Route("/test");
 * @Payload({
 *  "name": { "required": true, "type": "string", "rules": { "minLength": 5, "maxLength": 25 }},
 *  "email": { "required": true, "type": "string", "rules": { "minLength": 5 }},
 *  "password": { "required": true, "type": "string", "rules": { "minLength": 8 }}
 * });
 *
 * @param req
 * @param res
 */
module.exports.testApi = function(req, res) {
    res.end('If you see this messages, then the request payload is valid.');
};
