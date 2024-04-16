// Predefined SQL queries with to be used in the controller.js
// Variables (e.g., $1) are passed in as parametes from controller.js
const getAllStudents = "SELECT * FROM trainers ORDER BY trainer_id";
const getStudentByEmail = "SELECT * FROM trainers WHERE trainer_id = $1";
const addStudent = "INSERT INTO students (first_name, last_name, email, enrollment_date) VALUES ($1, $2, $3, $4)";
const updateStudentEmail = "UPDATE students SET email = $1 WHERE student_id = $2";
const deleteStudent = "DELETE FROM students WHERE student_id = $1";

// module.exports = {
//     getTrainerById,
//     getAllStudents,
//     getStudentByEmail,
//     addStudent,
//     updateStudentEmail,
//     deleteStudent,
// };

// Predefined SQL queries with to be used in the trainer-controller.js
// Variables (e.g., $1) are passed in as parametes from controller.js
const getAdminById = "SELECT * FROM admins WHERE admin_id = $1";
const getRoomCleaning = `SELECT * FROM Room_cleaning;`
const addRoomCleaning = `INSERT INTO Room_cleaning (date, room_id) VALUES ($1, $2);`
const deleteRoomCleaning = `DELETE FROM Room_cleaning WHERE room_cleaning_id=$1`; 
const getRoomCleaningByDate =   `SELECT * 
                                FROM Room_cleaning
                                WHERE date=$1 and room_id=$2;`;
                                
const trainerBreakForTheDay = `SELECT * FROM trainers_schedule WHERE date=$1`;
const getAllTrainers = `SELECT trainer_id, first_name, last_name FROM trainers;`;
const getAvailableAllRooms =   `SELECT t.room_id, t.room_name 
                                FROM rooms t
                                LEFT JOIN room_cleaning c
                                    ON t.room_id=c.room_id
                                WHERE date <> $1 OR date IS NULL
                                ORDER BY t.room_id ASC;`;
const createSession = `INSERT INTO training_sessions(date, start_time, end_time, session_type, trainer_id, room_id) VALUES ($1, $2, $3, $4, $5, $6)`;
const updateSession =  `UPDATE training_sessions
                        SET date=$2, start_time=$3, end_time=$4, session_type=$5, trainer_id=$6, room_id=$7
                        WHERE session_id=$1;`;
const showTrainingSessions = `SELECT * FROM training_sessions`;
const getTrainingSessions = `SELECT * 
                            FROM training_sessions
                            WHERE date=$1 AND start_time=$2 AND trainer_id=$3;`;
const getAllTrainingSessions = `SELECT ts.*
                                FROM training_sessions ts
                                JOIN (
                                    SELECT trainer_id
                                    FROM training_sessions
                                    WHERE date = $1
                                    GROUP BY trainer_id
                                    HAVING COUNT(*) <= 1
                                ) AS filtered_trainers ON ts.trainer_id = filtered_trainers.trainer_id;
                                WHERE date = $1`;
const getTrainerWithMaxSessions = `SELECT ts.*
                                FROM training_sessions ts
                                JOIN (
                                    SELECT trainer_id
                                    FROM training_sessions
                                    WHERE date = $1
                                    GROUP BY trainer_id
                                    HAVING COUNT(*) > 1
                                ) AS filtered_trainers ON ts.trainer_id = filtered_trainers.trainer_id;`;       
const unpaidMemberShipFee = `SELECT *
                            FROM members m
                            WHERE NOT EXISTS (
                                SELECT *
                                FROM billing b
                                WHERE m.member_id = b.paid_by
                                AND b.type = 'membership_fee'
                                AND EXTRACT(YEAR FROM b.date_paid) = $1
                                AND EXTRACT(MONTH FROM b.date_paid) = $2
                            );`   
const unpaidTrainingFee =  `SELECT ms.*, m.*
                            FROM Members_schedule ms
                            LEFT JOIN billing b ON ms.session_id = b.session_id
                            LEFT JOIN Members m ON ms.member_id = m.member_id
                            WHERE b.billing_id IS NULL;`      
const addToBilling = `INSERT INTO billing (type, date_paid, paid_by, session_id) VALUES ($1, $2, $3, $4);`                

//Helper Functions
const timeConflict = (date, start1, end1, start2, end2) => {
    // Convert time strings to Date objects

    // console.log(date + ' ' + start1 + ' ' + end1 + ' ' + start2 + ' ' + end2)
    const startTime1 = (start1);
    const endTime1 = (end1);
    const startTime2 = (start2);
    const endTime2 = (end2);
    

    // console.log(startTime1 < endTime2)


    // Check for overlap
    if (startTime1 < endTime2 && endTime1 > startTime2) {
        if (startTime1 >= startTime2 && endTime1 <= endTime2) {
            // full time conflict: Range 1 is fully within Range 2
            return 'full time conflict';
        } else if (startTime1 <= startTime2 && endTime1 >= endTime2) {
            // full time conflict: Range 2 is fully within Range 1
            return 'full time conflict';
        } else {
            // partial time conflict: Ranges overlap partially
            return 'partial time conflict';
        }
    } else {
        // No Conflict: Ranges do not overlap
        return 'No Conflict';
    }
}

module.exports = {
    getAdminById,
    getRoomCleaning,
    addRoomCleaning,
    deleteRoomCleaning,
    getRoomCleaningByDate,
    trainerBreakForTheDay,
    getAllTrainers,
    getAvailableAllRooms,
    createSession,
    updateSession,
    getTrainingSessions,
    getAllTrainingSessions,
    getTrainerWithMaxSessions,
    showTrainingSessions,
    unpaidMemberShipFee,
    unpaidTrainingFee,
    addToBilling,

    timeConflict,
};