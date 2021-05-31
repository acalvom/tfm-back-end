const httpCode = require("../resources/httpCodes");
const connection = require('../database/database');
const workoutsController = {};

let sql;

workoutsController.createWorkout = (req, res) => {
    let workout = req.body;
    if (Object.keys(workout).length === 0)
        res.status(httpCode.codes.BADREQUEST).json('No workout sent');
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

workoutsController.deleteWorkout = (req, res) => {
    let id = req.params.id;
    sql = 'DELETE FROM workouts WHERE id = ?';
    connection.query(sql, [id], function (err, result) {
        if (!err && result.affectedRows > 0)
            res.status(httpCode.codes.NOCONTENT).json(['Workout ' + id + ' deleted successfully']);
        else if (err) {
            if (err.code === 'ER_ROW_IS_REFERENCED_2')
                res.status(httpCode.codes.CONFLICT).json(['Workout ' + id + ' cannot be delete because it is assign to a class']);
        } else
            res.status(httpCode.codes.NOTFOUND).json(['Workout ' + id + ' is not found']);
    });
}

workoutsController.editWorkout = (req, res) => {
    let id = req.params.id;
    let workout = req.body;
    sql = 'UPDATE workouts SET ? WHERE id = ?';
    connection.query(sql, [workout, id], function (err, result) {
        if (!err && result.affectedRows > 0)
            res.status(httpCode.codes.NOCONTENT).json(['Workout updated successfully']);
        else
            res.status(httpCode.codes.NOTFOUND).json(['Workout ' + id + ' is not found']);
    });
}

workoutsController.getWorkoutById = (req, res) => {
    let id = req.params.id;
    sql = 'SELECT * FROM workouts WHERE id = ?';
    connection.query(sql, [id], function (err, workout) {
        if (!err && workout.length === 1) {
            res.status(httpCode.codes.OK).json(workout);
        } else
            res.status(httpCode.codes.NOTFOUND).json('Workout ' + id + ' not found');
    });
}

module.exports = workoutsController;
