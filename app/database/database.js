const mysql = require('mysql');
// const connectionData = require('./databaseManager');
const DB_CODE = require('../resources/constants');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect(function (err) {
    err ? console.log(DB_CODE.DB_ERROR) : console.log(DB_CODE.DB_OK);
});
module.exports = connection;
