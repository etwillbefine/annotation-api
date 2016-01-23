"use strict";

/**
 * POST http://localhost:[3400|3000]/api/test?page=1
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
 * GET http://localhost:[3400|3000]/api/test?test=2&number=100
 * @Method("testGet");
 * @HTTP("GET");
 * @Route("/test");
 * @Query({
 *  "test": { "required": true, "type": "number", "rules": { "min": 1, "max": 10 }},
 *  "number": { "required": true, "rules": { "equals": 100 }}
 * });
 *
 * @param req
 * @param res
 */
module.exports.testGet = function(req, res) {
    res.send('ok');
};

/**
 * GET http://localhost:[3400|3000]/api/not-in?param=blacklisted
 * @Method("testNotInFilter");
 * @Route("/not-in");
 * @Query({
 *  "param": { "rules": { "notIn": [ "blacklisted" ] }}
 * });
 *
 * @param req
 * @param res
 */
module.exports.testNotInFilter = function(req, res) {
    res.end('?param does not contains blacklisted words');
};

/**
 * GET http://localhost:[3400|3000]/api/err
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

/**
 * GET http://localhost:[3400|3000]/api/valid-auth
 * @Method("testValidAuth");
 * @Route("/valid-auth");
 * @Security("is_authenticated");
 *
 * @param req
 * @param res
 */
module.exports.testValidAuth = function(req, res) {
    var session = req.api.session;
    res.end('Hey ' + session.name);
};

/**
 * GET http://localhost:[3400|3000]/api/invalid-auth
 * @Method("testInvalidAuth");
 * @Route("/invalid-auth");
 * @CustomErrorHandler();
 * @Security("is_fully_authenticated");
 *
 * @param req
 * @param res
 * @param next
 * @param err
 */
module.exports.testInvalidAuth = function(req, res, next, err) {
    if (err) {
        res.end('Not fully authenticated. Its correct :)');
        return;
    }

    res.end('Fully authenticated. Something went wrong.');
};

/**
 * GET http://localhost:[3400|3000]/api/invalid-session
 * authenticator is optional!
 *
 * @Method("testNonExistingSession");
 * @Route("/invalid-session");
 * @Security({ "method": "session_exists", "session": "my_session", "authenticator": "is_fully_authenticated" });
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.testNonExistingSession = function(req, res, next) {};

/**
 * @Method("testRedirect");
 * @Route("/redirect");
 * @Security("is_fully_authenticated");
 * @RedirectErrorHandler("/redirect/%code%");
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.testRedirect = function(req, res, next) {};
