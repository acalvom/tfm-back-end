const middleware = require("../../app/middleware/middleware");

superuserEmail = 'superuser@academy.com';
teacherEmail = 'teacher@academy.com';
studentEmail = 'student@academy.com';

exports.getAdminToken = () => {
    return 'Bearer ' + middleware.generateToken(superuserEmail, 'admin');
};

exports.getTeacherToken = () => {
    return 'Bearer ' + middleware.generateToken(teacherEmail, 'teacher');
};

exports.getStudentToken = () => {
    return 'Bearer ' + middleware.generateToken(studentEmail, 'student');
};
