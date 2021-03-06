const httpCode = require("../resources/httpCodes");
const connection = require('../database/database');
const reservesController = {};

let sql;

reservesController.createReserve = (req, res) => {
    let reserve = req.body;
    if (Object.keys(reserve).length === 0)
        res.status(httpCode.codes.BADREQUEST).json('No reserve sent');
    else {
        sql = 'INSERT INTO reserves SET ?';
        connection.query(sql, [reserve], function (err, resultDB) {
            if (!err) {
                reserve.id = resultDB.insertId;
                res.status(httpCode.codes.CREATED).json(reserve);
            } else
                res.status(httpCode.codes.CONFLICT).json('This reserve already exists: ' + err.sqlMessage);
        });
    }
}

reservesController.deleteReserve = (req, res) => {
    let id = req.params.id;
    sql = 'DELETE FROM reserves WHERE id = ?';
    connection.query(sql, [id], function (err, result) {
        if (!err && result.affectedRows > 0)
            res.status(httpCode.codes.NOCONTENT).json(['Reserve ' + id + ' deleted successfully']);
        else
            res.status(httpCode.codes.NOTFOUND).json(['Reserve ' + id + ' is not found']);
    });
}

reservesController.getReservesByUserEmail = (req, res) => {
    let email = req.params.email;
    sql = 'SELECT * FROM reserves WHERE email_user = ?';
    connection.query(sql, [email], function (err, reserves) {
        if (!err && reserves.length > 0)
            res.status(httpCode.codes.OK).json(reserves);
        else
            res.status(httpCode.codes.NOTFOUND).json(['Reserves for ' + email + ' not found']);
    });
}

reservesController.getReservesByCodeClass = (req, res) => {
    let code = req.params.code;
    sql = 'SELECT * FROM reserves WHERE code_class = ?';
    connection.query(sql, [code], function (err, reserves) {
        if (!err && reserves.length > 0)
            res.status(httpCode.codes.OK).json(reserves);
        else
            res.status(httpCode.codes.NOTFOUND).json(['Reserves for ' + code + ' not found']);
    });
}

module.exports = reservesController;

