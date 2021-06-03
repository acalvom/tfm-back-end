const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mocha = require('mocha');
const describe = mocha.describe;

const httpCode = require('../../app/resources/httpCodes');
const BASE_URL = require('../../app/resources/constants').BASE_URL;
const testSetup = require("./testsSetup");

let adminToken, teacherToken, studentToken;

chai.use(chaiHttp);

describe('Testing ADMIN ROLE access', function () {
    before(function () {
        adminToken = testSetup.getAdminToken();
        teacherToken = testSetup.getTeacherToken();
        studentToken = testSetup.getStudentToken();
    });
    it('should return BAD REQUEST because there is no token provided', function (done) {
        chai.request(BASE_URL)
            .get("/users")
            .end(function (err, res) {
                expect(res).to.have.status(httpCode.codes.BADREQUEST);
                done();
            })
    });

    it('should return an FORBIDDEN because role is teacher', function (done) {
        chai.request(BASE_URL)
            .get("/users")
            .set('Authorization', teacherToken)
            .end(function (err, res) {
                expect(res).to.have.status(httpCode.codes.FORBIDDEN);
                done();
            })
    });
    it('should return an FORBIDDEN because role is student', function (done) {
        chai.request(BASE_URL)
            .get("/users")
            .set('Authorization', studentToken)
            .end(function (err, res) {
                expect(res).to.have.status(httpCode.codes.FORBIDDEN);
                done();
            })
    });


})
