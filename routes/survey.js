const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');

// Route for submitting a new survey
router.post('/submit', surveyController.submitSurvey);

// Route for fetching survey results
router.get('/results', surveyController.getSurveyResults);

// IMPORTANT: Export the router instance
module.exports = router;