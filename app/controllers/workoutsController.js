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

module.exports = workoutsController;
