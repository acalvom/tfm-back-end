const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mocha = require('mocha');
const describe = mocha.describe;

const httpCode = require('../../app/resources/httpCodes');
const testSetup = require("./testsSetup");
const BASE_URL = require('../../app/resources/constants').BASE_URL;
const connection = require('../../app/database/database');

let newClass, classCode, workout, workoutId;
let teacherToken;

chai.use(chaiHttp);

describe('Testing Classes', function () {
    before(function () {
        teacherToken = testSetup.getTeacherToken();
    });

    describe('Get All Classes', function () {
        it('should return an array of classes', function (done) {
            chai.request(BASE_URL)
                .get("/classes")
                .set('Authorization', teacherToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.OK);
                    expect(res.body).to.be.a('array');
                    done();
                })
        });
    });

    describe('Create Class', function () {
        before(function () {
            workout = {
                title: 'newWorkoutTitle',
                description: 'This is newWorkout description',
                circuit: true, race: true, bar: true, pullUps: true,
                creationDate: new Date()
            }
            newClass = {
                code: 'newClassUniqueCode',
                init_day_hour: new Date("December 17, 1995 03:24:00"),
                end_day_hour: new Date("December 19, 1995 03:24:00"),
                max_places: 20,
                location: 'newClassLocation',
                location_details: 'newClassLocationDetails'
            }
        });

        it('should create a new workout to create a new class', function (done) {
            chai.request(BASE_URL)
                .post("/workouts/create")
                .set('Authorization', teacherToken)
                .send(workout)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.CREATED);
                    expect(res.body).to.be.a('object');
                    workoutId = res.body.id;
                    done();
                })
        });

        it('should create a new class', function (done) {
            newClass.id_workout = String(workoutId);
            chai.request(BASE_URL)
                .post("/classes/create")
                .set('Authorization', teacherToken)
                .send(newClass)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.CREATED);
                    expect(res.body).to.be.a('object');
                    classCode = res.body.code;
                    done();
                })
        });

        it('should return FORBIDDEN code because workout is assign to a class', function (done) {
            chai.request(BASE_URL)
                .delete("/workouts/" + workoutId)
                .set('Authorization', teacherToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.FORBIDDEN);
                    done();
                })
        });

        it('should return CONFLICT because the class already exists', function (done) {
            chai.request(BASE_URL)
                .post("/classes/create")
                .set('Authorization', teacherToken)
                .send(newClass)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.CONFLICT);
                    done();
                })
        });

        it('should return NO CONTENT because the body is empty', function (done) {
            newClass = {}
            chai.request(BASE_URL)
                .post("/classes/create")
                .set('Authorization', teacherToken)
                .send(newClass)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.NOCONTENT);
                    done();
                })
        });
    });

    describe('Delete Class', function () {
        it('should delete a class', function (done) {
            chai.request(BASE_URL)
                .delete("/classes/" + classCode)
                .set('Authorization', teacherToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.NOCONTENT);
                    done();
                })
        });

        it('should return NOT FOUND code because the class does not exist', function (done) {
            chai.request(BASE_URL)
                .delete("/classes/" + classCode)
                .set('Authorization', teacherToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.NOTFOUND);
                    done();
                })
        });
    });

    after(function () {
        connection.query('DELETE FROM workouts WHERE id = ?', workoutId);
    })
})