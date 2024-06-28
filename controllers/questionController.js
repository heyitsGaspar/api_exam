// controllers/questionsController.js

const Question = require('../models/questions');

async function getAllQuestions(req, res) {
  try {
    const questions = await Question.getQuestionsWithAnswers();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllQuestions };
