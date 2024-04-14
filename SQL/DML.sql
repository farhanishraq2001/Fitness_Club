-- Populate Admins
INSERT INTO Admins (password, first_name, last_name)
VALUES 
('Potter', 'J.K.', 'Rowling'),
('1984', 'George', 'Orwell'),
('Leo', 'F. Scott', 'Fitzgerald');

-- Populate Trainers
INSERT INTO Trainers (password, first_name, last_name)
VALUES 
('Shield', 'Steve', 'Rogers'),
('Terminator', 'Arnold', 'Schwarzenegger'),
('Vengeance', 'Bruce', 'Wayne'),
('Sasuke', 'Naruto', 'Uzumaki'),
('Elevatedmusic', 'Marshall Bruce', 'Mathers III'),
('Birdistheword', 'Peter', 'Griffin');

-- Populate Members
INSERT INTO Members (member_email, password, first_name, last_name, DOB, street, city, province, postal_Code, card_number, cvv, expiry_date)
VALUES 
('johnwick@yeah.com', 'Puppy', 'John', 'Wick', '1970-03-31', '31 Babayaga Street', 'Toronto', 'Ontario', 'M5V 3L9', '1970033189890000', '197', '2099-12-31'),
('peterporker@cartoon.com', 'Cartoon', 'Peter', 'Porker', '1960-07-26', 'Porker Barn', 'Ottawa', 'Ontario', 'K4H 9L0', '1960072620180616', '616', '2099-12-31'),
('johnwick@notyeah.fake', 'Gunfu', 'John', 'Wick', '1971-12-31', '32 Baby Street', 'Saskatoon', 'Saskatchewan', 'S4J 0A3', '1971123100008989', '791', '2099-12-31');

-- Populate Health_metrics
INSERT INTO Health_metrics (date, height, weight, body_fat, member_id)
VALUES 
('2020-01-01', 180, 75, 15, 1),
('2022-01-01', 180, 85, 17, 1);

-- Populate Trainers_schedule
INSERT INTO Trainers_schedule (trainer_id, date, break_start, break_end, break_type)
VALUES 
(1, CURRENT_DATE, '11:00:00', '13:00:00', 'doctors'),
(2, date(CURRENT_DATE+1), '13:00:00', '13:30:00', 'lunch');

-- Populate Equipment_maintenance
INSERT INTO Equipment_maintenance (equipment_name, last_maintained_date, trainer_id)
VALUES
('15lb Dumbells', '2024-04-10', 1),
('25lb Dumbells', '2024-03-17', 2),
('35lb Dumbells', '2024-03-10', 3),
('50lb Dumbells', '2024-04-07', 4),
('Treadmill 1', '2024-04-12', 6),
('Treadmill 2', '2024-04-11', 5),
('Squat Rack 1', '2024-04-10', 4),
('Squat Rack 2', '2024-04-10', 3),
('Barbell weights', '2024-03-31', 2);

-- Populate Rooms
INSERT INTO Rooms (room_name)
VALUES
('Entire Gym'),
('Weight Room 1'),
('Weight Room 2'),
('Cardio Room 1'),
('Cardio Room 2'),
('Yoga Room');

-- Populate Room_cleaning
INSERT INTO Room_cleaning (date, room_id)
VALUES
('2024-04-13', 2),
('2024-04-14', 3),
('2024-04-15', 4);

-- Populate training_sessions
INSERT INTO training_sessions (date, start_time, end_time, session_type, trainer_id, room_id) 
VALUES 
('2024-05-10', '14:00:00', '15:00:00', 'personal', 4, 1);