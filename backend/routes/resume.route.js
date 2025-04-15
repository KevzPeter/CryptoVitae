const express = require('express');
const resumeController = require('../controllers/resume.controller.js');

const router = express.Router();

router.post('/', resumeController.createResume);
router.get('/:wallet', resumeController.getResumeByWallet);
router.put('/:wallet', resumeController.updateResume);
router.post('/view/:tokenId', resumeController.incrementViewCount);
router.get("/", resumeController.getAllResumes);

module.exports = router;
