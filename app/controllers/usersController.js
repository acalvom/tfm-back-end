const connection = require('../database/database');
const httpCode = require('../resources/httpCodes');
let sql;

const usersController = {};

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

module.exports = usersController;

