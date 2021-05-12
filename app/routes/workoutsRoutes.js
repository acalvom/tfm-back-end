const helmet = require("helmet");
const express = require('express');
const middleware = require('../middleware/middleware');
const workoutsController = require("../controllers/workoutsController");

const router = express.Router();
router.use(helmet.hidePoweredBy());

router.post('/workouts/create', middleware.isTeacher, workoutsController.createWorkout);

module.exports = router;
