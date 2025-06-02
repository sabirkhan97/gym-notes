-- Drop existing tables if they exist
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create exercises table
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_name VARCHAR(100) NOT NULL,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight INTEGER,
  exercise_date DATE NOT NULL,
  workout_type VARCHAR(50),
  muscle_group VARCHAR(50),
  set_type VARCHAR(50),
  additional_exercises JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a test user (password: testpass123)
INSERT INTO users (email, username, password_hash)
VALUES (
  'testuser@example.com',
  'testuser',
  '$2a$10$XK7Qz6.4Xz5Y5Y6Z6Y7Qz6.4Xz5Y5Y6Z6Y7Qz6.4Xz5Y5Y6Z6Y7Qz' -- Hashed password
);

-- Insert a test exercise
INSERT INTO exercises (
  user_id, exercise_name, sets, reps, weight, exercise_date,
  workout_type, muscle_group, set_type, additional_exercises
)
VALUES (
  1, 'Bench Press', 3, 10, 100, '2025-06-01',
  'Upper Body', 'Chest', 'Standard', '[]'
);