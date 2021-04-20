const CryptoJS = require("crypto-js");

function userLogin(req, res) {
    let userEmail = req.body.email;
    let passwordEncrypted = req.body.password;
    console.log('Email: ' + userEmail + ' Password: ' + passwordEncrypted);
    let password = CryptoJS.AES.decrypt(passwordEncrypted, 'password').toString(CryptoJS.enc.Utf8);
}

exports.userLogin = userLogin;
