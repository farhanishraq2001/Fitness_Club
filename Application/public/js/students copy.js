var students = null;
//Initialize the page on load
window.addEventListener('load', initializePage);

//Intializaes page with event listners
function initializePage(){
    let showStudents = document.getElementById("btnShowStudents");
    
    let addStudent = document.getElementById("btnAddStudents");
    let hideAddBtn = document.getElementById("btnHideAdd");
    let submitAddBtn = document.getElementById("btnSubmitAdd");
    
    let emailChangeBtn = document.getElementById("btnChangeEmail");
    let hideEmailBtn = document.getElementById("btnHideEmail");
    let submitEmailBtn = document.getElementById("btnSubmitEmail");

    emailChangeBtn.addEventListener('click', () => {showForm(event, "emailChange")});
    emailChangeBtn.addEventListener('click', () => {hideForm(event, "addStudent")});
    hideEmailBtn.addEventListener('click', () => {hideForm(event, "emailChange")});
    submitEmailBtn.addEventListener('click', emailChangeSubmit);
    
    addStudent.addEventListener('click', () => {showForm(event, "addStudent")});
    addStudent.addEventListener('click', () => {hideForm(event, "emailChange")});
    hideAddBtn.addEventListener('click', () => {hideForm(event, "addStudent")});
    submitAddBtn.addEventListener('click', addStudentSubmit);

    showStudents.addEventListener('click', getAllStudents);
}

// Gets all the students by making a GET request to the REST api created
function getAllStudents(){
    fetch('http://localhost:3000/students/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => populateStudents(data))
    .catch(error => console.error('Error:', error));
}

function populateStudents(students) {
    console.log(students);

    let table = document.querySelector("table");
    console.log(table);
    table.innerHTML = `<tr>
                            <th>Student ID</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Email</th>
                            <th>Enrollment Date</th>
                        </tr>`;
    console.log(table);

    // Iterate through all the objects in the students array
    for(let student of students){
        // Save the information for the current in variables
        let studentID = student.student_id;
        let firstName = student.first_name;
        let lastName = student.last_name;
        let email = student.email;
        let enrollmentDate = "N/A"; 
        
        if (student.enrollment_date != null) {
            enrollmentDate = student.enrollment_date;
            const indexOfT = enrollmentDate.indexOf('T');
            const dateWithoutTime = enrollmentDate.substring(0, indexOfT);
            enrollmentDate = dateWithoutTime;
        }
        
        let row = document.createElement("tr");
        row.id = studentID;

        let studentIdCell = document.createElement("td");
        studentIdCell.textContent = studentID;
        row.appendChild(studentIdCell);

        let fNameCell = document.createElement("td");
        fNameCell.textContent = firstName;
        row.appendChild(fNameCell);

        let lNameCell = document.createElement("td");
        lNameCell.textContent = lastName;
        row.appendChild(lNameCell);

        let emailCell = document.createElement("td");
        emailCell.textContent = email;
        row.appendChild(emailCell);

        let enrollmentDateCell = document.createElement("td");
        enrollmentDateCell.textContent = enrollmentDate;
        row.appendChild(enrollmentDateCell);

        let deleteBtn = `<td onclick="deleteStudent(${studentID})" class="deleteBtn">Delete</td>`
        row.innerHTML += deleteBtn;

        // Append the row to the table
        let validation = document.getElementById(studentID);
        table.appendChild(row);
    }
}

// Adds to student DB by making a POST request to the REST api created
function addStudentSubmit(e) {
    e.preventDefault();
    
    const fName = document.getElementById("fname").value.trim();
    const lName = document.getElementById("lname").value.trim();
    const email = document.getElementById("email").value.trim();
    const enrollmentDate = document.getElementById("enrollmentDate").value.trim();
    
    const studentObj = {
        first_name: fName,
        last_name: lName,
        email: email,
        enrollment_date: enrollmentDate
    }
    
    const emptyVal = unfilledForm(studentObj);
    if (emptyVal == true) {
        console.log("New Student to be added");
        console.log(studentObj)
        fetch('http://localhost:3000/students/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentObj)
        })
        .then(response => {
            if(!response.ok) {
                return response.json().then(message => {
                    window.alert(message.message);
                });
            }

            getAllStudents();
            return response.json().then(message => {
                window.alert(message.message);
            });
        })
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    } else {
        window.alert("Form not filled");
    }
}

// Changes student email by making a PUT request to the REST api created
function emailChangeSubmit(e) {
    e.preventDefault();

    const student_id = document.getElementById("studentId").value.trim();
    const email = document.getElementById("newEmail").value.trim();
    const newEmail = {
        email: email
    }
    console.log(newEmail);

    if (isNaN(parseInt(student_id))) {
        window.alert("Please enter a number for Student ID");
    } else if (email == null || email === "" || !email.includes("@")) {
        window.alert("Please enter a valid email address");
    } else {
        fetch(`http://localhost:3000/students/${student_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEmail)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(message => {
                    window.alert(message.message);
                    throw new Error(message.message);
                });
            }

            getAllStudents();
            return response.json().then(message => {
                window.alert(message.message);
            });
        })
        .then(data => console.log(data.message))
        .catch(error => console.error('Error:', error));
    }
    
    console.log(student_id + " " +email);
}

// Deletes student from DB by making a DELETE request to the REST api created
function deleteStudent(studentId) {
    console.log(studentId);

    fetch(`http://localhost:3000/students/${studentId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(message => {
                window.alert(message.message);
                throw new Error(message.message);
            });
        }

        getAllStudents();
        return response.json().then(message => {
            window.alert(message.message);
        });
    })
    .catch(error => console.error('Error:', error));
}

/*Helper functions*/
function unfilledForm(obj) {
    for (var key in obj) {
        // console.log(obj[key])
        if (obj[key] === null || obj[key] === "") {
            // console.log("Empty Value for " + key + ": "+obj[key]);
            return false;
        }
            
    }
    return true;
}

function showForm(e, formId) {
    e.preventDefault();
    let form = document.getElementById(formId);

    if (form.style.display === "none") {
        console.log("Invisible");
        form.style.display = "block";
    }
}

function hideForm(e, formId) {
    e.preventDefault();
    let form = document.getElementById(formId);

    if (form.style.display === "block") {
        // console.log("Invisible");
        form.style.display = "none";
    }
}
