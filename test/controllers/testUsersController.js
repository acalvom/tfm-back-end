const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mocha = require('mocha');
const describe = mocha.describe;
const CryptoJS = require("crypto-js");

const httpCode = require('../../app/resources/httpCodes');
const middleware = require('../../app/middleware/middleware');
const connection = require('../../app/database/database');

const url = 'http://localhost:8000';
let adminToken, teacherToken, studentToken;
let data, editedUser;

chai.use(chaiHttp);

describe('Testing Users', function () {
    before(function () {
        adminToken = 'Bearer ' + middleware.generateToken('superuser@academy.com', 'admin');
        teacherToken = 'Bearer ' + middleware.generateToken('teacher@academy.com', 'teacher');
        studentToken = 'Bearer ' + middleware.generateToken('student@academy.com', 'student');
    });

    describe('Admin Role', function () {
        describe('Get Users', function () {
            it('should return no content because there is no token provided', function (done) {
                chai.request(url)
                    .get("/users")
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.NOCONTENT);
                        done();
                    })
            });

            it('should return an array of users', function (done) {
                chai.request(url)
                    .get("/users")
                    .set('Authorization', adminToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.OK);
                        expect(res.body).to.be.a('array');
                        done();
                    })
            });

            it('should return an unauthorized code because role is teacher', function (done) {
                chai.request(url)
                    .get("/users")
                    .set('Authorization', teacherToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.UNAUTHORIZED);
                        done();
                    })
            });

            it('should return an unauthorized code because role is student', function (done) {
                chai.request(url)
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
                    password: CryptoJS.AES.encrypt('userToTestPass', 'password').toString(),
                    role: "teacher"
                }
                sql = 'INSERT INTO users SET ?';
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
                chai.request(url)
                    .put("/users/" + data.email)
                    .set('Authorization', teacherToken)
                    .send(editedUser)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.UNAUTHORIZED);
                        done();
                    })
            });

            it('should return an unauthorized code because role is student', function (done) {
                chai.request(url)
                    .put("/users/" + data.email)
                    .set('Authorization', studentToken)
                    .send(editedUser)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.UNAUTHORIZED);
                        done();
                    })
            });

            it('should return an not found code because user not exists', function (done) {
                chai.request(url)
                    .put("/users/userNotExist@email")
                    .set('Authorization', adminToken)
                    .send(editedUser)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.NOTFOUND);
                        done();
                    })
            });

            it('should update an user', function (done) {
                chai.request(url)
                    .put("/users/" + data.email)
                    .set('Authorization', adminToken)
                    .send(editedUser)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.NOCONTENT);
                        done();
                    })
            });
        });
        describe('Delete User', function () {
            before(function () {
                data = editedUser;
            });

            it('should return an unauthorized code because role is teacher', function (done) {
                chai.request(url)
                    .delete("/users/" + data.email)
                    .set('Authorization', teacherToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.UNAUTHORIZED);
                        done();
                    })
            });

            it('should return an unauthorized code because role is student', function (done) {
                chai.request(url)
                    .delete("/users/" + data.email)
                    .set('Authorization', studentToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.UNAUTHORIZED);
                        done();
                    })
            });

            it('should return an not found code because user not exists', function (done) {
                chai.request(url)
                    .delete("/users/userNotExist@email")
                    .set('Authorization', adminToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.NOTFOUND);
                        done();
                    })
            });

            it('should delete an user', function (done) {
                chai.request(url)
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
        it('should return no content because there is no token provided', function (done) {
            chai.request(url)
                .get("/users/students")
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.NOCONTENT);
                    done();
                })
        });

        it('should return an array of users', function (done) {
            chai.request(url)
                .get("/users/students")
                .set('Authorization', teacherToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.OK);
                    expect(res.body).to.be.a('array');
                    done();
                })
        });

        it('should return an unauthorized code because role is admin', function (done) {
            chai.request(url)
                .get("/users/students")
                .set('Authorization', adminToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.UNAUTHORIZED);
                    done();
                })
        });

        it('should return an unauthorized code because role is student', function (done) {
            chai.request(url)
                .get("/users/students")
                .set('Authorization', studentToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.UNAUTHORIZED);
                    done();
                })
        });
    });
});
