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

module.exports = usersController;

