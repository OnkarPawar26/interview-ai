const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const interviewController = require('../controllers/interview.controller');
const upload = require('../middlewares/file.middleware');



const interviewRouter = express.Router();

/**
 * @route POST
 * @desc generate new interview report on the basis of user resume pdf, job description and Self description
 * @access Private
 */ 
interviewRouter.post("/",authMiddleware.authUser,upload.single('resume'),interviewController.generateInterViewReportController)

module.exports = interviewRouter;