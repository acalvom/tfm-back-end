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
    }
}

module.exports = reservesController;

