const helmet = require("helmet");
const express = require('express');
const middleware = require('../middleware/middleware');
const reservesController = require("../controllers/reservesController");

const router = express.Router();
router.use(helmet.hidePoweredBy());

router.post('/reserves/create', middleware.isStudent, reservesController.createReserve);

module.exports = router;
