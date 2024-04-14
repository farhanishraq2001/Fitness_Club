const express = require('express');
const trainerRoutes = require('./src/routes/trainer-routes');
const adminRoutes = require('./src/routes/admin-routes');
const memberRoutes = require('./src/routes/member-routes');

const app = express();
const port = 3000;

//Middleware used to parse json data
app.use(express.json());

const session = require('express-session');

app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true
}));

//Everything runs at localhost:3000/students
app.use('/trainers', trainerRoutes);
app.use('/admins', adminRoutes);
app.use('/members', memberRoutes);

//Serve static resources from the public directory
app.use(express.static("public"));

app.listen(port, () => console.log(`Server running at localhost:${port}`));