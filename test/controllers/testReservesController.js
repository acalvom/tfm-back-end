const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mocha = require('mocha');
const describe = mocha.describe;
const bcrypt = require("bcrypt");

const httpCode = require('../../app/resources/httpCodes');
const testSetup = require("./testsSetup");
const BASE_URL = require('../../app/resources/constants').BASE_URL;
const SALT_ROUNDS = require('../../app/resources/constants').SALT_ROUNDS;

let aClass, aClassCode, workout, workoutId, user, userEmail, reserve, reserveId;
let studentToken, teacherToken, adminToken;
let sql;

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
                password: bcrypt.hashSync('reservesUserPass', SALT_ROUNDS),
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

    after(function () {
        // TEMPORAL
        const connection = require('../../app/database/database');
        sql = 'DELETE FROM users WHERE email = ?';
        connection.query(sql, userEmail);
        sql = 'DELETE FROM classes WHERE code = ?';
        connection.query(sql, aClassCode);
        sql = 'DELETE FROM workouts WHERE id = ?';
        connection.query(sql, workoutId);
    })
})
