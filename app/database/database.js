const mysql = require('mysql');
const connectionData = require('./databaseManager');
const DB_CODE = require('../resources/constants');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || connectionData.connectionData.host,
    user: process.env.DB_USER || connectionData.connectionData.user,
    password: process.env.DB_PASSWORD || connectionData.connectionData.password,
    database: process.env.DB_DATABASE || connectionData.connectionData.database
});

connection.connect(function (err) {
    err ? console.log(DB_CODE.DB_ERROR) : console.log(DB_CODE.DB_OK);
});
module.exports = connection;
