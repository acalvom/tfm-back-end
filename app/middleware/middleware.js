const jwt = require('jsonwebtoken');
const fs = require('fs');
const MINUTES = 100;
const SECONDS_PER_MINUTE = 60;
const NO_TOKEN = 'Undefined email or password'
let payload;
const httpCode = require('../resources/httpCodes');

function readKey() {
    return fs.readFileSync('./app/middleware/private.key', "utf-8");
}

function generateToken(email, role) {
    let newPayload = {
        "email": email,
        "role": role
    };
    let expiryTime = SECONDS_PER_MINUTE * MINUTES;
    return newPayload.email == null ? NO_TOKEN : jwt.sign(newPayload, readKey(), {expiresIn: expiryTime})
}

exports.generateToken = generateToken;

function isValidToken(req) {
    let token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
        try {
            payload = jwt.verify(token, readKey());
            if (payload.email) {
                return true;
            }
        } catch (err) {
            console.log(httpCode.codes.UNAUTHORIZED + " - Unauthorized access");
            return false;
        }
    } else {
        console.log(httpCode.codes.NOCONTENT + " - No token provided");
        return false;
    }
}

exports.isValidToken = isValidToken;

function getTokenPayload(req) {
    if (this.isValidToken(req)) {
        return payload;
    }
}

exports.getTokenPayload = getTokenPayload;

function tokenProvided(req, res) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
        return req.headers.authorization.split(' ')[1];
    else
        res.status(httpCode.codes.NOCONTENT).json('No token provided');
}

function isAdmin(req, res, next) {
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

exports.isAdmin = isAdmin;
