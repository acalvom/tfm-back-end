const {Router} = require('express');
const authController = require('../controllers/authController');

const router = Router();
router.use(function (req, res, next) {
    res.removeHeader("X-Powered-By");
    next();
});

router.post('/users/login', authController.login);
router.post('/users/register', authController.register);

// This is only to validate token verification
router.get('/users/valToken/:email', authController.validToken);

module.exports = router;
