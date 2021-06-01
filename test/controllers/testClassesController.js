const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mocha = require('mocha');
const describe = mocha.describe;

const httpCode = require('../../app/resources/httpCodes');
const testSetup = require("./testsSetup");
const BASE_URL = require('../../app/resources/constants').BASE_URL;

let newClass, classCode, workout, workoutId;
let teacherToken, studentToken;

chai.use(chaiHttp);

describe('Testing Classes', function () {
    before(function () {
        teacherToken = testSetup.getTeacherToken();
        studentToken = testSetup.getStudentToken();
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

        it('should return CONFLICT code because workout is assign to a class', function (done) {
            chai.request(BASE_URL)
                .delete("/workouts/" + workoutId)
                .set('Authorization', teacherToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.CONFLICT);
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

        it('should return BAD REQUEST because the body is empty', function (done) {
            newClass = {}
            chai.request(BASE_URL)
                .post("/classes/create")
                .set('Authorization', teacherToken)
                .send(newClass)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.BADREQUEST);
                    done();
                })
        });
    });

    describe('Update Class', function () {
        before(function () {
            newClass = {
                init_day_hour: new Date("December 17, 1996 03:24:00"),
                end_day_hour: new Date("December 19, 1996 03:24:00"),
                max_places: 30,
                current_places: 29,
                location: 'newClassEditedLocation',
                location_details: 'newClassEditedLocationDetails'
            }
        });

        it('should return NOT FOUND because class does not exist', function (done) {
            chai.request(BASE_URL)
                .put("/classes/notAClass")
                .set('Authorization', teacherToken)
                .send(newClass)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.NOTFOUND);
                    done();
                })
        });
        it('should update a class', function (done) {
            chai.request(BASE_URL)
                .put("/classes/" + classCode)
                .set('Authorization', teacherToken)
                .send(newClass)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.NOCONTENT);
                    done();
                })
        });
        it('should update current places from the class', function (done) {
            let value = {value: 1};
            chai.request(BASE_URL)
                .put("/classes/places/" + classCode)
                .set('Authorization', studentToken)
                .send(value)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.NOCONTENT);
                    done();
                })
        });
        it('should return CONFLICT because there are no available places for the class', function (done) {
            let value = {value: 1};
            chai.request(BASE_URL)
                .put("/classes/places/" + classCode)
                .set('Authorization', studentToken)
                .send(value)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.CONFLICT);
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

        it('should delete the workout', function (done) {
            chai.request(BASE_URL)
                .delete("/workouts/" + workoutId)
                .set('Authorization', teacherToken)
                .end(function () {
                    done();
                })
        });
    });
})
