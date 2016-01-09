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
 * @param next if you are using express framework
 */
module.exports.testApi = function(req, res, next) {
    res.send('If you see this messages, then the request payload is valid.');
};

/**
 * @Method("testGet");
 * @HTTP("GET");
 * @Route("/test");
 * @Query({
 *  "test": { "required": true, "type": "number" },
 *  "number": { "required": true, "rules": { "equals": "100" }}
 * });
 *
 * @param req
 * @param res
 */
module.exports.testGet = function(req, res) {
    res.send('ok');
};

/**
 * @Method("testErrorHandler");
 * @CustomErrorHandler();
 * @HTTP("GET");
 * @Route("/err");
 * @Query({
 *  "dont-pass-this-parameter": { "required": true }
 * });
 *
 * @param req
 * @param res
 * @param errors
 */
module.exports.testErrorHandler = function(req, res, errors) {
    if (errors instanceof Array && errors.length > 0) {
        res.send('Something went wrong. We need the parameter ;=)');
        return;
    }

    res.send('no errors happen, everything ok');
};
