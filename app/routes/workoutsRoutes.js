const helmet = require("helmet");
const express = require('express');
const middleware = require('../middleware/middleware');
const workoutsController = require("../controllers/workoutsController");

const router = express.Router();
router.use(helmet.hidePoweredBy());

router.post('/workouts/create', middleware.isTeacher, workoutsController.createWorkout);
router.get('/workouts', middleware.isAuthenticated, workoutsController.getAllWorkouts);
router.delete('/workouts/:id', middleware.isTeacher, workoutsController.deleteWorkout);

module.exports = router;
