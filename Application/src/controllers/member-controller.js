const pool = require('../../db');
const queries = require('../queries/member-queries');
const path = require('path');
const fs = require("fs");

// URL handlers
const initPage = async (req, res) => {
    let htmlFile = path.join(__dirname + '../../../public/'+ 'index.html');

    if (req.accepts('html')) { // If request is html
        if (!fs.existsSync(htmlFile)) {
            // Send 404 response if html file is missing
            res.status(404).json({message: 'ERROR 404: HTML file not found.'});
            return;
        }
        // Send html file in response
        res.status(200).sendFile(path.join(__dirname + '../../../public/'+ 'index.html'));        
    }
}

const getMemberById = async (req, res) => {
    const id = req.query.id;

    try {
        const { rows } = await pool.query(queries.getMemberById, [id]);

        if (rows.length < 1) {
            res.status(404).json({message: "Error 404: Member does not exist"});
            return;
        }

        res.status(200).json(rows);
    } catch (err) {
        // Handle other errors
        console.error('Error retrieving member:', err.message);
        res.status(500).json({message: `ERROR 500: An error occurred while retrieving member with the given id#${id}.`});
    }
}

const loginValidation = async (req, res) => {
    const memberId = req.query.id;
    const memberPassword = req.query.password;
    console.log(req.query);
    
    try {
        const { rows } = await pool.query(queries.getMemberById, [memberId]);
        // console.log(rows);

        if (rows.length < 1) {
            req.session.memberId = undefined;
            res.status(404).json({message: "Error 404: Member does not exist"});
            return;
        }

        if (memberPassword !== rows[0].password) {
            req.session.memberId = undefined;
            res.status(400).json({message: "Error 400: Incorrect password"});
            return;
        }

        req.session.memberId = rows[0].member_id;
        console.log(req.session.memberId);
        res.status(200).json({message: "Exists"});
    } catch (err) {
        // Handle other errors
        console.error('Error logging in:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while loggin in.'});
    }
}

const addMember = async (req, res) => {
    const {member_email, password, first_name, last_name, DOB, street, city, province, postal_Code, card_number, cvv, expiry_date} = req.body;

    try {
        const {rows} = await pool.query(queries.checkIfEmailExists, [member_email]);
        console.log(rows);

        if (rows.length > 0) {
            res.status(409).json({message: "Error 409: Member with the email address already exists"});
            return;
        }

        await pool.query(queries.addMember, [member_email, password, first_name, last_name, DOB, street, city, province, postal_Code, card_number, cvv, expiry_date]);
        res.status(200).json({message: "Successfully added member"});
    } catch (err) {
        // Handle other errors
        console.error('Error adding member:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred adding member.'});
    }
}

const updateMember = async (req, res) => {
    const {member_email, password, first_name, last_name, DOB, street, city, province, postal_Code, card_number, cvv, expiry_date, member_id} = req.body;

    try {
        // const {rows} = await pool.query(queries.checkIfEmailExists, [member_email]);
        // console.log(rows);

        // if (rows.length > 0) {
        //     res.status(409).json({message: "Error 409: Member with the email address already exists"});
        //     return;
        // }

        const result = await pool.query(queries.updateMember, [member_email, password, first_name, last_name, DOB, street, city, province, postal_Code, card_number, cvv, expiry_date, member_id]);
        console.log([member_email, password, first_name, last_name, DOB, street, city, province, postal_Code, card_number, cvv, expiry_date, member_id]);
        if (result.rowCount < 1) {
            res.status(404).json({message: "Error 404: Unable to update member"});
            return;
        }
        
        res.status(200).json({message: "Successfully updated member"});
    } catch (err) {
        // Handle other errors
        if (err.code === '23505') {
            // Handle unique constraint violation error
            console.error('Unique constraint violation:', err.detail);
            res.status(409).json({message: 'ERROR 409: Given email already exists.'});
        } else {
            console.error('Error updating member:', err.message);
            res.status(500).json({message: 'ERROR 500: An error occurred updating member.'});
        }
        
    }
}

const getFitnessGoals = async (req, res) => {
    const id = req.query.id;

    try {
        const { rows } = await pool.query(queries.getFitnessGoals, [id]);

        if (rows.length < 1) {
            res.status(404).json({message: "Error 404: Fitness goals for member does not exist"});
            return;
        }

        res.status(200).json(rows);
    } catch (err) {
        // Handle other errors
        console.error('Error retrieving Fitness goals for member:', err.message);
        res.status(500).json({message: `ERROR 500: An error occurred while retrieving Fitness goals for member with the given id#${id}.`}); 
    }
}

const addFitnessGoals = async (req, res) => {
    const {start_date, target_date, goal_type, goal_target, member_id} = req.body;

    try {
        await pool.query(queries.addFitnessGoals, [start_date, target_date, goal_type, goal_target, member_id]);
        res.status(200).json({message: "Successfuly added fitness goals"});
    } catch (err) {
         // Handle other errors
         console.error('Error adding fitness goals:', err.message);
         res.status(500).json({message: `ERROR 500: An error occurred while adding fitness goals.`}); 
    }
}

const getAllTrainingSessionsForMember = async (req, res) => {
    const id = req.query.id;

    try {
        const {rows} = await pool.query(queries.getAllTrainingSessionsForMember, [id]);
        res.status(200).json(rows);
    } catch (err) {
        // Handle other errors
        console.error('Error getting training session:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while getting training session.'});
    }
}

const getAllGroupTrainingSessions = async (req, res) => {
    try {
        const {rows} = await pool.query(queries.getAllGroupTrainingSessions);
        res.status(200).json(rows);
    } catch (err) {
        // Handle other errors
        console.error('Error getting training session:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while getting training session.'});
    }
}

const createSession = async (req, res) => {
    const {date, start_time, end_time, session_type, trainer_id, room_id, member_id} = req.body;

    try {
        const {rows} = await pool.query(queries.getTrainingSessions, [date, start_time, member_id]);
        console.log(rows.length);
        
        if (rows.length > 0) {
            res.status(409).json({message: `Error 409: You already have a training session in ${date} at ${start_time}`});
            return;
        }

        const result = await pool.query(queries.createSession, [date, start_time, end_time, session_type, trainer_id, room_id]);

        await pool.query(queries.addToMembersSchedule, [member_id, result.rows[0].session_id]);
        res.status(200).json({message: "Successfully created training session"});
    } catch (err) {
        // Handle other errors
        console.error('Error creating training session:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while creating training session.'});
    }
}

const updateSession = async (req, res) => {
    const {session_id, date, start_time, end_time, session_type, trainer_id, room_id} = req.body;

    try {
        const results = await pool.query(queries.updateSession, [session_id, date, start_time, end_time, session_type, trainer_id, room_id]);

        if (results.rowCount < 1) {
            res.status(404).json({message: 'Error 404: Unable to update group session'});
            return;
        }

        res.status(200).json({message: 'Successfully updated group session'});
    } catch (err) {
        // Handle other errors
        console.error('Error updating training session:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while updating training session.'});
    }
}

const addGroupSession = async (req, res) => {
    const {member_id, session_id} = req.body;

    try {
        await pool.query(queries.addToMembersSchedule, [member_id, session_id]);
        res.status(200).json({message: "Successfully added to group session"});
    } catch (err) {
        // Handle other errors
        console.error('Error adding to group session:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while adding to group session.'});
    }
}

const getAvailableTrainers = async (req, res) => {
    let date, startTime, endTime; 
    date = req.query.date; 
    startTime = req.query.startTime; 
    endTime = req.query.endTime;

    startTime = new Date(date+'T' + startTime); 
    endTime   = new Date(date+'T' + endTime); 

    try {
        let {rows} = await pool.query(queries.trainerBreakForTheDay, [date]); 

        let trainers = {};

        rows.forEach(i => {
            let timeConflict = queries.timeConflict(date, startTime, endTime, new Date(date+'T' + i.break_start), new Date(date+'T' + i.break_end));
            console.log(timeConflict + " for trainer#" +i.trainer_id);
            if (timeConflict !== 'No Conflict') {
                trainers[i.trainer_id] = i.trainer_id;
                // console.log(i.name + " is unavailable");
            }
        });

        let result = await pool.query(queries.getAllTrainingSessions, [date]);

        // console.log(result.rows);

        result.rows.forEach(i => {
            let timeConflict = queries.timeConflict(date, startTime, endTime, new Date(date+'T' + i.start_time), new Date(date+'T' + i.end_time));
            // console.log(timeConflict);
            if (timeConflict !== 'No Conflict') {
                trainers[i.trainer_id] = i.trainer_id;
                // console.log(i.name + " is unavailable");
            }
        });

        result = await pool.query(queries.getTrainerWithMaxSessions, [date]);

        result.rows.forEach(i => {
            trainers[i.trainer_id] = i.trainer_id;
        });

        result = await pool.query(queries.getAllTrainers);
        
        let availableTrainers = [];

        result.rows.forEach(i => {
            if (!trainers[i.trainer_id]) {
                availableTrainers.push(i);
            }

            // console.log(trainers[i.trainer_id]);
        });

        

        // console.log(availableTrainers);

        res.status(200).json(availableTrainers);
    } catch (err) {
        // Handle other errors
        console.error('Error retirieving available trainers:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while retirieving available trainers.'});
    }
}

const getAvailableRooms = async (req, res) => {
    const date = req.query.date; 

    try {
        const {rows} = await pool.query(queries.getAvailableAllRooms, [date]);

        res.status(200).json(rows);
    } catch (err) {
        // Handle other errors
        console.error('Error retirieving available rooms:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while retirieving available rooms.'});
    }
}

const getMemberIdInSession = async (req, res) => {
    if(!req.session.memberId) {
        res.status(400).json({message: "Error 400: No valid member in the session"});
        return;
    }

    res.status(200).json({memberId: req.session.memberId});
}

module.exports = {
    initPage,

    getMemberById,
    loginValidation,
    addMember,
    updateMember,
    getFitnessGoals,
    addFitnessGoals,
    getAllTrainingSessionsForMember,
    getAllGroupTrainingSessions,
    createSession,
    updateSession,
    addGroupSession,
    getAvailableTrainers,
    getAvailableRooms,
    getMemberIdInSession
};