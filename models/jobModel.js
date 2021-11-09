const mongoose = require('mongoose')

const jobScehma = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
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
    },
    data: {
        type: Array,
        default: []
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const Job = mongoose.model('Job', jobScehma);

module.exports = Job