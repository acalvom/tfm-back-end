const jwt = require('jsonwebtoken');
// const fs = require('fs');

const httpCode = require('../resources/httpCodes');
const PARAMETERS = require('../resources/constants');
const middleware = {}

function readKey() {
    return process.env.PRIVATE_KEY;
}

middleware.generateToken = (email, role) => {
    let newPayload = {
        "email": email,
        "role": role
    };
    let expiryTime = PARAMETERS.SECONDS_PER_MINUTE * PARAMETERS.MINUTES;
    return newPayload.email == null ? PARAMETERS.NO_TOKEN_GENERATED : jwt.sign(newPayload, readKey(), {expiresIn: expiryTime})
}

function tokenProvided(req, res) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
        return req.headers.authorization.split(' ')[1];
    else
        res.status(httpCode.codes.BADREQUEST).json('No token provided');
}

middleware.isAuthenticated = (req, res, next) => {
    let token = tokenProvided(req, res);
    if (token) {
        jwt.verify(token, readKey(), (err, decoded) => {
            if (!err) {
                req.decoded = decoded;
                next();
            } else
                res.status(httpCode.codes.UNAUTHORIZED).json('You are not logged');
        });
    }
}

middleware.isAdmin = (req, res, next) => {
    let token = tokenProvided(req, res);
    if (token) {
        jwt.verify(token, readKey(), (err, decoded) => {
            if (!err && decoded.role === 'admin') {
                req.decoded = decoded;
                next();
            } else
                res.status(httpCode.codes.FORBIDDEN).json('You are not an admin');
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
                res.status(httpCode.codes.FORBIDDEN).json('You are not a teacher');
        });
    }
}

middleware.isStudent = (req, res, next) => {
    let token = tokenProvided(req, res);
    if (token) {
        jwt.verify(token, readKey(), (err, decoded) => {
            if (!err && decoded.role === 'student') {
                req.decoded = decoded;
                next();
            } else
                res.status(httpCode.codes.FORBIDDEN).json('You are not a student');
        });
    }
}

middleware.isAdminOrTeacher = (req, res, next) => {
    let token = tokenProvided(req, res);
    if (token) {
        jwt.verify(token, readKey(), (err, decoded) => {
            if (!err && (decoded.role === 'teacher' || decoded.role === 'admin')) {
                req.decoded = decoded;
                next();
            } else
                res.status(httpCode.codes.FORBIDDEN).json('You are not an admin or teacher');
        });
    }
}

module.exports = middleware;
