const jwt = require('jsonwebtoken');
const fs = require('fs');

function createToken(userEmail, role) {
    let key = fs.readFileSync('./app/jwt/private.key', "utf-8");
    let expiryTime = 60 * 10;
    return jwt.sign({"email": userEmail, "role": role}, key, {expiresIn: expiryTime});
}

exports.createToken = createToken;
