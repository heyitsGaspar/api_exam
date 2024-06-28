// models/Question.js

const supabase = require('../config/database');

async function getQuestionsWithAnswers() {
  const { data: questions, error } = await supabase.from('questions').select('*');
  if (error) {
    throw new Error(error.message);
  }

  for (const question of questions) {
    const { data: answers, error: answersError } = await supabase
      .from('answers')
      .select('id, answer_text, is_correct')
      .eq('question_id', question.id);
    
    if (answersError) {
      throw new Error(answersError.message);
    }
    
    question.answers = answers;
  }

  return questions;
}

module.exports = { getQuestionsWithAnswers };
