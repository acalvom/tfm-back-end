const jwt = require('jsonwebtoken');
const fs = require('fs');
const MINUTES = 10;
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

function getTokenPayload() {
    if (this.isValidToken()) {
        console.log(payload.email + ": " + payload.role);
        return payload;
    }
}

exports.getTokenPayload = getTokenPayload;
