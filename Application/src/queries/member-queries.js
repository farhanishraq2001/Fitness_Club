// Predefined SQL queries with to be used in the trainer-controller.js
// Variables (e.g., $1) are passed in as parametes from controller.js
const getMemberById = "SELECT * FROM members WHERE member_email = $1";
const getMemberById2 = "SELECT * FROM members WHERE member_id = $1";
const checkIfEmailExists = `SELECT * FROM members WHERE member_email=$1`;
const addMember =  `INSERT INTO Members (member_email, password, first_name, last_name, DOB, street, city, province, postal_Code, card_number, cvv, expiry_date)
                    VALUES 
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`
const updateMember = `
                    UPDATE Members
                    SET 
                        member_email = $1,
                        password = $2,
                        first_name = $3,
                        last_name = $4,
                        DOB = $5,
                        street = $6,
                        city = $7,
                        province = $8,
                        postal_Code = $9,
                        card_number = $10,
                        CVV = $11,
                        expiry_date = $12
                    Where member_id = $13;`;
const getFitnessGoals = `SELECT * FROM fitness_goals WHERE member_id=$1;`
const addFitnessGoals = `INSERT INTO fitness_goals (start_date, target_date, goal_type, goal_target, member_id)
                        VALUES
                        ($1, $2, $3, $4, $5);`;
const getTrainingSessions = `SELECT *
                            FROM training_sessions t
                            LEFT JOIN members_schedule m
                                ON m.session_id=t.session_id
                            WHERE date=$1 AND start_time=$2 AND member_id=$3;`;
const getAllTrainingSessionsForMember = `SELECT *
                                FROM training_sessions t
                                LEFT JOIN members_schedule m
                                    ON m.session_id=t.session_id
                                WHERE member_id=$1;`;  
const createSession = `INSERT INTO training_sessions(date, start_time, end_time, session_type, trainer_id, room_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING session_id`;
const updateSession =  `UPDATE training_sessions
                        SET date=$2, start_time=$3, end_time=$4, session_type=$5, trainer_id=$6, room_id=$7
                        WHERE session_id=$1;`;
const addToMembersSchedule = `INSERT INTO members_schedule(member_id, session_id) VALUES ($1, $2) RETURNING session_id`;
const getAllGroupTrainingSessions = `SELECT * FROM training_sessions WHERE session_type='group'`;

const trainerBreakForTheDay = `SELECT * FROM trainers_schedule WHERE date=$1`;
const getAllTrainingSessions = `SELECT ts.*
                                FROM training_sessions ts
                                JOIN (
                                    SELECT trainer_id
                                    FROM training_sessions
                                    WHERE date = $1
                                    GROUP BY trainer_id
                                    HAVING COUNT(*) <= 1
                                ) AS filtered_trainers ON ts.trainer_id = filtered_trainers.trainer_id;`;
const getTrainerWithMaxSessions =  `SELECT ts.*
                                    FROM training_sessions ts
                                    JOIN (
                                        SELECT trainer_id
                                        FROM training_sessions
                                        WHERE date = $1
                                        GROUP BY trainer_id
                                        HAVING COUNT(*) > 1
                                    ) AS filtered_trainers ON ts.trainer_id = filtered_trainers.trainer_id;`;
const getAllTrainers = `SELECT trainer_id, first_name, last_name FROM trainers;`;
const getAvailableAllRooms =   `SELECT t.room_id, t.room_name 
                                FROM rooms t
                                LEFT JOIN room_cleaning c
                                    ON t.room_id=c.room_id
                                WHERE date <> $1 OR date IS NULL
                                ORDER BY t.room_id ASC;`;

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
    getMemberById,
    getMemberById2,
    checkIfEmailExists,
    addMember,
    updateMember,
    getFitnessGoals,
    addFitnessGoals,
    getTrainingSessions,
    createSession,
    updateSession,
    addToMembersSchedule,
    getAllTrainingSessionsForMember,
    getAllGroupTrainingSessions,
    getAllTrainingSessions,

    trainerBreakForTheDay,
    getTrainerWithMaxSessions,
    getAllTrainers,
    getAvailableAllRooms,

    timeConflict
};