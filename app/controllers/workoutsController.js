const httpCode = require("../resources/httpCodes");
const connection = require('../database/database');
const workoutsController = {};

let sql;

workoutsController.createWorkout = (req, res) => {
    let workout = req.body;
    if (Object.keys(workout).length === 0)
        res.status(httpCode.codes.NOCONTENT).json('No workout sent');
    else {
        sql = 'INSERT INTO workouts SET ?';
        connection.query(sql, [workout], function (err, resultDB) {
            if (!err) {
                workout.id = resultDB.insertId;
                res.status(httpCode.codes.CREATED).json(workout);
            } else
                res.status(httpCode.codes.SERVERERROR).json('Internal Server Error');
        });
    }
}

workoutsController.getAllWorkouts = (req, res) => {
    sql = 'SELECT * FROM workouts';
    connection.query(sql, function (err, workouts) {
        if (!err && workouts.length > 0) {
            res.status(httpCode.codes.OK).json(workouts);
        } else
            res.status(httpCode.codes.NOTFOUND).json('Workouts not found');
    });
}

module.exports = workoutsController;
