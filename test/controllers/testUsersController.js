const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mocha = require('mocha');
const describe = mocha.describe;

const httpCode = require('../../app/resources/httpCodes');
const middleware = require('../../app/middleware/middleware');

const url = 'http://localhost:8000';
let adminToken, teacherToken, studentToken;

chai.use(chaiHttp);

describe('Testing Users', function () {
    before(function () {
        adminToken = 'Bearer ' + middleware.generateToken('superuser@academy.com', 'admin');
        teacherToken = 'Bearer ' + middleware.generateToken('teacher@academy.com', 'teacher');
        studentToken = 'Bearer ' + middleware.generateToken('student@academy.com', 'student');

    });

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
})
