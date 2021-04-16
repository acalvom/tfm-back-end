const mysql = require('mysql');
const connectionData = require('./databaseManager');
const DB_ERROR = "Database Server Error";
const DB_OK = "Database Is Connected";

const connection = mysql.createConnection({
    host: connectionData.connectionData.host,
    user: connectionData.connectionData.user,
    password: connectionData.connectionData.password,
    database: connectionData.connectionData.database
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
