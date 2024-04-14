const pool = require('../../db');
const queries = require('../queries/admin-queries');
const path = require('path');
const fs = require("fs");

// URL handlers
const loginValidation = async (req, res) => {
    const adminId = req.query.id;
    const adminPassword = req.query.password;
    console.log(req.query);
    
    try {
        const { rows } = await pool.query(queries.getAdminById, [adminId]);
        // console.log(rows);

        if (rows.length < 1) {
            req.session.adminId = undefined;
            res.status(404).json({message: "Error 404: Admin does not exist"});
            return;
        }

        if (adminPassword !== rows[0].password) {
            req.session.adminId = undefined;
            res.status(400).json({message: "Error 400: Incorrect password"});
            return;
        }

        req.session.adminId = adminId;
        res.status(200).json({message: "Exists"});
    } catch (err) {
        // Handle other errors
        console.error('Error logging in:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while loggin in.'});
    }
}

const getAdminIdInSession = async (req, res) => {
    if(!req.session.adminId) {
        res.status(400).json({message: "Error 400: No valid admin in the session"});
        return;
    }

    res.status(200).json({adminId: req.session.adminId});
}

const getRoomCleaning = async (req, res) => {
    try {
        const {rows} = await pool.query(queries.getRoomCleaning);

        res.status(200).json(rows);
    } catch (err) {
        // Handle other errors
        console.error('Error retrieving rooms booked for cleaning:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while retrieving rooms booked for cleaning.'});
    }
}

const addRoomCleaning = async (req, res) => {
    const {date, room_id} = req.body;

    try {
        const {rows} = await pool.query(queries.getRoomCleaningByDate, [date, room_id]);

        if (rows.length > 0) {
            res.status(409).json({message: 'Error 409: Room is already booked for cleaning for the given date'});
            return;
        }

        await pool.query(queries.addRoomCleaning, [date, room_id]);
        res.status(200).json({message: "Successfully booked room for cleaning"});
    } catch (err) {
        // Handle other errors
        console.error('Error booking room for cleaning:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while booking room for cleaning.'});
    }
}

const deleteRoomCleaning = async (req, res) => {
    const {room_cleaning_id} = req.body;

    try {
        const results = await pool.query(queries.deleteRoomCleaning, [room_cleaning_id])

        if (results.rowCount < 1) {
            res.status(404).json({message: 'Error 404: Unable to delete rooming cleaning'});
            return;
        }

        res.status(200).json({message: 'Successfully deleted rooming cleaning.'});
    } catch (err) {
        // Handle other errors
        console.error('Error deleting room for cleaning:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while deleting room for cleaning.'});
    }
}

const getAvailableTrainers = async (req, res) => {
    let {date, startTime, endTime} = req.body;

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
    const {date} = req.body;

    try {
        const {rows} = await pool.query(queries.getAvailableAllRooms, [date]);

        res.status(200).json(rows);
    } catch (err) {
        // Handle other errors
        console.error('Error retirieving available rooms:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while retirieving available rooms.'});
    }
}

const createSession = async (req, res) => {
    const {date, start_time, end_time, session_type, trainer_id, room_id} = req.body;

    try {
        const {rows} = await pool.query(queries.getTrainingSessions, [date, start_time, trainer_id]);
        console.log(rows.length);
        
        if (rows.length > 0) {
            res.status(409).json({message: `Error 409: Training session in ${date} at ${start_time} with trainer#${trainer_id} already exists`});
            return;
        }

        await pool.query(queries.createSession, [date, start_time, end_time, session_type, trainer_id, room_id]);
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
        console.error('Error updating group session:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while updating group session.'});
    }
}

const showTrainingSessions = async (req, res) => {
    try {
        const {rows} = await pool.query(queries.showTrainingSessions);

        res.status(200).json(rows);
    } catch (err) {
        // Handle other errors
        console.error('Error retrieving training sessions:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while retrieving training sessions.'});
    }
}

const unpaidMemberShipFee = async (req, res) => {
    const year = req.query.year;
    const month = req.query.month;
    // console.log(req.query);
    
    try {
        const {rows} = await pool.query(queries.unpaidMemberShipFee, [year, month]);

        res.status(200).json(rows);
    } catch (err) {
        // Handle other errors
        console.error('Error retrieving unpaid Membership Fee:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while retrieving unpaid Membership Fee.'});
    }
}
const unpaidTrainingFee = async (req, res) => {
    try {
        const {rows} = await pool.query(queries.unpaidTrainingFee);

        res.status(200).json(rows);
    } catch (err) {
        // Handle other errors
        console.error('Error retrieving unpaid training Fee:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while retrieving unpaid training Fee.'});
    }
}

const addToBilling = async (req, res) => {
    let {type, date_paid, paid_by, session_id} = req.body;

    if (session_id == undefined) {
        session_id = null;
    }

    try {
        await pool.query(queries.addToBilling, [type, date_paid, paid_by, session_id]);
        res.status(200).json({message: "Successfully added to Billing"});
    } catch (err) {
        // Handle other errors
        console.error('Error adding to Billing:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while adding to Billing.'});
    }

    console.log(session_id);
}

module.exports = {
    loginValidation,
    getAdminIdInSession,
    getRoomCleaning,
    addRoomCleaning,
    deleteRoomCleaning,
    getAvailableTrainers,
    getAvailableRooms,
    createSession,
    updateSession,
    showTrainingSessions,
    unpaidMemberShipFee,
    unpaidTrainingFee,
    addToBilling
};