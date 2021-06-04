const helmet = require("helmet");
const express = require('express');
const usersController = require('../controllers/usersController');
const middleware = require('../middleware/middleware');

const router = express.Router();
router.use(helmet.hidePoweredBy());

router.get('/users', middleware.isAdmin, usersController.getAllUsers);
router.get('/users/students', middleware.isTeacher, usersController.getAllStudents);
router.get('/users/:email', middleware.isAuthenticated, usersController.getUserByEmail);
router.delete('/users/:email', middleware.isAdmin, usersController.deleteUser);
router.put('/users/:email', middleware.isAdmin, usersController.editUser);
router.put('/users/penalties/:email', middleware.isTeacher, usersController.setPenalties);
router.post('/users/password', middleware.isAuthenticated, usersController.changePassword);
router.post('/users/phone', middleware.isAuthenticated, usersController.addPhone);


module.exports = router;
