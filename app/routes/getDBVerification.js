const connection = require('../database/database');
const DB_ERROR = "Database Server Error";

function showDB(req, res) {
    let sql = 'SELECT * FROM connectddbb';
    connection.query(sql, function (err, rows) {
        if (err) {
            res.json(DB_ERROR);
            console.log(err);
        } else {
            res.json(rows);
        }
    });
}

exports.showDB = showDB;
