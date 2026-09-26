const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public   
 */
router.post('/register',authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @desc login existing user with email and password
 * @access Public 
 */
router.post('/login',authController.loginUserController)


module.exports = router;