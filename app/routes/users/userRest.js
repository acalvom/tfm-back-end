function userLogin(req, res) {
    'use strict';
    let userEmail = req.query.email;
    let password = req.query.password;
    console.log('Email: ' + userEmail + ' Password: ' + password);
}

exports.userLogin = userLogin;
