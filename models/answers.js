// models/answer.js
const pool = require('../db');

async function getAnswersByQuestionId(questionId) {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM answers WHERE question_id = $1', [questionId]);
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    getAnswersByQuestionId
};
