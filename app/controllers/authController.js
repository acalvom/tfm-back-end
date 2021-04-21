const CryptoJS = require("crypto-js");
const connection = require('../database/database');
const middleware = require('../middleware/middleware');
const httpCode = require('../resources/httpCodes');
var token, sql, email;

function login(req, res) {
    email = req.body.email;
    let passwordEncrypted = req.body.password;
    // console.log('Email: ' + email + ' Password: ' + passwordEncrypted);
    if (email && passwordEncrypted) {
        let password = CryptoJS.AES.decrypt(passwordEncrypted, 'password').toString(CryptoJS.enc.Utf8);
        sql = "SELECT id, name, surname, dni, gender, email, password, salt, penalties, role FROM `users` WHERE `email`='" + email + "' and password = '" + password + "'";
        connection.query(sql, function (err, result) {
            if (!err && result.length == 1) {
                let role = result[0].role;
                token = middleware.generateToken(email, role);
                // console.log('Token: ' + token);
                saveToken(role, res);
            } else {
                res.status(httpCode.codes.NOTFOUND).json('NOT FOUND');
                //console.log('Status ' + httpCode.codes.NOTFOUND);
            }
        });

    }
}

exports.login = login;

function saveToken(role, res) {
    sql = "UPDATE users SET token = '" + token + "' WHERE (email = '" + email + "')";
    connection.query(sql, function (err) {
        if (!err) {
            res.set("Access-Control-Expose-Headers", ["Authorization", "Role"]);
            res.set("Authorization", "Bearer " + token);
            res.set("Role", role);
            res.json("Bearer " + token + "Role " + role);
        }
    });

}

// This is only to validate token verification
function validToken(req) {
    return middleware.isValidToken(req);
}

exports.validToken = validToken;
