const pool = require('../../db');
const queries = require('../queries/trainer-queries');
const path = require('path');
const fs = require("fs");

// URL handlers
// URL hanlder to retrieve all the students from the DB
const getAllStudents = async (req, res) => {
    let htmlFile = path.join(__dirname + '../../../public/'+ 'index.html');

    if (req.accepts('html')) { // If request is html
        if (!fs.existsSync(htmlFile)) {
            // Send 404 response if html file is missing
            res.status(404).json({message: 'ERROR 404: HTML file not found.'});
            return;
        }
        // Send html file in response
        res.status(200).sendFile(path.join(__dirname + '../../../public/'+ 'index.html'));        
    } else if (req.accepts('json')) { // If request is json
        try {
            // Get students from DB
            const results = await pool.query(queries.getAllStudents);
            // Send student data to server
            res.status(200).set("Content-Type", "application/json").json(results.rows);
        } catch (err) {
            // Handle server connection error
            res.status(500).json({message: 'ERROR 500: Server Error'});
        }
    }    
}

const getTrainerById = async (req, res) => {
    const id = parseInt(req.params.id);
    // const { rows } = await pool.query(queries.getTrainerById, [id]);
    // if (req.session) {
    //     console.log("REQ. ")
    // }
        
    // req.session.trainerId = id;
    // res.status(200).json(rows);
    // console.log(req.session.trainerId);

    console.log(id);

    try {
        const { rows } = await pool.query(queries.getTrainerById, [id]);

        if (rows.length < 1) {
            req.session.trainerId = undefined;
            res.status(404).json({message: "Error 404: Trainer does not exist"});
            return;
        }

        req.session.trainerId = id;
        res.status(200).json({message: "Exists"});
    } catch (err) {
        // Handle other errors
        console.error('Error logging in:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while loggin in.'});
    }
}

const loginValidation = async (req, res) => {
    const trainerId = req.query.id;
    const trainerPassword = req.query.password;
    console.log(req.query);
    
    try {
        const { rows } = await pool.query(queries.getTrainerById, [trainerId]);
        // console.log(rows);

        if (rows.length < 1) {
            req.session.trainerId = undefined;
            res.status(404).json({message: "Error 404: Trainer does not exist"});
            return;
        }

        if (trainerPassword !== rows[0].password) {
            req.session.trainerId = undefined;
            res.status(400).json({message: "Error 400: Incorrect password"});
            return;
        }

        req.session.trainerId = trainerId;
        res.status(200).json({message: "Exists"});
    } catch (err) {
        // Handle other errors
        console.error('Error logging in:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while loggin in.'});
    }
}

const getTrainerIdInSession = async (req, res) => {
    if(!req.session.trainerId) {
        res.status(400).json({message: "Error 400: No valid trainer in the session"});
        return;
    }

    res.status(200).json({trainerId: req.session.trainerId});
}

const addUnavailableTime = async (req, res) => {
    const {trainer_id, date, break_start, break_end, break_type} = req.body;

    try {
        const {rows} = await pool.query(queries.trainerBreakForTheDay, [trainer_id, date]);

        if (rows.length > 1) {
            res.status(403).json({message: "Error 403: Cannot add more unavailable times"});
            return;
        }

        const startTime = new Date(date+'T' + break_start); 
        const endTime   = new Date(date+'T' + break_end); 
        // console.log(startTime > endTime);
        
        if (rows.length == 1) {
            if (rows[0].break_type === break_type) {
                res.status(409).json({message: `ERROR 409: You have already taken a break for ${break_type}`});
                return;
            }

            let timeConflict = queries.timeConflict(date, startTime, endTime, new Date(date+'T' +rows[0].break_start), new Date(date+'T' +rows[0].break_end));
            console.log(timeConflict);
            if (timeConflict === 'No Conflict') {
                await pool.query(queries.addUnavailableTime, [trainer_id, date, break_start, break_end, break_type])
                res.status(200).json(rows);
                return;
            }

            res.status(409).json({message: `Error 409: This is a ${timeConflict} between your breaks`});
            return;
        }
        await pool.query(queries.addUnavailableTime, [trainer_id, date, break_start, break_end, break_type])
        res.status(200).json(rows);
    } catch (err) {
        // Handle other errors
        console.error('Error adding unavailable times:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while adding unavailable times.'});
    }
}

const updateUnavailableTime = async (req, res) => {
    const {break_start, break_end, id} = req.body;

    try {
        const results = await pool.query(queries.updateUnavailableTime, [break_start, break_end, id]);

        if (results.rowCount < 1) {
            res.status(404).json({message: 'Error 404: Unable to update unavaiable time'});
            return;
        }

        res.status(200).json({message: 'Successfully updated unavaiable time'});
    } catch (err) {
        // Handle other errors
        console.error('Error updating unavailable times:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while updating unavailable time.'});
    }
}

const deleteUnavailableTime = async (req, res) => {
    const id = parseInt(req.params.id);

    console.log(id);

    try {
        const results = await pool.query(queries.deleteUnavailableTime, [id]);
        // console.log(results.rowCount);

        if (results.rowCount < 1) {
            res.status(404).json({message: 'Error 404: Unable to delete unavaiable time'});
            return;
        }

        res.status(200).json({message: 'Successfully deleted unavailable time'});
    } catch (err) {
        // Handle other errors
        console.error('Error deleting unavailable times:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while deleting unavailable time.'});
    }
}

const getAllMembers = async (req, res) => {
    try {
        const {rows} = await pool.query(queries.getAllMembers);

        if (rows.length < 1) {
            res.status(404).json({message: "Error 404: No members exist"});
            return;
        }

        res.status(200).json(rows);
    } catch (err) {
        // Handle other errors
        console.error('Error retrieving members:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while retrieving members.'});
    }
}

const getMembersByName = async (req, res) => {
    const first_name = req.query.fName;
    const last_name = req.query.lName;
    console.log(req.query);

    try {
        const { rows } = await pool.query(queries.getMembersByName, [first_name, last_name]);

        if (rows.length < 1) {
            res.status(404).json({message: "Error 404: No members with the given first and last name exist"});
            return;
        }

        res.status(200).json(rows);
    } catch (err) {
        // Handle other errors
        console.error('Error retrieving member:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while retrieving member with the given first and last name.'});
    }
}

const getEquipmentMaintenance = async (req, res) => {
    try {
        const {rows} = await pool.query(queries.getEquipmentMaintenance);

        if (rows.length < 1) {
            res.status(404).json({message: 'Error 404: No equipment found for maintenance'});
            return;
        }

        res.status(200).json(rows);
    } catch (err) {
        // Handle other errors
        console.error('Error retrieving equipment:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while retrieving equipment for maintenance.'});
    }
}

const updateEquipment = async (req, res) => {
    const {trainer_id, equipment_id} = req.body;

    try {
        const result = await pool.query(queries.updateEquipment, [trainer_id, equipment_id]);
        
        if (result.rowCount < 1) {
            res.status(404).json({message: 'Error 404: Unable to update equipment maintenance'});
            return;
        }

        res.status(200).json({message: 'Successfully updated last maintained date for equipment'});
    } catch (err) {
        // Handle other errors
        console.error('Error updating equipment:', err.message);
        res.status(500).json({message: 'ERROR 500: An error occurred while updating equipment for maintenance.'});
    }
}

// URL hanlder to add a student to the DB
const addStudent = async (req, res) => {
    const {first_name, last_name, email, enrollment_date} = req.body;
    //Check if attributes are missing from request body
    if ((first_name && last_name && email) == null || undefined) {
        res.status(422).json({message: 'ERROR 422: Missing required attribute. Please provide all required attributes.'});
        return;
    }
    
    try {
        // Check if student with same email exists 
        const { rows } = await pool.query(queries.getStudentByEmail, [email]);// email parameter passed in
        // Send bad response if student with same email exists 
        if (rows.length > 0) {
            res.status(409).json({message: 'ERROR 409: Given email already exists.'});
            return;
        }
        // Perform the add operation
        await pool.query(queries.addStudent, [first_name, last_name, email, enrollment_date]); // first_name, last_name, email, enrollment_date parameter passed in
        // Send a success response
        res.status(201).json({message: 'Student successfully added'});
    } catch (err) {
        // Handle different types of errors
        if (err.code === 'ENOTFOUND') {
            // Handle database connection error
            console.error('Database connection error:', err.message);
            res.status(500).json({message: 'ERROR 500: Database connection error.'});
        } else if (err.code === '23505') {
            // Handle unique constraint violation error
            console.error('Unique constraint violation:', err.detail);
            res.status(409).json({message: 'ERROR 409: Given email already exists.'});
        } else if (err.code === '22P02') {
            // Handle invalid input syntax error
            console.error('Invalid input syntax:', err.message);
            res.status(422).json({message: 'ERROR 422: Invalid input syntax.'});
        } else if (err.code === '22007') {
            // Handle invalid input syntax error
           console.error('Invalid date format:', err.message);
           res.status(422).json({message: 'ERROR 422: Invalid date format. Please provide a date in the YYYY-MM-DD format.'});
        } else if (err.code === '22008') {
            // Handle invalid input syntax error
           console.error('Invalid date format:', err.message);
           res.status(422).json({message: 'ERROR 422: Invalid date format. Please provide a date in the YYYY-MM-DD format.'});
        } else if (err.code === '23502') {
             // Handle invalid input syntax error
            console.error('Missing required attribute:', err.message);
            res.status(422).json({message: 'ERROR 422: Missing required attribute. Please provide all required attributes.'});
        } else {
            // Handle other errors
            console.error('Error adding student:', err.message);
            res.status(500).json({message: 'ERROR 500: An error occurred while adding student.'});
        }
    }
}
// URL hanlder to update a student's email in the DB
const updateStudentEmail = async (req, res) => {
    const id = parseInt(req.params.id);
    const { email } = req.body;

    try {
        // Perform the update operation
        const result = await pool.query(queries.updateStudentEmail, [email, id]);// email and student_id parameter passed in 
        console.log(result);
        // Check if the update was successful
        if (result.rowCount < 1) {
            res.status(404).json({message: 'ERROR 404: Student not found.'});
            return;
        } 
        
        // Send a success response
        res.status(200).json({message: 'Student email succesfully updated'});
    } catch (err) {
        // Handle different types of errors
        if (err.code === 'ENOTFOUND') {
            // Handle database connection error
            console.error('Database connection error:', err.message);
            res.status(500).json({message: 'ERROR 500: Database connection error.'});
        } else if (err.code === '23505') {
            // Handle unique constraint violation error
            console.error('Unique constraint violation:', err.detail);
            res.status(409).json({message: 'ERROR 409: Given email already exists.'});
        } else if (err.code === '22P02') {
            // Handle invalid input syntax error
            console.error('Invalid input syntax:', err.message);
            res.status(422).json({message: 'ERROR 422: Invalid input syntax.'});
        } else {
            // Handle other errors
            console.error('Error updating student email:', err.message);
            res.status(500).json({message: 'ERROR 500: An error occurred while updating student email.'});
        }
    }
}
// URL hanlder to delete a student from the DB
const deleteStudent = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        // Perform the delete operation
        const result = await pool.query(queries.deleteStudent, [id]);// student_id parameter passed in
        console.log(result);
        // Check if the delete was successful
        if (result.rowCount < 1) {
            res.status(404).json({message: 'ERROR 404: Student not found'});
            return;
        }
        // Send a success response
        res.status(200).json({message: 'Student successfully deleted'});
    } catch (err) {
        // Handle different types of errors
        if (err.code === 'ENOTFOUND') {
            // Handle database connection error
            console.error('Database connection error:', err.message);
            res.status(500).json({message: 'ERROR 500: Database connection error'});
        } else {
            // Handle other errors
            console.error('Error deleting student:', err.message);
            res.status(500).json({message: 'ERROR 500: An error occurred while deleting the student'});
        }
    }
}

module.exports = {
    getTrainerById,
    loginValidation,
    getTrainerIdInSession,
    getAllMembers,
    getMembersByName,
    addUnavailableTime,
    updateUnavailableTime,
    deleteUnavailableTime,
    getEquipmentMaintenance,
    updateEquipment,

    getAllStudents,
    addStudent,
    updateStudentEmail,
    deleteStudent,
};