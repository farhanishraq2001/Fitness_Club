const path = require('path');
require('dotenv').config({
    override: true,
    path: path.join(__dirname, 'dev.env')
});

const Pool  = require('pg').Pool;

// Creates a new Pool using DB configurations found in the dev.env file
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
});
// This pool is exported to be used in controller.js for querying the DB
module.exports = pool;