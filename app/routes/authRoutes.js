const {Router} = require('express');
const authController = require('../controllers/authController');

const router = Router();
router.disable("x-powered-by");
router.post('/users/login', authController.login);

// This is only to validate token verification
router.get('/users/valToken/:email', authController.validToken);

module.exports = router;
