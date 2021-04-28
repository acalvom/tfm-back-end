const connection = require('../database/database');
const httpCode = require('../resources/httpCodes');

const User = require('../models/User');

function getStudents(req, res) {
    console.log("Students global search ");
}
exports.getStudents = getStudents;


function getTeachers(req, res) {
    console.log("Teachers global search ");
}
exports.getTeachers = getTeachers;

