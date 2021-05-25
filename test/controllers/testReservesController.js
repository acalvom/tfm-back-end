const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mocha = require('mocha');
const describe = mocha.describe;
const CryptoJS = require("crypto-js");

const httpCode = require('../../app/resources/httpCodes');
const testSetup = require("./testsSetup");
const BASE_URL = require('../../app/resources/constants').BASE_URL;

let aClass, aClassCode, workout, workoutId, user, userEmail, reserve, reserveId;
let studentToken, teacherToken, adminToken;

chai.use(chaiHttp);

describe('Testing Reserves', function () {
    before(function () {
        studentToken = testSetup.getStudentToken();
        teacherToken = testSetup.getTeacherToken();
        adminToken = testSetup.getAdminToken();
    });

    describe('Create Reserve', function () {
        before(function () {
            workout = {
                title: 'reservesWorkoutTitle',
                description: 'This is reservesWorkout description',
                circuit: true, race: true, bar: true, pullUps: true,
                creationDate: new Date()
            }
            aClass = {
                code: 'reservesClassCode',
                init_day_hour: new Date("December 17, 1995 03:24:00"),
                end_day_hour: new Date("December 19, 1995 03:24:00"),
                max_places: 20,
                location: 'reservesClassLocation',
                location_details: 'reservesClassLocationDetails'
            }
            user = {
                name: "reservesUserName",
                surname: "reservesUserSurname",
                dni: "12345678Y",
                gender: "man",
                email: "reservesUserEmail@email",
                password: CryptoJS.AES.encrypt('newUserPass', 'password').toString(),
                role: "student"
            }
            reserve = {
                email_user: user.email,
                code_class: aClass.code
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

        it('should create a new class to create a new reserve', function (done) {
            aClass.id_workout = String(workoutId);
            chai.request(BASE_URL)
                .post("/classes/create")
                .set('Authorization', teacherToken)
                .send(aClass)
                .end(function (err, res) {
                    aClassCode = res.body.code;
                    done();
                })
        });

        it('should create a new user to create a new reserve', function (done) {
            chai.request(BASE_URL)
                .post("/users/register")
                .set('Authorization', adminToken)
                .send(user)
                .end(function (err, res) {
                    userEmail = res.body.email;
                    done();
                })
        });

        it('should CREATE a reserve', function (done) {
            chai.request(BASE_URL)
                .post("/reserves/create")
                .set('Authorization', studentToken)
                .send(reserve)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.CREATED);
                    expect(res.body).to.be.a('object');
                    reserveId = res.body.id;
                    done();
                })
        });

        it('should return CONFLICT because the reserve already exists', function (done) {
            chai.request(BASE_URL)
                .post("/reserves/create")
                .set('Authorization', studentToken)
                .send(reserve)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.CONFLICT);
                    done();
                })
        });

        it('should return NO CONTENT because the body is empty', function (done) {
            reserve = {}
            chai.request(BASE_URL)
                .post("/reserves/create")
                .set('Authorization', studentToken)
                .send(reserve)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.NOCONTENT);
                    done();
                })
        });
    });

    describe('Get Reserves By User Email', function () {
        it('should return an array of reserves', function (done) {
            chai.request(BASE_URL)
                .get("/reserves/" + userEmail)
                .set('Authorization', studentToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.OK);
                    expect(res.body).to.be.a('array');
                    expect(res.body[0].id).not.be.null;
                    expect(res.body[0].email_user).not.be.null;
                    expect(res.body[0].code_class).not.be.null;
                    done();
                })
        });

        it('should return NOT FOUND because the reserve does not exist', function (done) {
            chai.request(BASE_URL)
                .get("/reserves/notAnEmail")
                .set('Authorization', studentToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.NOTFOUND);
                    done();
                })
        });
    });

    describe('Delete Reserve', function () {
        it('should delete a reserve', function (done) {
            chai.request(BASE_URL)
                .delete("/reserves/" + reserveId)
                .set('Authorization', studentToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.NOCONTENT);
                    done();
                })
        });

        it('should return NOT FOUND code because the reserve does not exist', function (done) {
            chai.request(BASE_URL)
                .delete("/reserves/" + reserveId)
                .set('Authorization', studentToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.NOTFOUND);
                    done();
                })
        });

        it('should delete the user associated to the deleted reserve', function (done) {
            chai.request(BASE_URL)
                .delete("/users/" + userEmail)
                .set('Authorization', adminToken)
                .end(function () {
                    done();
                })
        });

        it('should delete the class associated to the deleted reserve', function (done) {
            chai.request(BASE_URL)
                .delete("/classes/" + aClassCode)
                .set('Authorization', teacherToken)
                .end(function () {
                    done();
                })
        });

        it('should delete the workout associated to the deleted reserve', function (done) {
            chai.request(BASE_URL)
                .delete("/workouts/" + workoutId)
                .set('Authorization', teacherToken)
                .end(function () {
                    done();
                })
        });
    });
})
