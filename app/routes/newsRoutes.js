const helmet = require("helmet");
const express = require('express');
const middleware = require('../middleware/middleware');
const newsController = require("../controllers/newsController");

const router = express.Router();
router.use(helmet.hidePoweredBy());

router.post('/news/create', middleware.isAdminOrTeacher, newsController.createNews);
router.get('/news', middleware.isAuthenticated, newsController.getLastNews);

module.exports = router;
