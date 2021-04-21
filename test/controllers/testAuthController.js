const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const assert = chai.assert;
const mocha = require('mocha');
const describe = mocha.describe;

const CryptoJS = require("crypto-js");
const httpCode = require('../../app/resources/httpCodes');

chai.use(chaiHttp);
const url = 'http://localhost:8000';

describe('Testing AuthController', function () {
    it('should return token', function (done) {
        chai.request(url)
            .post("/users/login")
            .send({email: 'superuser@academy.com', password: CryptoJS.AES.encrypt('superuser', 'password').toString()})
            .end(function (err, res) {
                expect(res).to.have.status(httpCode.codes.OK);
                expect(res.header['authorization']).not.be.null;
                expect(res.header).to.have.property('role', 'admin');
                done();
            })
    });
    it('should return error in login', function (done) {
        chai.request(url)
            .post("/users/login")
            .send({email: 'superuser@academy.com', password: 'password'})
            .end(function (err, res) {
                expect(res).to.have.status((httpCode.codes.NOTFOUND));
                done();
            })
    });
});
