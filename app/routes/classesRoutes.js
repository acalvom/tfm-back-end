const helmet = require("helmet");
const express = require('express');
const middleware = require('../middleware/middleware');
const classesController = require("../controllers/classesController");

const router = express.Router();
router.use(helmet.hidePoweredBy());

router.post('/classes/create', middleware.isTeacher, classesController.createClass);

module.exports = router;
