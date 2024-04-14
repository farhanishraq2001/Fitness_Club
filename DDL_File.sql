-- DDL: Database Structure Creation

-- Members Table
CREATE TABLE Members (
    member_id SERIAL PRIMARY KEY,
    member_email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    DOB DATE NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    postal_Code VARCHAR(10) NOT NULL,
    card_number VARCHAR(19) NOT NULL,
    CVV VARCHAR(4) NOT NULL,
    expiry_date DATE NOT NULL
);

-- Trainers Table
CREATE TABLE Trainers (
    trainer_id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);

-- Admin Staff Table
CREATE TABLE Admins (
    admin_id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);

-- Fitness Goals
CREATE TABLE Fitness_goals (
    fitness_goals_id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    target_date DATE NOT NULL,
    goal_type VARCHAR(255) NOT NULL,
    goal_target VARCHAR(255) NOT NULL,
    member_id INTEGER REFERENCES Members(member_id)
);

-- Health Metrics
CREATE TABLE Health_metrics (
    health_metric_id SERIAL PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    height DECIMAL NOT NULL,
    weight DECIMAL NOT NULL,
    body_fat DECIMAL NOT NULL,
    member_id INTEGER REFERENCES Members(member_id)
);

-- Exercise Tracker
CREATE TABLE Exercise_tracker (
    excercise_tracker_id SERIAL PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    workout_type VARCHAR(255) NOT NULL,
    workout_sets INTEGER NOT NULL,
    sets_completed INTEGER NOT NULL,
    member_id INTEGER REFERENCES Members(member_id)
);

-- Fitness Achievements
CREATE TABLE Fitness_achievements (
    fitness_achievement_id SERIAL PRIMARY KEY,
    achievement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    goal_type VARCHAR(255) NOT NULL,
    goal_target VARCHAR(255) NOT NULL,
    achieved_record VARCHAR(255) NOT NULL,
    member_id INTEGER REFERENCES Members(member_id),
    fitness_goals_id INTEGER REFERENCES Fitness_goals(fitness_goals_id)
);

-- Rooms
CREATE TABLE Rooms (
    room_id SERIAL PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL
);

-- Room cleaning
CREATE TABLE Room_cleaning (
    room_cleaning_id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    room_id INTEGER REFERENCES Rooms(room_id)
);

-- Training Sessions
CREATE TABLE Training_sessions (
    session_id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    session_type VARCHAR(50) NOT NULL,
    trainer_id INTEGER REFERENCES Trainers(trainer_id),
    room_id INTEGER REFERENCES Rooms(room_id)
);

-- Members Schedule
CREATE TABLE Members_schedule (
    member_id INTEGER REFERENCES Members(member_id),
    session_id INTEGER REFERENCES Training_sessions(session_id),
    PRIMARY KEY (member_id, session_id)
);

-- Trainers Schedule
CREATE TABLE Trainers_schedule (
    trainer_schedule_id SERIAL PRIMARY KEY,
    trainer_id INTEGER REFERENCES Trainers(trainer_id),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    break_type VARCHAR(255),
    break_start TIME NOT NULL DEFAULT '12:00:00',
    break_end TIME NOT NULL
);

-- Equipment Maintenance
CREATE TABLE Equipment_maintenance (
    equipment_id SERIAL PRIMARY KEY,
    equipment_name VARCHAR(255) NOT NULL,
    last_maintained_date DATE NOT NULL,
    trainer_id INTEGER REFERENCES Trainers(trainer_id)
);

-- Billing
CREATE TABLE Billing (
    billing_id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    date_paid DATE NOT NULL,
    paid_by INTEGER REFERENCES Members(member_id),
    session_id INTEGER REFERENCES Training_sessions(session_id)
);