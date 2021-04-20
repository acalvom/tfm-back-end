const jwt = require('jsonwebtoken');
const fs = require('fs');
const MINUTES = 10;
const SECONDS_PER_MINUTE = 60;

function readKey() {
    return fs.readFileSync('./app/jwt/private.key', "utf-8");
}

function generateToken(email, role) {
    let payload = {
        "email": email,
        "role": role
    };
    let expiryTime = SECONDS_PER_MINUTE * MINUTES;
    return jwt.sign(payload, readKey(), {expiresIn: expiryTime});
}

exports.generateToken = generateToken;

function validateToken(req) {
    let token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
        try {
            let payload = jwt.verify(token, readKey());
            if (payload.email) {
                console.log(payload.email + ": " + payload.role);
                return true
            }
        } catch (err) {
            console.log("Non authorized access");
            return false;
        }
    } else {
        console.log("No token");
        return false;
    }
}

exports.validateToken = validateToken;
