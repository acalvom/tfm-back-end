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
let data;

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
        describe('Delete User', function () {
            before(function () {
                data = {
                    name: "userToDeleteName",
                    surname: "userToDeleteSurname",
                    dni: "12345678J",
                    gender: "woman",
                    email: "userToDeleteEmail@email",
                    password: CryptoJS.AES.encrypt('userToDeletePass', 'password').toString(),
                    penalties: 0,
                    role: "student"
                }
                sql = 'INSERT INTO users SET ?';
                connection.query(sql, [data]);
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
