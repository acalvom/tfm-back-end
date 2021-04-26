const CryptoJS = require("crypto-js");
const bcrypt = require('bcrypt');
const connection = require('../database/database');
const middleware = require('../middleware/middleware');
const httpCode = require('../resources/httpCodes');
const User = require('../models/User');

var token, sql, email;
var newUser;
const saltRounds = 10;

function register(req, res) {
    let user = req.body;
    if (user) {
        newUser = createUser(user)
        console.log(newUser);
        const comparison = bcrypt.compareSync('a', newUser.password)
        console.log(comparison);
        sql = 'INSERT INTO users (name, surname, dni, gender, email, password, penalties, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        connection.query(sql, [newUser.name, newUser.surname, newUser.dni, newUser.gender, newUser.email, newUser.password, newUser.penalties, newUser.role], function (err, result) {
            if (!err) {
                console.log('Insert successful' + result)
                res.json('USER INSERTED SUCCESSFULLY');
            } else {
                console.log('Insert error' + err)
                res.status(httpCode.codes.CONFLICT).json('USER ALREADY EXISTS');
            }
        })
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
    let encryptedPassword = bcrypt.hashSync(decryptBodyPassword(user.password), saltRounds);
    newUser.password(encryptedPassword);
    return newUser.build();
}

function decryptBodyPassword(passwordEncrypted) {
    return CryptoJS.AES.decrypt(passwordEncrypted, 'password').toString(CryptoJS.enc.Utf8);
}

function login(req, res) {
    email = req.body.email;
    let password = decryptBodyPassword(req.body.password);
    if (email && password) {
        // superuser: $2b$10$AVmvFV1pFySG7toYpJ6Lau2vXabZsxPBdWjkmVvZ/kJ8735zCGl72
        // teacher: $2b$10$GhW2v/v3xXiPZ9T4gs4wq.FOZ7KmB39wCibjc4E.Tn255qeiIkCx.
        // student: $2b$10$AdqKmH8DM4/rFoAc5suQJeaziM1gEZzCm6v8g8rVSbK9oVanhimaq
        // sql = 'SELECT * FROM users WHERE email = ? and password = ?';
        sql = 'SELECT * FROM users WHERE email = ?';
        // connection.query(sql, [email, password], function (err, result) {
        connection.query(sql, [email], function (err, result) {
            if (!err && result.length == 1) {
                let isCorrectPassword = bcrypt.compareSync(password, result[0].password);
                if (isCorrectPassword) {
                    let role = result[0].role;
                    token = middleware.generateToken(email, role);
                    saveToken(role, res);
                } else {
                    console.log('WRONG PASSWORD');
                    res.status(httpCode.codes.BADREQUEST).json('WRONG PASSWORD');
                }
            } else {
                res.status(httpCode.codes.NOTFOUND).json('USER NOT FOUND');
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
