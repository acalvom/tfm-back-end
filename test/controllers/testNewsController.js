const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mocha = require('mocha');
const describe = mocha.describe;

const httpCode = require('../../app/resources/httpCodes');
const testSetup = require("../testsSetup");
const BASE_URL = require('../../app/resources/constants').BASE_URL;

let news, newsCode;
let adminToken, teacherToken, studentToken;

chai.use(chaiHttp);

describe('Testing News', function () {
    before(function () {
        adminToken = testSetup.getAdminToken();
        teacherToken = testSetup.getTeacherToken();
        studentToken = testSetup.getStudentToken();
    });

    describe('Get Last News', function () {
        it('should return an array of 3 news', function (done) {
            chai.request(BASE_URL)
                .get("/news")
                .set('Authorization', studentToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.OK);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf(3);
                    done();
                })
        });
    });


    describe('Create News', function () {
        before(function () {
            news = {
                code: 'newsUniqueCode',
                title: 'newsTitle',
                description: 'This is news description',
                creation_date: new Date()
            }
        });

        it('should create news', function (done) {
            chai.request(BASE_URL)
                .post("/news/create")
                .set('Authorization', teacherToken)
                .send(news)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.CREATED);
                    expect(res.body).to.be.a('object');
                    newsCode = res.body.code;
                    done();
                })
        });

        it('should return CONFLICT because the news already exists', function (done) {
            chai.request(BASE_URL)
                .post("/news/create")
                .set('Authorization', teacherToken)
                .send(news)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.CONFLICT);
                    done();
                })
        });

        it('should return BAD REQUEST because the body is empty', function (done) {
            news = {}
            chai.request(BASE_URL)
                .post("/news/create")
                .set('Authorization', adminToken)
                .send(news)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.BADREQUEST);
                    done();
                })
        });
    });

    describe('Delete News', function () {
        it('should delete news', function (done) {
            chai.request(BASE_URL)
                .delete("/news/" + newsCode)
                .set('Authorization', adminToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.NOCONTENT);
                    done();
                })
        });

        it('should return NOT FOUND code because workout does not exist', function (done) {
            chai.request(BASE_URL)
                .delete("/news/" + newsCode)
                .set('Authorization', teacherToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.NOTFOUND);
                    done();
                })
        });
    });

})
