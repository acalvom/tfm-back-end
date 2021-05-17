const httpCode = require("../resources/httpCodes");
const connection = require('../database/database');
const classesController = {};

let sql;

classesController.createClass = (req, res) => {
    let newClass = req.body;
    if (Object.keys(newClass).length === 0)
        res.status(httpCode.codes.NOCONTENT).json('No class sent');
    else {
        sql = 'INSERT INTO classes SET ?';
        //console.log(newClass)
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
            // console.log(classes)
            res.status(httpCode.codes.OK).json(classes);
        } else
            res.status(httpCode.codes.NOTFOUND).json('Classes not found');
    });
}

classesController.deleteClass = (req, res) => {
    let code = req.params.code;
    sql = 'DELETE FROM classes WHERE code = ?';
    connection.query(sql, [code], function (err, result) {
        console.log(code)
        if (!err && result.affectedRows > 0)
            res.status(httpCode.codes.NOCONTENT).json(['Class ' + code + ' deleted successfully']);
        else
            res.status(httpCode.codes.NOTFOUND).json(['Class ' + code + ' is not found']);
    });
}

module.exports = classesController;
