var students = null;
//Initialize the page on load
window.addEventListener('load', initializePage);

//Intializaes page with event listners
function initializePage(){
    let showStudents = document.getElementById("btnShowStudents");

    let btnLogin = document.getElementById("btnLogin");
    let btnSignUp = document.getElementById("btnSignUp");
    
    let addStudent = document.getElementById("btnSubmitAdd");
    // addStudent.addEventListener('click', () => {addMember(event)});
    addStudent.addEventListener('click', () => {addMember(event)});
    
    btnLogin.addEventListener('click', () => {showForm(event, "login")});
    btnLogin.addEventListener('click', () => {hideForm(event, "addMember")});
    // hideEmailBtn.addEventListener('click', () => {hideForm(event, "emailChange")});
    // submitEmailBtn.addEventListener('click', emailChangeSubmit);
    
    btnSignUp.addEventListener('click', () => {showForm(event, "addMember")});
    btnSignUp.addEventListener('click', () => {hideForm(event, "login")});

    let btnSubmitLogin = document.getElementById("btnSubmitLogin");
    btnSubmitLogin.addEventListener("click", ()=>{login(event)});
    // hideAddBtn.addEventListener('click', () => {hideForm(event, "addStudent")});

    let btnSubmitUpdate = document.getElementById("btnSubmitUpdate");
    btnSubmitUpdate.addEventListener('click', updateForm);

    let btnSubmitSearch = document.getElementById("btnSubmitSearch");
    btnSubmitSearch.addEventListener('click', searchSession);

    document.getElementById('btnSubmitUpdateSched').addEventListener('click', updatePersonalSession);
    document.getElementById('btnSubmitAddSched').addEventListener('click', addPersonalSession);

    document.getElementById('sessionStartTime').addEventListener('change', function(event) {
        //This function will be called when the time input changes
        let selectedTime = event.target.value;
        
        console.log(selectedTime.charAt(1));
        let selectedHour = parseInt(selectedTime.charAt(0)+selectedTime.charAt(1))+1;
        selectedTime = selectedTime.slice(2);

        if (selectedHour>=10) {
            selectedHour = selectedHour.toString();
            selectedTime = selectedHour+selectedTime;
        } else {
            selectedTime = '0'+selectedHour.toString()+selectedTime;
        }
        console.log(selectedTime);

        document.getElementById('sessionEndTime').value = selectedTime;
    });
}

function login(event) {
    event.preventDefault();

    let formData = {};

    formData.member_email = document.getElementById('login_member_email').value.trim();
    formData.password = document.getElementById('login_password').value.trim();

    for (const key in formData) {
        if (!formData[key]) {
            alert('Please fill in all fields');
            return;
        }
    }

    let btnLogin = document.getElementById("btnLogin");
    let btnSignUp = document.getElementById("btnSignUp");

    let loginForm = document.getElementById("login");
    let signUpForm = document.getElementById("addMember");

    let profile = document.getElementById("updateMember");
    let scheduleManagement = document.getElementById("scheduleManagement");
    let scheduleForUser = document.getElementById("buttons1");
    
    console.log(formData);

    fetch(`http://localhost:3000/members/loginValidation?id=${formData.member_email}&password=${formData.password}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if(!response.ok) {
            return response.json().then(message => {
                window.alert(message.message);
            });
        }

        return response.json().then(message => {
            if(message.message == "Exists") {
                // Hide the login form
                loginForm.style.display = "none";

                // Hide the sign-up form
                signUpForm.style.display = "none";

                // Hide the btnLogin button
                btnLogin.style.display = "none";

                // Hide the btnSignUp button
                btnSignUp.style.display = "none";

                profile.style.display = "block";
                scheduleManagement.style.display = "block";
                scheduleForUser.style.display = "block";

                fetch("http://localhost:3000/members/getMemberById?id="+formData.member_email, {
                    method: 'GET'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    console.log(response);
                    return response.json(); // Parse the JSON response
                })
                .then(data => {
                    document.getElementById("memberIDHolder").setAttribute("value", data[0].member_id);
                    fillUpdateMember(data[0]);
                    Promise.all([
                        fetch("http://localhost:3000/members/getAllPersonalTrainingSessions?id="+data[0].member_id, {
                            method: 'GET'
                        }), 
                        fetch(`http://localhost:3000/members/getAllGroupTrainingSessions?id=${data[0].member_id}`, {
                            method: 'GET'
                        })
                    ])
                    .then(responses => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        // Extract the JSON data from each response
                        return Promise.all(responses.map(response => response.json()));
                    })
                    .then(data => {
                        console.log(data[0]);
                        populatePersonalSessions(data[0]);
                        populateGroupSessions(data[1]);
                    })

                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
                // .then(data => {
                //     // Access the adminId from the parsed JSON data
                //     fillUpdateMember(data[0]);
                //     // console.log(adminId); // Do something with the adminId
                //     fetch("http://localhost:3000/members/getAllPersonalTrainingSessions?id="+data[0].member_id, {
                //         method: 'GET'
                //     })
                //     .then(response => {
                //         if (!response.ok) {
                //             throw new Error('Network response was not ok');
                //         }
    
                //         console.log(response);
                //         return response.json(); // Parse the JSON response
                //     })
                //     .then(data => {
                //         console.log(data);
                //         populatePersonalSessions(data);
                //     })
                // })
                // .catch(error => {
                //     console.error('There was a problem with the fetch operation:', error);
                // });

                
                
            }
        });
    })
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

function fillUpdateMember(memberData) {
    // event.preventDefault();

    console.log(memberData);

    let formData = {};      

    formData.member_email = document.getElementById('update_member_email');
    formData.member_email.value = memberData.member_email;
    formData.password = document.getElementById('update_password');
    formData.password.value = memberData.password;
    formData.first_name = document.getElementById('update_fname');
    formData.first_name.value = memberData.first_name;
    formData.last_name = document.getElementById('update_lname');
    formData.last_name.value = memberData.last_name;
    formData.DOB = document.getElementById('update_DOB');
    formData.DOB.valueAsDate = new Date(memberData.dob);
    formData.street = document.getElementById('update_street');
    formData.street.value = memberData.street;
    formData.city = document.getElementById('update_city');
    formData.city.value = memberData.city;
    formData.province = document.getElementById('update_province');
    formData.province.value = memberData.province;
    formData.postal_Code = document.getElementById('update_postal_Code');
    formData.postal_Code.value = memberData.postal_code;
    formData.card_number = document.getElementById('update_card_number');
    formData.card_number.value = memberData.card_number;
    formData.cvv = document.getElementById('update_cvv');
    formData.cvv.value = memberData.cvv;
    formData.expiry_date = document.getElementById('update_expiry_date');
    formData.expiry_date.valueAsDate = new Date(memberData.expiry_date);

    for (const key in formData) {
        if (!formData[key]) {
            alert('Error filling in all fields');
            return;
        }
    }
}

function updateForm(event) {
    event.preventDefault();

    let formData = {};
    let memberId = fetch('http://localhost:3000/members/getMemberIdInSession', {
        method: 'GET'
    })
    .then(response => {
        if(!response.ok) {
            return response.json().then(message => {
                window.alert(message.message);
            });
        }

        return response.json().then(message => {
            // window.alert(message);
            return message.memberId;
        });
    });

    formData.member_email = document.getElementById('update_member_email').value.trim();
    formData.password = document.getElementById('update_password').value.trim();
    formData.first_name = document.getElementById('update_fname').value.trim();
    formData.last_name = document.getElementById('update_lname').value.trim();
    formData.DOB = document.getElementById('update_DOB').value.trim();
    formData.street = document.getElementById('update_street').value.trim();
    formData.city = document.getElementById('update_city').value.trim();
    formData.province = document.getElementById('update_province').value.trim();
    formData.postal_Code = document.getElementById('update_postal_Code').value.trim();
    formData.card_number = document.getElementById('update_card_number').value.trim();
    formData.cvv = document.getElementById('update_cvv').value.trim();
    formData.expiry_date = document.getElementById('update_expiry_date').value.trim();

    for (const key in formData) {
        if (!formData[key]) {
            alert('Please fill in all fields');
            return;
        }
    }

    memberId.then(memberId => {
        formData.member_id = memberId; 
        fetch('http://localhost:3000/members/updateMember', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if(!response.ok) {
                return response.json().then(message => {
                    window.alert(message.message);
                });
            }

            return response.json().then(message => {
                window.alert(message.message);
            });
        })
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    });

    console.log(formData);
}

function searchSession() {
    let scheduleManagement = document.getElementById("scheduleManagement");

    let sessionDate = document.getElementById("sessionDate").value.trim();
    let sessionStartTime = document.getElementById("sessionStartTime").value;
    let sessionEndTime = document.getElementById("sessionEndTime").value;

    console.log(sessionStartTime);
    console.log(sessionEndTime);

    let searchParams = {
        date: sessionDate,
        startTime: sessionStartTime+':00',
        endTime: sessionEndTime+':00'
    };

    // console.log(searchParams);
    // console.log(sessionEndTime);

    console.log(searchParams);

    for (const key in searchParams) {
        if (!searchParams[key]) {
            alert('Please fill in all fields');
            return;
        }
    }

    Promise.all([
        fetch(`http://localhost:3000/members/getAvailableTrainers?date=${searchParams.date}&startTime=${searchParams.startTime}&endTime=${searchParams.endTime}`, {
            method: 'GET'
        }), 
        fetch(`http://localhost:3000/members/getAvailableRooms?date=${searchParams.date}`, {
            method: 'GET'
        })
    ])
    .then(responses => {
        // Extract the JSON data from each response
        return Promise.all(responses.map(response => response.json()));
    })
    .then(data => {
        // Handle the data from both URLs
        const data1 = data[0];
        // console.log('Data from URL 1:', data1);
        let select = document.getElementById("selectAvailableTrainers");
        select.innerHTML = '';
        data[0].forEach(i => {
            let option = document.createElement('option');
            option.id = i.trainer_id;
            option.innerHTML = i.first_name + ' ' + i.last_name;
            select.appendChild(option);
        });

        const data2 = data[1];
        // console.log('Data from URL 2:', data2);
        select = document.getElementById("selectAvailableRooms");
        select.innerHTML = '';
        data[1].forEach(i => {
            let option = document.createElement('option');
            option.id = i.room_id;
            option.innerHTML = i.room_name;
            select.appendChild(option);
        });
    })
    .catch(error => {
        // Handle any errors that occurred during fetching or parsing
        console.error('Error fetching data:', error);
    });

}

function addMember(event) {
    event.preventDefault();

    let formData = {};

    formData.member_email = document.getElementById('member_email').value.trim();
    formData.password = document.getElementById('password').value.trim();
    formData.first_name = document.getElementById('fname').value.trim();
    formData.last_name = document.getElementById('lname').value.trim();
    formData.DOB = document.getElementById('DOB').value.trim();
    formData.street = document.getElementById('street').value.trim();
    formData.city = document.getElementById('city').value.trim();
    formData.province = document.getElementById('province').value.trim();
    formData.postal_Code = document.getElementById('postal_Code').value.trim();
    formData.card_number = document.getElementById('card_number').value.trim();
    formData.cvv = document.getElementById('cvv').value.trim();
    formData.expiry_date = document.getElementById('expiry_date').value.trim();

    for (const key in formData) {
        if (!formData[key]) {
            alert('Please fill in all fields');
            return;
        }
    }

    console.log(formData);

    fetch('http://localhost:3000/members/addMember', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
    })
    .then(response => {
        if(!response.ok) {
            return response.json().then(message => {
                window.alert(message.message);
            });
        }

        return response.json().then(message => {
            window.alert(message.message);
        });
    })
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

// Gets all the students by making a GET request to the REST api created
function populatePersonalSessions(sessions) {
    console.log(sessions);

    let table = document.getElementById("personalSessionsTable");
    console.log(table);
    table.innerHTML =   `<tr>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Trainer</th>
                            <th>Room</th>
                        </tr> `;
    console.log(table);

    // Iterate through all the objects in the sessions array
    for(let session of sessions){
        // Save the information for the current in variables
        let sessionID = session.session_id;
        let date = session.date.split('T')[0];
        // date = new Date(date);
        let startTime = session.start_time;
        let endTime = session.end_time;
        let trainer = session.first_name + ' ' + session.last_name;
        let room = session.room_name;
        
        let row = document.createElement("tr");
        row.id = "personalSession"+sessionID;

        let sessionIdCell = document.createElement("td");
        sessionIdCell.textContent = date;
        row.appendChild(sessionIdCell);

        let fNameCell = document.createElement("td");
        fNameCell.textContent = startTime;
        row.appendChild(fNameCell);

        let lNameCell = document.createElement("td");
        lNameCell.textContent = endTime;
        row.appendChild(lNameCell);

        let emailCell = document.createElement("td");
        emailCell.textContent = trainer;
        row.appendChild(emailCell);

        let enrollmentDateCell = document.createElement("td");
        enrollmentDateCell.textContent = room;
        row.appendChild(enrollmentDateCell);

        let deleteBtn = `<td onclick="deleteSession(${sessionID}, ${session.member_id})" class="deleteBtn">Delete</td>`
        row.innerHTML += deleteBtn;

        let updateBtn = `<td onclick="updateSession(${sessionID}, ${session.member_id})" class="updateBtn">Update</td>`
        row.innerHTML += updateBtn;

        // Append the row to the table
        let validation = document.getElementById(sessionID);
        table.appendChild(row);
    }
}

function populateGroupSessions(sessions) {
    console.log(sessions);

    let table = document.getElementById("groupSessionsTable");
    console.log(table);
    table.innerHTML =   `<tr>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Trainer</th>
                            <th>Room</th>
                        </tr> `;
    console.log(table);

    // Iterate through all the objects in the sessions array
    for(let session of sessions){
        // Save the information for the current in variables
        let sessionID = session.session_id;
        let date = session.date.split('T')[0];
        // date = new Date(date);
        let startTime = session.start_time;
        let endTime = session.end_time;
        let trainer = session.first_name + ' ' + session.last_name;
        let room = session.room_name;
        
        let row = document.createElement("tr");
        row.id = "groupSession"+sessionID;

        let sessionIdCell = document.createElement("td");
        sessionIdCell.textContent = date;
        row.appendChild(sessionIdCell);

        let fNameCell = document.createElement("td");
        fNameCell.textContent = startTime;
        row.appendChild(fNameCell);

        let lNameCell = document.createElement("td");
        lNameCell.textContent = endTime;
        row.appendChild(lNameCell);

        let emailCell = document.createElement("td");
        emailCell.textContent = trainer;
        row.appendChild(emailCell);

        let enrollmentDateCell = document.createElement("td");
        enrollmentDateCell.textContent = room;
        row.appendChild(enrollmentDateCell);

        if (session.member_id != null) {
            let addBtn = `<td class="updateBtn">Already registered</td>`
            row.innerHTML += addBtn;
        } else {
            let addBtn = `<td onclick="addToGroupSession(${sessionID})" class="addToGroupSessionBtn">Add group session to schedule</td>`
            row.innerHTML += addBtn;
        }

        

        // let updateBtn = `<td onclick="updateSession(${sessionID})" class="updateBtn">Update</td>`
        // row.innerHTML += updateBtn;

        // Append the row to the table
        let validation = document.getElementById(sessionID);
        table.appendChild(row);
    }
}

function updateSession(id, memberId) {
    console.log("Delete session with id: "+id);
    document.getElementById("sessionIDHolder").setAttribute("value", id);
    document.getElementById("memberIDHolder").setAttribute("value", memberId);

    let personalSessionForUpdate = document.getElementById("personalSession"+id);

    let date = personalSessionForUpdate.childNodes[0].innerHTML;
    let start_time = personalSessionForUpdate.childNodes[1].innerHTML;
    let end_time = personalSessionForUpdate.childNodes[2].innerHTML;

    let obj = {
        date: date,
        start_time: start_time.slice(0, -3),
        end_time: end_time.slice(0, -3)
    }

    // date = new Date(date);

    // console.log(obj);

    let sessionDate = document.getElementById("sessionDate");
    sessionDate.value = obj.date;
    let sessionStartTime = document.getElementById("sessionStartTime")
    sessionStartTime.value = obj.start_time;
    let sessionEndTime = document.getElementById("sessionEndTime");
    sessionEndTime.value = obj.end_time;

    document.getElementById('selectAvailableTrainers').innerHTML = '';
    document.getElementById('selectAvailableRooms').innerHTML = '';

    // console.log(document.getElementById("sessionIDHolder"));
}

function addPersonalSession() {
    let session_id = parseInt(document.getElementById("sessionIDHolder").getAttribute('value'));
    let date = document.getElementById("sessionDate").value;
    let start_time = document.getElementById("sessionStartTime").value;
    let end_time = document.getElementById("sessionEndTime").value;
    let session_type = 'personal';
    let trainers = document.getElementById('selectAvailableTrainers');
    let trainer_id = parseInt(trainers.options[trainers.selectedIndex].id);
    let rooms = document.getElementById('selectAvailableRooms');
    let room_id = parseInt(rooms.options[rooms.selectedIndex].id);

    let member_id = parseInt(document.getElementById("memberIDHolder").getAttribute('value'));

    let obj = {
        date: date,
        start_time: start_time,
        end_time: end_time,
        session_type: session_type,
        trainer_id: trainer_id,
        room_id: room_id,
        member_id: member_id,
    }

    fetch('http://localhost:3000/members/createSession', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    })
    .then(response => {
        if(!response.ok) {
            return response.json().then(message => {
                window.alert(message.message);
            });
        }

        return response.json().then(message => {
            window.alert(message.message);
        });
    })
    .then(data => {
        fetch("http://localhost:3000/members/getAllPersonalTrainingSessions?id="+member_id, {
            method: 'GET'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log(response);
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            console.log(data);
            populatePersonalSessions(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        })
    })
    .catch(error => console.error('Error:', error));
}

function updatePersonalSession() {
    let session_id = parseInt(document.getElementById("sessionIDHolder").getAttribute('value'));
    let date = document.getElementById("sessionDate").value;
    let start_time = document.getElementById("sessionStartTime").value;
    let end_time = document.getElementById("sessionEndTime").value;
    let session_type = 'personal';
    let trainers = document.getElementById('selectAvailableTrainers');
    let trainer_id = parseInt(trainers.options[trainers.selectedIndex].id);
    let rooms = document.getElementById('selectAvailableRooms');
    let room_id = parseInt(rooms.options[rooms.selectedIndex].id);

    let member_id = parseInt(document.getElementById("memberIDHolder").getAttribute('value'));

    let obj = {
        session_id: session_id,
        date: date,
        start_time: start_time,
        end_time: end_time,
        session_type: session_type,
        trainer_id: trainer_id,
        room_id: room_id
    }

    fetch('http://localhost:3000/members/updateSession', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    })
    .then(response => {
        if(!response.ok) {
            return response.json().then(message => {
                window.alert(message.message);
            });
        }

        return response.json().then(message => {
            window.alert(message.message);
        });
    })
    .then(data => {
        fetch("http://localhost:3000/members/getAllPersonalTrainingSessions?id="+member_id, {
            method: 'GET'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log(response);
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            console.log(data);
            populatePersonalSessions(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        })
    })
    .catch(error => console.error('Error:', error));
}

function deleteSession(session_id, member_id) {

    let obj = {
        member_id: member_id,
        session_id: session_id
    }

    fetch(`http://localhost:3000/members/deleteSession?id=${session_id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(message => {
                window.alert(message.message);
                throw new Error(message.message);
            });
        }
        return response.json().then(message => {
            window.alert(message.message);
        });
    })
    .then(data => {
        fetch("http://localhost:3000/members/getAllPersonalTrainingSessions?id="+member_id, {
            method: 'GET'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log(response);
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            console.log(data);
            populatePersonalSessions(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        })
    })
    .catch(error => console.error('Error:', error));

    console.log(obj);

}

function addToGroupSession(id) {
    console.log("Add session with id: "+id);

    let  = id;
    let session_type = 'personal';
    // let trainers = document.getElementById('selectAvailableTrainers');
    // let trainer_id = parseInt(trainers.options[trainers.selectedIndex].id);
    // let rooms = document.getElementById('selectAvailableRooms');
    // let room_id = parseInt(rooms.options[rooms.selectedIndex].id);

    let member_id = parseInt(document.getElementById("memberIDHolder").getAttribute('value'));

    let personalSessionForUpdate = document.getElementById("groupSession"+id);

    let date = personalSessionForUpdate.childNodes[0].innerHTML;
    let start_time = personalSessionForUpdate.childNodes[1].innerHTML;
    let end_time = personalSessionForUpdate.childNodes[2].innerHTML;

    let obj = {
        member_id: member_id,
        session_id: id,
        date: date,
        start_time: start_time,
        end_time: end_time
    }

    console.log(obj);

    fetch('http://localhost:3000/members/addGroupSession', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    })
    .then(response => {
        if(!response.ok) {
            return response.json().then(message => {
                window.alert(message.message);
            });
        }

        return response.json().then(message => {
            window.alert(message.message);
        });
    })
    .then(data => {
        fetch(`http://localhost:3000/members/getAllGroupTrainingSessions?id=${member_id}`, {
            method: 'GET'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log(response);
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            console.log(data);
            populateGroupSessions(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        })
    })
    .catch(error => console.error('Error:', error));
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
