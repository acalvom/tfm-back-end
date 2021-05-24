const httpCode = require("../resources/httpCodes");
const connection = require('../database/database');
const reservesController = {};

let sql;

reservesController.createReserve = (req, res) => {
    let reserve = req.body;
    if (Object.keys(reserve).length === 0)
        res.status(httpCode.codes.NOCONTENT).json('No reserve sent');
    else {
        sql = 'INSERT INTO reserves SET ?';
        // console.log(reserve)
        connection.query(sql, [reserve], function (err, resultDB) {
            if (!err) {
                reserve.id = resultDB.insertId;
                res.status(httpCode.codes.CREATED).json(reserve);
            } else
                res.status(httpCode.codes.CONFLICT).json('This reserve already exists: ' + err.sqlMessage);
        });
        reservesController.updatePlaces(1, reserve.code_class)
    }
}

reservesController.getReservesByUserEmail = (req, res) => {
    let email = req.params.email;
    sql = 'SELECT * FROM reserves WHERE email_user = ?';
    connection.query(sql, [email], function (err, reserves) {
        // console.log(reserves)
        if (!err && reserves.length > 0)
            res.status(httpCode.codes.OK).json(reserves);
        else
            res.status(httpCode.codes.NOTFOUND).json(['Reserves for ' + email + ' not found']);
    });
}

reservesController.deleteReserve = (req, res) => {
    let id = req.params.id;
    sql = 'DELETE FROM reserves WHERE id = ?';
    // console.log(id)
    connection.query(sql, [id], function (err, result) {
        if (!err && result.affectedRows > 0)
            res.status(httpCode.codes.NOCONTENT).json(['Reserve ' + id + ' deleted successfully']);
        else
            res.status(httpCode.codes.NOTFOUND).json(['Reserve ' + id + ' is not found']);
    });
}

reservesController.updatePlaces = (number, code) => {
    sql = 'SELECT current_places FROM classes WHERE code = ?';
    connection.query(sql, [code], function (err, currentPlaces) {
        if (!err) {
            let updatePlaces = currentPlaces[0].current_places + number;
            // console.log('currentPlaces ' , updatePlaces)
            sql = 'UPDATE classes SET current_places = ? WHERE code = ?';
            connection.query(sql, [updatePlaces, code]);
        } else
            console.log(err)
    });
}

module.exports = reservesController;

