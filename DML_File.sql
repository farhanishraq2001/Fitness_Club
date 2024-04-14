-- DML: Data Insertions after Truncating Tables

-- Truncate existing data
TRUNCATE TABLE Billing, Equipment_maintenance, Trainers_schedule, Members_schedule, Training_sessions, Rooms, Fitness_achievements, Exercise_tracker, Health_metrics, Fitness_goals, Admins, Trainers, Members RESTART IDENTITY CASCADE;

-- Insert data into Members
INSERT INTO Members (member_email, password, first_name, last_name, DOB, street, city, province, postal_Code, card_number, CVV, expiry_date)
VALUES ('bakri@example.com', 'bakri123', 'Bakri', 'Rajab', '1990-01-01', '123 Carleton St', 'Ottawa', 'ON', '12345', '1234567890123456', '123', '2025-12-31');

-- Insert data into Trainers
INSERT INTO Trainers (password, first_name, last_name)
VALUES ('frahan123', 'Farhan', 'Mo');

-- Insert data into Admins
INSERT INTO Admins (password, first_name, last_name)
VALUES ('alex123', 'Alex', 'Johnson');

-- Insert data into Fitness Goals
INSERT INTO Fitness_goals (target_date, goal_type, goal_target, member_id)
VALUES ('2024-01-01', 'Weight Loss', 'Lose 10 kg', 1);

-- Insert data into Health Metrics
INSERT INTO Health_metrics (height, weight, body_fat, member_id)
VALUES (175, 85, 20, 1);

-- Insert data into Exercise Tracker
INSERT INTO Exercise_tracker (workout_type, workout_sets, sets_completed, member_id)
VALUES ('Cardio', 3, 3, 1);

-- Insert data into Fitness Achievements
INSERT INTO Fitness_achievements (achievement_date, goal_type, goal_target, achieved_record, member_id, fitness_goals_id)
VALUES ('2023-12-25', 'Weight Loss', 'Lose 10 kg', 'Lost 12 kg', 1, 1);

-- Insert data into Rooms
INSERT INTO Rooms (room_name)
VALUES ('Fitness Room');

-- Insert data into Training Sessions
INSERT INTO Training_sessions (date, start_time, end_time, session_type, trainer_id, room_id)
VALUES ('2024-04-01', '08:00', '10:00', 'Yoga', 1, 1);

-- Insert data into Members Schedule
INSERT INTO Members_schedule (member_id, session_id)
VALUES (1, 1);

-- Insert data into Trainers Schedule
INSERT INTO Trainers_schedule (trainer_id, date, break_start, break_end)
VALUES (1, '2024-04-01', '12:00', '13:00');

-- Insert data into Equipment Maintenance
INSERT INTO Equipment_maintenance (equipment_name, last_maintained_date, trainer_id)
VALUES ('Treadmill', '2023-12-31', 1);

-- Insert data into Billing
INSERT INTO Billing (type, date_paid, paid_by)
VALUES ('Membership Fee', '2023-12-01', 1);
