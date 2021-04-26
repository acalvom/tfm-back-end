const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mocha = require('mocha');
const describe = mocha.describe;

const CryptoJS = require("crypto-js");
const httpCode = require('../../app/resources/httpCodes');
const auth = require('../../app/controllers/authController');

chai.use(chaiHttp);
const url = 'http://localhost:8000';
const data = {email: 'superuser@academy.com', password: CryptoJS.AES.encrypt('superuser', 'password').toString()};

describe('Testing AuthController', function () {

    it('should return a valid token', function (done) {
        chai.request(url)
            .post("/users/login")
            .send(data)
            .end(function (err, res) {
                expect(res).to.have.status(httpCode.codes.OK);
                expect(res.header['authorization']).not.be.null;
                expect(res.header).to.have.property('role', 'admin');
                expect(auth.validToken(res)).to.be.true;
                done();
            })
    });

    it('should return a not valid token', function (done) {
        chai.request(url)
            .post("/users/login")
            .send(data)
            .end(function (err, res) {
                expect(res).to.have.status(httpCode.codes.OK);
                res.header['authorization'] = "Bearer badToken";
                expect(res.header['authorization']).not.be.null;
                expect(res.header).to.have.property('authorization', 'Bearer badToken');
                expect(auth.validToken(res)).to.be.false;
                done();
            })
    });

    it('should return no token', function (done) {
        chai.request(url)
            .post("/users/login")
            .send(data)
            .end(function (err, res) {
                expect(res).to.have.status(httpCode.codes.OK);
                res.header['authorization'] = null;
                expect(res.header['authorization']).to.be.null;
                expect(auth.validToken(res)).to.be.false;
                done();
            })
    });

    it('should return a user not found in login', function (done) {
        chai.request(url)
            .post("/users/login")
            .send({email: 'nouser@academy.com', password: data.password})
            .end(function (err, res) {
                expect(res).to.have.status((httpCode.codes.NOTFOUND));
                done();
            })
    });

    it('should return a wrong password in login', function (done) {
        chai.request(url)
            .post("/users/login")
            .send({email: data.email, password: CryptoJS.AES.encrypt('aa', 'password').toString()})
            .end(function (err, res) {
                expect(res).to.have.status((httpCode.codes.BADREQUEST));
                done();
            })
    });

    it('should return no email/password provided in login', function (done) {
        chai.request(url)
            .post("/users/login")
            .send({email: '', password: ''})
            .end(function (err, res) {
                expect(res).to.have.status((httpCode.codes.NOCONTENT));
                done();
            })
    });
});
