var express = require("express");
var cors = require("cors");
var { scheduler } = require('./helpers/scheduler')

var jobRouter = require("./routes/jobRoutes");

var app = express();

app.use(express.json())
app.use(cors());

app.use('/api/v1/job', jobRouter)

module.exports = app;
