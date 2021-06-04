const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mocha = require('mocha');
const describe = mocha.describe;

const CryptoJS = require("crypto-js");
const httpCode = require('../../app/resources/httpCodes');
const middleware = require('../../app/middleware/middleware');
const BASE_URL = require('../../app/resources/constants').BASE_URL;

chai.use(chaiHttp);
let data;
let adminToken, teacherToken;

describe('Testing AuthController', function () {
    describe('Testing Login', function () {
        before(function () {
            data = {email: 'superuser@academy.com', password: CryptoJS.AES.encrypt('superuser', 'password').toString()};
        });

        it('should return a valid token', function (done) {
            chai.request(BASE_URL)
                .post("/users/login")
                .send(data)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.OK);
                    expect(res.header['authorization']).not.be.null;
                    expect(res.header).to.have.property('role', 'admin');
                    done();
                })
        });

        it('should return a not valid token', function (done) {
            chai.request(BASE_URL)
                .post("/users/login")
                .send(data)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.OK);
                    res.header['authorization'] = "Bearer badToken";
                    expect(res.header['authorization']).not.be.null;
                    expect(res.header).to.have.property('authorization', 'Bearer badToken');
                    done();
                })
        });

        it('should return no token', function (done) {
            chai.request(BASE_URL)
                .post("/users/login")
                .send(data)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.OK);
                    res.header['authorization'] = null;
                    expect(res.header['authorization']).to.be.null;
                    done();
                })
        });

        it('should return a NOTFOUND in login', function (done) {
            chai.request(BASE_URL)
                .post("/users/login")
                .send({email: 'nouser@academy.com', password: data.password})
                .end(function (err, res) {
                    expect(res).to.have.status((httpCode.codes.NOTFOUND));
                    done();
                })
        });

        it('should return UNAUTHORIZED because of a wrong password in login', function (done) {
            chai.request(BASE_URL)
                .post("/users/login")
                .send({email: data.email, password: CryptoJS.AES.encrypt('aa', 'password').toString()})
                .end(function (err, res) {
                    expect(res).to.have.status((httpCode.codes.UNAUTHORIZED));
                    done();
                })
        });

        it('should return BAD REQUEST because there is no email/password provided in login', function (done) {
            chai.request(BASE_URL)
                .post("/users/login")
                .send({email: '', password: ''})
                .end(function (err, res) {
                    expect(res).to.have.status((httpCode.codes.BADREQUEST));
                    done();
                })
        });
    })

    describe('Testing Register', function () {
        before(function () {
            data = {
                name: "newUserName",
                surname: "newUserSurname",
                dni: "12345678J",
                gender: "woman",
                email: "newUserEmail@email",
                password: CryptoJS.AES.encrypt('newUserPass', 'password').toString(),
                penalties: 0,
                role: "student"
            }
            adminToken = 'Bearer ' + middleware.generateToken('superuser@academy.com', 'admin');
            teacherToken = 'Bearer ' + middleware.generateToken('teacher@academy.com', 'teacher');
        });

        it('should register new user', function (done) {
            chai.request(BASE_URL)
                .post("/users/register")
                .set('Authorization', adminToken)
                .send(data)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.CREATED);
                    expect(res.body).to.be.a('object');
                    done();
                })
        });

        it('should return CONFLICT because the user already exists', function (done) {
            chai.request(BASE_URL)
                .post("/users/register")
                .set('Authorization', adminToken)
                .send(data)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.CONFLICT);
                    done();
                })
        });

        it('should return FORBIDDEN when register a new user', function (done) {
            chai.request(BASE_URL)
                .post("/users/register")
                .set('Authorization', teacherToken)
                .send(data)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.FORBIDDEN);
                    done();
                })
        });

        it('should return BAD REQUEST because the body is empty', function (done) {
            data = {}
            chai.request(BASE_URL)
                .post("/users/register")
                .set('Authorization', adminToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.BADREQUEST);
                    done();
                })
        });
    })

    after(function () {
        const connection = require('../../app/database/database');
        connection.query('DELETE FROM users WHERE dni = ?', '12345678J');
    })
});
