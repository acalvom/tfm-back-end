const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mocha = require('mocha');
const describe = mocha.describe;

const httpCode = require('../../app/resources/httpCodes');
const testSetup = require("./testsSetup");
const BASE_URL = require('../../app/resources/constants').BASE_URL;

let sql;
let workout, workoutId;
let teacherToken;

chai.use(chaiHttp);

describe('Testing Workouts', function () {
    before(function () {
        teacherToken = testSetup.getTeacherToken();
    });

    describe('Get All Workouts', function () {
        it('should return an array of workouts', function (done) {
            chai.request(BASE_URL)
                .get("/workouts")
                .set('Authorization', teacherToken)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.OK);
                    expect(res.body).to.be.a('array');
                    done();
                })
        });
    });
    describe('Create Workout', function () {
        before(function () {
            workout = {
                title: 'newWorkoutTitle',
                description: 'This is newWorkout description',
                circuit: true,
                race: true,
                bar: true,
                pullUps: true,
                fitness: 'This is the fitness routine for newWorkout',
                comments: 'These are the comments for newWorkout',
                creationDate: new Date()
            }
        });

        it('should create a new workout', function (done) {
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

        it('should return INTERNAL SERVER ERROR because the body is empty', function (done) {
            workout = {}
            chai.request(BASE_URL)
                .post("/workouts/create")
                .set('Authorization', teacherToken)
                .send({field: 'noField'})
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.SERVERERROR);
                    done();
                })
        });

        it('should return NO CONTENT because the body is empty', function (done) {
            workout = {}
            chai.request(BASE_URL)
                .post("/workouts/create")
                .set('Authorization', teacherToken)
                .send(workout)
                .end(function (err, res) {
                    expect(res).to.have.status(httpCode.codes.NOCONTENT);
                    done();
                })
        });
    });

    after(function () {
        // TEMPORAL. NEED TO IMPLEMENT DELETE WORKOUT
        const connection = require('../../app/database/database');
        sql = 'DELETE FROM workouts WHERE id = ?';
        connection.query(sql, workoutId);
    })

});
