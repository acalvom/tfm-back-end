function userLogin(req, res) {
    let userEmail = req.body.email;
    let password = req.body.password;
    console.log('Email: ' + userEmail + ' Password: ' + password);
}

exports.userLogin = userLogin;
