const CryptoJS = require("crypto-js");
const connection = require('../../database/database');
const jwt = require('../../jwt/jwtManager');
const DB_ERROR = "Database Server Error";
var token, sql;

function userLogin(req, res) {
    let userEmail = req.body.email;
    let passwordEncrypted = req.body.password;
    console.log('Email: ' + userEmail + ' Password: ' + passwordEncrypted);
    if (userEmail && passwordEncrypted) {
        let password = CryptoJS.AES.decrypt(passwordEncrypted, 'password').toString(CryptoJS.enc.Utf8);
        sql = "SELECT id, name, surname, dni, gender, email, password, salt, penalties, role FROM `users` WHERE `email`='" + userEmail + "' and password = '" + password + "'";
        connection.query(sql, function (err, result) {
            if (!err && result.length == 1) {
                token = jwt.generateToken(userEmail, result[0].role);
                console.log('Token: ' + token);
                sql = "UPDATE users SET token = '" + token + "' WHERE (email = '" + userEmail + "')";
                connection.query(sql, function (err) {
                    if (!err) {
                        res.set("Access-Control-Expose-Headers", ["Authorization", "Role"]);
                        res.set("Authorization", "Bearer " + token);
                        res.set("Role", result[0].role);
                        res.json("Bearer " + token + "Role " + result[0].role);
                    }
                });
            } else {
                res.json(DB_ERROR);
                console.log(err);
                connection.closeConnection();
            }
        });
    }
}

exports.userLogin = userLogin;

// This is only to validate token verification
function validToken(req) {
    jwt.validateToken(req);
}

exports.validToken = validToken;
