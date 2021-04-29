const helmet = require("helmet");
const express = require('express');
const usersController = require('../controllers/usersController');
const middleware = require('../middleware/middleware');

const router = express.Router();
router.use(helmet.hidePoweredBy());

router.get('/users', middleware.isAdmin, usersController.getAllUsers);

module.exports = router;
