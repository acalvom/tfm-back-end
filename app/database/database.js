const mysql = require('mysql');
const DB_ERROR = "Database Server Error";
const DB_OK = "Database Is Connected";

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'tfm_superuser',
    password: 'tfm_superuser',
    database: 'tfm_ddbb'
});

// Check connection
connection.connect(function (err) {
    if (err) {
        console.log(DB_ERROR);
    } else {
        console.log(DB_OK);
    }
});

module.exports = connection;
