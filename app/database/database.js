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

connection.connect(function (err) {
    err ? console.log(DB_ERROR) : console.log(DB_OK);
});

exports.closeConnection = function (connection) {
    connection.end(function (err) {
    });
    console.log("DataBase connection closed");
}

module.exports = connection;
