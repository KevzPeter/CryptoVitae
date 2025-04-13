const express = require('express');
const {
    createResume,
    getResumeByWallet,
    updateResume,
    incrementViewCount,
} = require('../controllers/resume.controller.js');

const router = express.Router();

router.post('/', createResume);
router.get('/:wallet', getResumeByWallet);
router.put('/:wallet', updateResume);
router.post('/view/:tokenId', incrementViewCount);

module.exports = router;
