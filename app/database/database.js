const mysql = require('mysql');
const connectionData = require('./databaseManager');
const DB_CODE = require('../resources/constants');

const connection = mysql.createConnection({
    host: connectionData.connectionData.host,
    user: connectionData.connectionData.user,
    password: connectionData.connectionData.password,
    database: connectionData.connectionData.database
});

connection.connect(function (err) {
    err ? console.log(DB_CODE.DB_ERROR) : console.log(DB_CODE.DB_OK);
});
module.exports = connection;
