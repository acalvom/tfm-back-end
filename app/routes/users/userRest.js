const CryptoJS = require("crypto-js");
const connection = require('../../database/database');
const DB_ERROR = "Database Server Error";

function userLogin(req, res) {
    let userEmail = req.body.email;
    let passwordEncrypted = req.body.password;
    console.log('Email: ' + userEmail + ' Password: ' + passwordEncrypted);
    if (userEmail && passwordEncrypted) {
        let password = CryptoJS.AES.decrypt(passwordEncrypted, 'password').toString(CryptoJS.enc.Utf8);
        let sql = "SELECT id, name, surname, dni, gender, email, password, salt, penalties, role FROM `users` WHERE `email`='" + userEmail + "' and password = '" + password + "'";
        connection.query(sql, function (err, rows) {
            if (err) {
                res.json(DB_ERROR);
                console.log(err);
            } else {
                res.json(rows);
                console.log(rows);
            }
        });
    }
}

exports.userLogin = userLogin;
