const helmet = require("helmet");
const express = require('express');
const middleware = require('../middleware/middleware');
const reservesController = require("../controllers/reservesController");

const router = express.Router();
router.use(helmet.hidePoweredBy());

router.post('/reserves/create', middleware.isStudent, reservesController.createReserve);
router.get('/reserves/:email', middleware.isStudent, reservesController.getReservesByUserEmail);
router.delete('/reserves/:id', middleware.isStudent, reservesController.deleteReserve);
router.get('/reserves/:code/users', middleware.isAuthenticated, reservesController.getReservesByCodeClass);


module.exports = router;
