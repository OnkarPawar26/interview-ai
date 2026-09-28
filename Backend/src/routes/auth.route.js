const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware')

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

/**
 * @route GET /api/auth/logout
 * @desc clear token from user cookie and add token to blacklist
 * @access Public 
 */
router.get('/logout',authController.logoutUserController)

/**
 * @route GET /api/auth/get-me 
 * @desc get the current logged in uer details from the token in cookie
 * @access Private
 */

router.get('/get-me',authMiddleware.authUser,authController.getMeController)


module.exports = router;