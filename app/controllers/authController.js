const CryptoJS = require("crypto-js");
const bcrypt = require('bcrypt');
const connection = require('../database/database');
const middleware = require('../middleware/middleware');
const httpCode = require('../resources/httpCodes');
const SALT_ROUNDS = require('../resources/constants').SALT_ROUNDS;

const authController = {}

let token, sql;
let newUser;

authController.register = (req, res) => {
    let user = req.body;
    if (Object.keys(user).length === 0)
        res.status(httpCode.codes.BADREQUEST).json('Body is empty');
    else {
        newUser = encryptDBPassword(user);
        sql = 'INSERT INTO users SET ?';
        connection.query(sql, [newUser], function (err) {
            if (!err)
                res.status(httpCode.codes.CREATED).json(newUser);
            else
                res.status(httpCode.codes.CONFLICT).json('User already exists');
        });
    }
}

authController.login = (req, res) => {
    let email = req.body.email;
    let password = CryptoJS.AES.decrypt(req.body.password, 'password').toString(CryptoJS.enc.Utf8);
    if (email && password) {
        sql = 'SELECT * FROM users WHERE email = ?';
        connection.query(sql, [email], function (err, user) {
            if (!err && user.length > 0) {
                if (bcrypt.compareSync(password, user[0].password)) {
                    let role = user[0].role;
                    token = middleware.generateToken(email, role);
                    setToken(role, res);
                } else
                    res.status(httpCode.codes.UNAUTHORIZED).json('Wrong password');
            } else
                res.status(httpCode.codes.NOTFOUND).json('User not found');
        });
    } else
        res.status(httpCode.codes.BADREQUEST).json('Email or password not set');
}

function setToken(role, res) {
    res.set("Access-Control-Expose-Headers", ["Authorization", "Role"]);
    res.set("Authorization", "Bearer " + token);
    res.set("Role", role);
    res.json("Bearer " + token);
}

function encryptDBPassword(user) {
    let decryptedBodyPassword = CryptoJS.AES.decrypt(user.password, 'password').toString(CryptoJS.enc.Utf8);
    user.password = bcrypt.hashSync(decryptedBodyPassword, SALT_ROUNDS);
    return user;
}

module.exports = authController;
