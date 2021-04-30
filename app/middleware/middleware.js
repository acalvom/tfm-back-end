const jwt = require('jsonwebtoken');
const fs = require('fs');
const MINUTES = 100;
const SECONDS_PER_MINUTE = 60;
const NO_TOKEN = 'Undefined email or password'
const httpCode = require('../resources/httpCodes');

const middleware = {}

function readKey() {
    return fs.readFileSync('./app/middleware/private.key', "utf-8");
}

middleware.generateToken = (email, role) => {
    let newPayload = {
        "email": email,
        "role": role
    };
    let expiryTime = SECONDS_PER_MINUTE * MINUTES;
    return newPayload.email == null ? NO_TOKEN : jwt.sign(newPayload, readKey(), {expiresIn: expiryTime})
}

function tokenProvided(req, res) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
        return req.headers.authorization.split(' ')[1];
    else
        res.status(httpCode.codes.NOCONTENT).json('No token provided');
}

middleware.isAdmin = (req, res, next) => {
    let token = tokenProvided(req, res);
    if (token) {
        jwt.verify(token, readKey(), (err, decoded) => {
            if (!err && decoded.role === 'admin') {
                req.decoded = decoded;
                next();
            } else
                res.status(httpCode.codes.UNAUTHORIZED).json('You are not an admin');
        });
    }
}

middleware.isTeacher = (req, res, next) => {
    let token = tokenProvided(req, res);
    if (token) {
        jwt.verify(token, readKey(), (err, decoded) => {
            if (!err && decoded.role === 'teacher') {
                req.decoded = decoded;
                next();
            } else
                res.status(httpCode.codes.UNAUTHORIZED).json('You are not a teacher');
        });
    }
}

module.exports = middleware;
