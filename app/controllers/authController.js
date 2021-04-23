const CryptoJS = require("crypto-js");
const bcrypt = require('bcrypt');
const connection = require('../database/database');
const middleware = require('../middleware/middleware');
const httpCode = require('../resources/httpCodes');
const User = require('../models/User');

var token, sql, email;
var user;
const saltRounds = 10;

function register(req, res) {
    // TODO
    user = req.body;
    if (user) {
        let newUser = createUser(user)
        console.log(newUser);
        const comparison = bcrypt.compareSync('a', newUser.password)
        console.log(comparison);
    }
}

exports.register = register;

function createUser(user) {
    let newUser = new User();
    newUser.name(user.name);
    newUser.surname(user.surname);
    newUser.dni(user.dni);
    newUser.gender(user.gender);
    newUser.role(user.role);
    newUser.penalties(user.penalties);
    newUser.email(user.email);
    let encryptedPassword = bcrypt.hashSync(decryptPassword(user.password), saltRounds);
    newUser.password(encryptedPassword);
    return newUser.build();
}

function decryptPassword(passwordEncrypted) {
    return CryptoJS.AES.decrypt(passwordEncrypted, 'password').toString(CryptoJS.enc.Utf8);
}

function login(req, res) {
    email = req.body.email;
    let passwordEncrypted = req.body.password;
    if (email && passwordEncrypted) {
        let password = decryptPassword(passwordEncrypted);
        sql = 'SELECT * FROM users WHERE email = ? and password = ?';
        connection.query(sql, [email, password], function (err, result) {
            if (!err && result.length == 1) {
                let role = result[0].role;
                token = middleware.generateToken(email, role);
                saveToken(role, res);
            } else {
                res.status(httpCode.codes.NOTFOUND).json('NOT FOUND');
            }
        });

    } else {
        res.status(httpCode.codes.NOCONTENT).json('NO CONTENT');
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
