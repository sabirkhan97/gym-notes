import express from 'express';
import { pool } from '../db.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM exercises WHERE user_id = $1 ORDER BY exercise_date DESC', [
      req.user.id,
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch exercises error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { exercise_name, sets, reps, weight, exercise_date, workout_type, muscle_group, set_type, additional_exercises } =
    req.body;

  if (!exercise_name || !sets || !reps || !exercise_date) {
    return res.status(400).json({ error: 'Exercise name, sets, reps, and date are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO exercises (
        user_id, exercise_name, sets, reps, weight, exercise_date,
        workout_type, muscle_group, set_type, additional_exercises
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        req.user.id,
        exercise_name,
        sets,
        reps,
        weight,
        exercise_date,
        workout_type,
        muscle_group,
        set_type,
        additional_exercises ? JSON.stringify(additional_exercises) : null,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Add exercise error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

export default router;