const express = require("express");
const app = express();
const cors = require('cors')

const dbConnection = require('./config/db.config')


require('dotenv').config();
const SERVER_PORT = 8081

dbConnection()



app.listen(SERVER_PORT, (req, res) => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
})
