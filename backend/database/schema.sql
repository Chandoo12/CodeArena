-- CodeArena Database Schema
-- PostgreSQL

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  avatar_url VARCHAR(255),
  bio TEXT,
  role VARCHAR(20) DEFAULT 'user', -- 'user' or 'admin'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Problems Table
CREATE TABLE problems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(20) NOT NULL, -- 'Easy', 'Medium', 'Hard'
  tags VARCHAR(255), -- comma-separated tags
  acceptance_rate FLOAT DEFAULT 0,
  solution_count INTEGER DEFAULT 0,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test Cases Table
CREATE TABLE test_cases (
  id SERIAL PRIMARY KEY,
  problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true, -- public or hidden
  explanation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Submissions Table
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  problem_id INTEGER NOT NULL REFERENCES problems(id),
  code TEXT NOT NULL,
  language VARCHAR(20) DEFAULT 'cpp', -- cpp, python, java, etc.
  verdict VARCHAR(50), -- 'Accepted', 'Wrong Answer', 'TLE', 'Runtime Error', 'Compilation Error'
  execution_time FLOAT, -- in milliseconds
  memory_used FLOAT, -- in MB
  passed_test_cases INTEGER DEFAULT 0,
  total_test_cases INTEGER DEFAULT 0,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contests Table
CREATE TABLE contests (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_by INTEGER NOT NULL REFERENCES users(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  duration_minutes INTEGER, -- contest duration in minutes
  status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'running', 'finished'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contest Problems Table (linking problems to contests)
CREATE TABLE contest_problems (
  id SERIAL PRIMARY KEY,
  contest_id INTEGER NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  problem_id INTEGER NOT NULL REFERENCES problems(id),
  points INTEGER DEFAULT 100, -- points for solving this problem
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contest Participants Table
CREATE TABLE contest_participants (
  id SERIAL PRIMARY KEY,
  contest_id INTEGER NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  score INTEGER DEFAULT 0,
  rank INTEGER,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(contest_id, user_id)
);

-- Interview Rooms Table
CREATE TABLE interview_rooms (
  id SERIAL PRIMARY KEY,
  room_code VARCHAR(50) UNIQUE NOT NULL,
  host_id INTEGER NOT NULL REFERENCES users(id),
  language VARCHAR(20) DEFAULT 'cpp',
  code TEXT,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'archived'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interview Room Participants Table
CREATE TABLE interview_participants (
  id SERIAL PRIMARY KEY,
  room_id INTEGER NOT NULL REFERENCES interview_rooms(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(room_id, user_id)
);

-- Messages Table (for chat in interviews)
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  room_id INTEGER NOT NULL REFERENCES interview_rooms(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_problem_id ON submissions(problem_id);
CREATE INDEX idx_contest_participants_user_id ON contest_participants(user_id);
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
