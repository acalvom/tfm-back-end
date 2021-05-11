const httpCode = require("../resources/httpCodes");
const workoutsController = {};
const connection = require('../database/database');

let sql;

workoutsController.createWorkout = (req, res) => {
    console.log(req.body);
    let workout = req.body;
    if (Object.keys(workout).length === 0)
        res.status(httpCode.codes.NOCONTENT).json('No workout sent');
    else {
        sql = 'INSERT INTO workouts SET ?';
        connection.query(sql, [workout], function (err, resultDB) {
            console.log(resultDB.insertId)
            if (!err)
                res.status(httpCode.codes.CREATED).json(resultDB.insertId + ' ' + workout);
            else
                res.status(httpCode.codes.CONFLICT).json('Workout already exists');
        });
    }
}

module.exports = workoutsController;
