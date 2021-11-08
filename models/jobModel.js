const mongoose = require('mongoose')

const jobScehma = new mongoose.Schema({
    url: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        // enumerate: ['create', 'queue', 'halt', 'run', 'abort', 'delete', 'success']
    },
    priority: {
        type: Number
    },
    halted: {
        type: Number,
        default: 0
    }
})

const Job = mongoose.model('Job', jobScehma);

module.exports = Job