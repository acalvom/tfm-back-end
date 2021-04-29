const helmet = require("helmet");
const express = require('express');
const authController = require('../controllers/authController');
const middleware = require("../middleware/middleware");

const router = express.Router();
router.use(helmet.hidePoweredBy());

router.post('/users/login', authController.login);
router.post('/users/register', middleware.isAdmin, authController.register);

module.exports = router;
