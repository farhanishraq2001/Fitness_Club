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
const getTrainerById = "SELECT * FROM trainers WHERE trainer_id = $1";
const getAllMembers = "SELECT * FROM members";
// const getMembersByName = "SELECT * FROM members WHERE first_name=$1 AND last_name=$2";
const getMembersByName =    `SELECT m.member_id, m.first_name, m.last_name, m.DOB, h.height, h.weight, h.body_fat 
                            FROM members m 
                            LEFT JOIN (
                                SELECT member_id, MAX(date) AS max_date
                                FROM health_metrics
                                GROUP BY member_id
                            ) AS latest_health ON m.member_id = latest_health.member_id
                            LEFT JOIN health_metrics as h ON h.member_id = latest_health.member_id AND h.date = latest_health.max_date
                            WHERE m.first_name=$1 AND m.last_name=$2;`
const addUnavailableTime =  `INSERT INTO Trainers_schedule (trainer_id, date, break_start, break_end, break_type)
                            VALUES 
                            ($1, $2, $3, $4, $5);`;
const trainerBreakForTheDay = `SELECT * FROM trainers_schedule WHERE trainer_id=$1 AND date=$2`;
const updateUnavailableTime = `UPDATE trainers_schedule SET break_start=CAST($1 AS TIME), break_end=CAST($2 AS TIME) WHERE trainer_schedule_id=$3`;
const deleteUnavailableTime = `DELETE FROM trainers_schedule WHERE trainer_schedule_id=$1`;
const getEquipmentMaintenance = `SELECT * FROM equipment_maintenance`;
const updateEquipment = `UPDATE Equipment_maintenance
                        SET last_maintained_date=CURRENT_DATE, trainer_id=$1
                        WHERE equipment_id=$2;`


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
    getTrainerById,
    getAllMembers,
    getMembersByName,
    addUnavailableTime,
    trainerBreakForTheDay,
    updateUnavailableTime,
    deleteUnavailableTime,
    getEquipmentMaintenance,
    updateEquipment,

    timeConflict,

    getAllStudents,
    getStudentByEmail,
    addStudent,
    updateStudentEmail,
    deleteStudent,
};