const connection = require('../database/database');
const httpCode = require('../resources/httpCodes');

const User = require('../models/User');

function getStudents(req, res) {
    sql = 'SELECT * FROM users WHERE role = ?';
    connection.query(sql, ['student'], function (err, students) {
        if (!err && students.length > 0) {
            res.status(httpCode.codes.OK).json(students);
        } else
            res.status(httpCode.codes.NOTFOUND).json('NOT FOUND');
    });
}

exports.getStudents = getStudents;


function getTeachers(req, res) {
    sql = 'SELECT * FROM users WHERE role = ?';
    connection.query(sql, ['teacher'], function (err, teachers) {
        if (!err && teachers.length > 0) {
            res.status(httpCode.codes.OK).json(teachers);
        } else
            res.status(httpCode.codes.NOTFOUND).json('NOT FOUND');
    });
}

exports.getTeachers = getTeachers;

