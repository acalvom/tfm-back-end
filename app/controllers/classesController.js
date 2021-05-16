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
        // console.log(newClass)
        connection.query(sql, [newClass], function (err, resultDB) {
            if (!err) {
                newClass.id = resultDB.insertId;
                res.status(httpCode.codes.CREATED).json(newClass);
            } else
                res.status(httpCode.codes.CONFLICT).json('Class ' + newClass.code + ' already exists');
        });
    }
}

module.exports = classesController;
