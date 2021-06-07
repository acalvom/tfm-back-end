const httpCode = require("../resources/httpCodes");
const connection = require('../database/database');
const classesController = {};

let sql;

classesController.createClass = (req, res) => {
    let newClass = req.body;
    if (Object.keys(newClass).length === 0)
        res.status(httpCode.codes.BADREQUEST).json('No class sent');
    else {
        sql = 'INSERT INTO classes SET ?';
        connection.query(sql, [newClass], function (err, resultDB) {
            if (!err) {
                newClass.id = resultDB.insertId;
                res.status(httpCode.codes.CREATED).json(newClass);
            } else
                res.status(httpCode.codes.CONFLICT).json('Class ' + newClass.code + ' already exists');
        });
    }
}

classesController.getAllClasses = (req, res) => {
    sql = 'SELECT * FROM classes';
    connection.query(sql, function (err, classes) {
        if (!err && classes.length > 0) {
            res.status(httpCode.codes.OK).json(classes);
        } else
            res.status(httpCode.codes.NOTFOUND).json('Classes not found');
    });
}

classesController.deleteClass = (req, res) => {
    let code = req.params.code;
    sql = 'DELETE FROM classes WHERE code = ?';
    connection.query(sql, [code], function (err, result) {
        if (!err && result.affectedRows > 0)
            res.status(httpCode.codes.NOCONTENT).json(['Class ' + code + ' deleted successfully']);
        else
            res.status(httpCode.codes.NOTFOUND).json(['Class ' + code + ' is not found']);
    });
}

classesController.editClass = (req, res) => {
    let code = req.params.code;
    let editedClass = req.body;
    sql = 'UPDATE classes SET ? WHERE code = ?';
    connection.query(sql, [editedClass, code], function (err, result) {
        if (!err && result.affectedRows > 0)
            res.status(httpCode.codes.NOCONTENT).json(['Class updated successfully']);
        else
            res.status(httpCode.codes.NOTFOUND).json(['Class ' + code + ' is not found']);
    });
}

classesController.updatePlaces = (req, res) => {
    let code = req.params.code;
    let value = req.body.value;
    sql = 'SELECT current_places, max_places FROM classes WHERE code = ?';
    connection.query(sql, [code], function (err, result) {
        let currentPlaces = result[0].current_places + value;
        let maxPlaces = result[0].max_places;
        if (!err && currentPlaces <= maxPlaces) {
            sql = 'UPDATE classes SET current_places = ? WHERE code = ?';
            connection.query(sql, [currentPlaces, code], function (errUpd, resultUpd) {
                if (!errUpd && resultUpd.affectedRows > 0)
                    res.status(httpCode.codes.NOCONTENT).json(['Places updated successfully']);
            });
        } else
            res.status(httpCode.codes.CONFLICT).json(['Class is full']);
    });
}

module.exports = classesController;
