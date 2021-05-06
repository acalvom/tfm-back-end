const connection = require('../database/database');
const httpCode = require('../resources/httpCodes');
const bcrypt = require("bcrypt");
let sql;

const usersController = {};

const saltRounds = 10;

usersController.getAllUsers = (req, res) => {
    sql = 'SELECT * FROM users';
    connection.query(sql, function (err, users) {
        if (!err && users.length > 0) {
            res.status(httpCode.codes.OK).json(users);
        } else
            res.status(httpCode.codes.NOTFOUND).json('Users not found');
    });
}

usersController.getAllStudents = (req, res) => {
    sql = 'SELECT * FROM users WHERE role = ?';
    connection.query(sql, ['student'], function (err, students) {
        if (!err && students.length > 0) {
            res.status(httpCode.codes.OK).json(students);
        } else
            res.status(httpCode.codes.NOTFOUND).json('Students not found');
    });
}

usersController.getUserByEmail = (req, res) => {
    let email = req.params.email;
    sql = 'SELECT * FROM users WHERE email = ?';
    connection.query(sql, [email], function (err, user) {
        if (!err && user.length === 1)
            res.status(httpCode.codes.OK).json(user);
        else
            res.status(httpCode.codes.NOTFOUND).json(['User ' + email + ' is not found']);
    });
}

usersController.deleteUser = (req, res) => {
    let email = req.params.email;
    sql = 'DELETE FROM users WHERE email = ?';
    connection.query(sql, [email], function (err, result) {
        if (!err && result.affectedRows > 0)
            res.status(httpCode.codes.NOCONTENT).json(['User ' + email + ' deleted successfully']);
        else
            res.status(httpCode.codes.NOTFOUND).json(['User ' + email + ' is not found']);
    });
}

usersController.editUser = (req, res) => {
    let email = req.params.email;
    let user = req.body;
    sql = 'UPDATE users SET ? WHERE email = ?';
    connection.query(sql, [user, email], function (err, result) {
        if (!err && result.affectedRows > 0)
            res.status(httpCode.codes.NOCONTENT).json(['User updated successfully']);
        else
            res.status(httpCode.codes.NOTFOUND).json(['User ' + email + ' is not found']);
    });
}


usersController.changePassword = (req, res) => {
    let email = req.body['userEmail']
    let passwords = req.body['passwords'];
    if (Object.keys(req.body).length === 0)
        res.status(httpCode.codes.NOCONTENT).json('No passwords provided');
    else {
        sql = 'SELECT password FROM users WHERE email = ?';
        connection.query(sql, [email], function (err, password) {
            if (!err && password.length > 0) {
                if (bcrypt.compareSync(passwords['oldPassword'], password[0].password)) {
                    sql = 'UPDATE users SET password = ? WHERE email = ?';
                    let newPasswordEncrypted = bcrypt.hashSync(passwords['newPassword'], saltRounds);
                    connection.query(sql, [newPasswordEncrypted, email], function (err, result) {
                        if (!err && result.affectedRows > 0)
                            res.status(httpCode.codes.OK).json(['Password changed successfully']);
                    });
                } else
                    res.status(httpCode.codes.BADREQUEST).json('Wrong current password');
            } else
                res.status(httpCode.codes.NOTFOUND).json('User not found');
        });
    }
}

usersController.addPhone = (req, res) => {
    let email = req.body.userEmail;
    let phone = req.body.phone;
    sql = 'UPDATE users SET phone = ? WHERE email = ?';
    connection.query(sql, [phone, email], function (err, result) {
        if (!err && result.affectedRows > 0)
            res.status(httpCode.codes.NOCONTENT).json(['Phone added successfully']);
        else
            res.status(httpCode.codes.NOTFOUND).json(['User ' + email + ' is not found']);
    });
}

module.exports = usersController;

