const express = require('express');
const router = express.Router();

const jobController = require('./../controllers/jobController')

router.route('/create').post(jobController.postJob)
router.route('/cancel').post(jobController.cancelJob)
router.route('/abort').post(jobController.abortJob)
router.route('/scrape').post(jobController.scrapeJob)

module.exports = router