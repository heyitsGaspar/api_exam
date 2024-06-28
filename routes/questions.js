// routes.js

const express = require('express');
const router = express.Router();
const { getAllQuestions } = require('../controllers/questionController');

router.get('/questions', getAllQuestions);

module.exports = router;
