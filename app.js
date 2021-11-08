var express = require("express");
// var cors = require("cors");

var jobRouter = require("./routes/jobRoutes");

var app = express();

app.use(express.json())

app.use('/api/v1/job', jobRouter)

module.exports = app;
