const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mocha = require('mocha');
const describe = mocha.describe;
const bcrypt = require("bcrypt");

const httpCode = require('../../app/resources/httpCodes');
const middleware = require('../../app/middleware/middleware');
const connection = require('../../app/database/database');
const SALT_ROUNDS = require('../../app/resources/constants').SALT_ROUNDS;
const BASE_URL = require('../../app/resources/constants').BASE_URL;

let adminToken, teacherToken, studentToken;
let superuserEmail, teacherEmail, studentEmail
let data, editedUser, passwordsInfo;

chai.use(chaiHttp);

describe('Testing Users', function () {
    before(function () {
        superuserEmail = 'superuser@academy.com';
        teacherEmail = 'teacher@academy.com';
        studentEmail = 'student@academy.com';

        adminToken = 'Bearer ' + middleware.generateToken(superuserEmail, 'admin');
        teacherToken = 'Bearer ' + middleware.generateToken(teacherEmail, 'teacher');
        studentToken = 'Bearer ' + middleware.generateToken(studentEmail, 'student');
    });
    describe('Admin Role', function () {
        describe('Get Users', function () {
            it('should return no content because there is no token provided', function (done) {
                chai.request(BASE_URL)
                    .get("/users")
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.NOCONTENT);
                        done();
                    })
            });
            it('should return an array of users', function (done) {
                chai.request(BASE_URL)
                    .get("/users")
                    .set('Authorization', adminToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.OK);
                        expect(res.body).to.be.a('array');
                        done();
                    })
            });
            it('should return an unauthorized code because role is teacher', function (done) {
                chai.request(BASE_URL)
                    .get("/users")
                    .set('Authorization', teacherToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.UNAUTHORIZED);
                        done();
                    })
            });
            it('should return an unauthorized code because role is student', function (done) {
                chai.request(BASE_URL)
                    .get("/users")
                    .set('Authorization', studentToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.UNAUTHORIZED);
                        done();
                    })
            });
        });
        describe('Update User', function () {
            before(function () {
                data = {
                    name: "userToTestName",
                    surname: "userToTestSurname",
                    dni: "12345678X",
                    gender: "woman",
                    email: "userToTestEmail@email",
                    password: bcrypt.hashSync('userToTestPass', SALT_ROUNDS),
                    role: "teacher"
                }
                let sql = 'INSERT INTO users SET ?';
                connection.query(sql, [data]);
                editedUser = {
                    name: "editedName",
                    surname: "editedSurname",
                    dni: "",
                    gender: "man",
                    email: "editedEmail@email"
                }
            });
            it('should return an unauthorized code because role is teacher', function (done) {
                chai.request(BASE_URL)
                    .put("/users/" + data.email)
                    .set('Authorization', teacherToken)
                    .send(editedUser)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.UNAUTHORIZED);
                        done();
                    })
            });
            it('should return an unauthorized code because role is student', function (done) {
                chai.request(BASE_URL)
                    .put("/users/" + data.email)
                    .set('Authorization', studentToken)
                    .send(editedUser)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.UNAUTHORIZED);
                        done();
                    })
            });
            it('should return an not found code because user not exists', function (done) {
                chai.request(BASE_URL)
                    .put("/users/userNotExist@email")
                    .set('Authorization', adminToken)
                    .send(editedUser)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.NOTFOUND);
                        done();
                    })
            });
            it('should update an user', function (done) {
                chai.request(BASE_URL)
                    .put("/users/" + data.email)
                    .set('Authorization', adminToken)
                    .send(editedUser)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.NOCONTENT);
                        done();
                    })
            });
        });
        describe('Add Phone Number', function () {
            it('should return not found because the user does not exists', function (done) {
                chai.request(BASE_URL)
                    .post("/users/phone")
                    .set('Authorization', adminToken)
                    .send({userEmail: 'userNotExist@email', phone: '666666666'})
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.NOTFOUND);
                        done();
                    })
            });
            it('should add the phone number', function (done) {
                chai.request(BASE_URL)
                    .post("/users/phone")
                    .set('Authorization', adminToken)
                    .send({userEmail: editedUser.email, phone: '666666666'})
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.NOCONTENT);
                        done();
                    })
            });
        });
        describe('Change Password', function () {
            before(function () {
                passwordsInfo = {
                    userEmail: 'editedEmail@email',
                    passwords: {oldPassword: 'b', newPassword: 'b', confirmPassword: 'b'}
                }
            })
            it('should return no content because the body is empty', function (done) {
                passwordsInfo = {}
                chai.request(BASE_URL)
                    .post("/users/password")
                    .set('Authorization', adminToken)
                    .send(passwordsInfo)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.NOCONTENT);
                        done();
                    })
            });
            it('should return not found because the user does not exists', function (done) {
                passwordsInfo = {
                    userEmail: 'noUserEmail@email',
                    passwords: {
                        oldPassword: 'userToTestPass',
                        newPassword: 'userToTestPassNew',
                        confirmPassword: 'userToTestPassNew'
                    }
                }
                chai.request(BASE_URL)
                    .post("/users/password")
                    .set('Authorization', adminToken)
                    .send(passwordsInfo)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.NOTFOUND);
                        done();
                    })
            });
            it('should return bad request because the original password is wrong', function (done) {
                passwordsInfo = {
                    userEmail: 'editedEmail@email',
                    passwords: {oldPassword: 'b', newPassword: 'b', confirmPassword: 'b'}
                }
                chai.request(BASE_URL)
                    .post("/users/password")
                    .set('Authorization', adminToken)
                    .send(passwordsInfo)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.BADREQUEST);
                        done();
                    })
            });
            it('should change the password', function (done) {
                passwordsInfo = {
                    userEmail: 'editedEmail@email',
                    passwords: {
                        oldPassword: 'userToTestPass',
                        newPassword: 'userToTestPassNew',
                        confirmPassword: 'userToTestPassNew'
                    }
                }
                chai.request(BASE_URL)
                    .post("/users/password")
                    .set('Authorization', adminToken)
                    .send(passwordsInfo)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.OK);
                        done();
                    })
            });
        });
        describe('Delete User', function () {
            before(function () {
                data = editedUser;
            });
            it('should return an unauthorized code because role is teacher', function (done) {
                chai.request(BASE_URL)
                    .delete("/users/" + data.email)
                    .set('Authorization', teacherToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.UNAUTHORIZED);
                        done();
                    })
            });
            it('should return an unauthorized code because role is student', function (done) {
                chai.request(BASE_URL)
                    .delete("/users/" + data.email)
                    .set('Authorization', studentToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.UNAUTHORIZED);
                        done();
                    })
            });
            it('should return an not found code because user not exists', function (done) {
                chai.request(BASE_URL)
                    .delete("/users/userNotExist@email")
                    .set('Authorization', adminToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.NOTFOUND);
                        done();
                    })
            });
            it('should delete an user', function (done) {
                chai.request(BASE_URL)
                    .delete("/users/" + data.email)
                    .set('Authorization', adminToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.NOCONTENT);
                        done();
                    })
            });
        });
    });

    describe('Teacher Role', function () {
        describe('Get Students', function () {
            it('should return no content because there is no token provided', function (done) {
                chai.request(BASE_URL)
                    .get("/users/students")
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.NOCONTENT);
                        done();
                    })
            });
            it('should return an array of users', function (done) {
                chai.request(BASE_URL)
                    .get("/users/students")
                    .set('Authorization', teacherToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.OK);
                        expect(res.body).to.be.a('array');
                        done();
                    })
            });
            it('should return an unauthorized code because role is admin', function (done) {
                chai.request(BASE_URL)
                    .get("/users/students")
                    .set('Authorization', adminToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.UNAUTHORIZED);
                        done();
                    })
            });
            it('should return an unauthorized code because role is student', function (done) {
                chai.request(BASE_URL)
                    .get("/users/students")
                    .set('Authorization', studentToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.UNAUTHORIZED);
                        done();
                    })
            });
        });
    });

    describe('Authenticated User', function () {
        describe('Get User By Email', function () {
            it('should return no content because there is no token provided', function (done) {
                chai.request(BASE_URL)
                    .get("/users/" + studentEmail)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.NOCONTENT);
                        done();
                    })
            });
            it('should return not found because the user does not exists', function (done) {
                chai.request(BASE_URL)
                    .get("/users/noEmail@email")
                    .set('Authorization', adminToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.NOTFOUND);
                        done();
                    })
            });
            it('should return the student user', function (done) {
                chai.request(BASE_URL)
                    .get("/users/" + studentEmail)
                    .set('Authorization', studentToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.OK);
                        expect(res.body).to.be.a('array');
                        expect(res.body[0]).to.have.property('id').to.not.be.null;
                        expect(res.body[0]).to.have.property('name').to.be.equal("student");
                        expect(res.body[0]).to.have.property('surname').to.be.equal("student");
                        expect(res.body[0]).to.have.property('dni').to.not.be.null;
                        expect(res.body[0]).to.have.property('password').to.not.be.null;
                        expect(res.body[0]).to.have.property('gender').to.not.be.null;
                        expect(res.body[0]).to.have.property('role').to.be.equal("student");
                        done();
                    })
            });
        });
    })
});
