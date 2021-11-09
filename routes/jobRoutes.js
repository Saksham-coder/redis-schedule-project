const express = require('express');
const router = express.Router();

const jobController = require('./../controllers/jobController')

router.route('/create').post(jobController.postJob)
router.route('/abort').post(jobController.abortJob)
router.route('/').get(jobController.getAllJob)

module.exports = router