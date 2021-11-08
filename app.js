var express = require("express");
// var cors = require("cors");

var jobRouter = require("./routes/jobRoutes");

var app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Server is Up!',
    });
})

app.use('/api/v1/job', jobRouter)

module.exports = app;
