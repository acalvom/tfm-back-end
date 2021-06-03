const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mocha = require('mocha');
const describe = mocha.describe;

const testSetup = require("../testsSetup");
const middleware = require('../../app/middleware/middleware');
const httpCode = require('../../app/resources/httpCodes');
const BASE_URL = require('../../app/resources/constants').BASE_URL;
const NO_TOKEN_GENERATED = require('../../app/resources/constants').NO_TOKEN_GENERATED;

let adminToken, teacherToken, studentToken;

chai.use(chaiHttp);

describe('Testing Middleware', function () {
    it('should return a new token', function () {
        let token = middleware.generateToken('aaa@aaa.com', 'teacher');
        expect(token).to.be.a('string');
        expect(token).to.not.be.null;
    });
    it('should return error as value for an empty token', function () {
        let token = middleware.generateToken();
        expect(token).to.be.a('string');
        expect(token).to.equal(NO_TOKEN_GENERATED);
    });

    describe('Testing role access', function () {
        before(function () {
            adminToken = testSetup.getAdminToken();
            teacherToken = testSetup.getTeacherToken();
            studentToken = testSetup.getStudentToken();
        });


        describe('Authentication role access', function () {
            it('should return an UNAUTHORIZED code because of a bad token', function (done) {
                chai.request(BASE_URL)
                    .get("/classes")
                    .set('Authorization', "Bearer badToken")
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.UNAUTHORIZED);
                        done();
                    })
            });

            it('should return an UNAUTHORIZED code because of a bad token', function (done) {
                chai.request(BASE_URL)
                    .get("/classes")
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.BADREQUEST);
                        done();
                    })
            });
        })

        describe('Admin role access', function () {
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

        describe('Teacher role access', function () {
            it('should return BAD REQUEST because there is no token provided', function (done) {
                chai.request(BASE_URL)
                    .get("/users/students")
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.BADREQUEST);
                        done();
                    })
            });

            it('should return an FORBIDDEN because role is admin', function (done) {
                chai.request(BASE_URL)
                    .get("/users/students")
                    .set('Authorization', adminToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.FORBIDDEN);
                        done();
                    })
            });
            it('should return an FORBIDDEN because role is student', function (done) {
                chai.request(BASE_URL)
                    .get("/users/students")
                    .set('Authorization', studentToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.FORBIDDEN);
                        done();
                    })
            });

        })

        describe('Student role access', function () {
            it('should return BAD REQUEST because there is no token provided', function (done) {
                chai.request(BASE_URL)
                    .post("/reserves/create")
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.BADREQUEST);
                        done();
                    })
            });

            it('should return an FORBIDDEN because role is admin', function (done) {
                chai.request(BASE_URL)
                    .post("/reserves/create")
                    .set('Authorization', adminToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.FORBIDDEN);
                        done();
                    })
            });
            it('should return an FORBIDDEN because role is teacher', function (done) {
                chai.request(BASE_URL)
                    .post("/reserves/create")
                    .set('Authorization', teacherToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.FORBIDDEN);
                        done();
                    })
            });


        })

        describe('Admin or Teacher role access', function () {
            it('should return BAD REQUEST because there is no token provided', function (done) {
                chai.request(BASE_URL)
                    .post("/news/create")
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.BADREQUEST);
                        done();
                    })
            });

            it('should return an FORBIDDEN code because role is student', function (done) {
                chai.request(BASE_URL)
                    .post("/news/create")
                    .set('Authorization', studentToken)
                    .end(function (err, res) {
                        expect(res).to.have.status(httpCode.codes.FORBIDDEN);
                        done();
                    })
            });

        })


    });
});
