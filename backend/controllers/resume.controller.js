const {
    saveResumeToDB,
    getResumeByWalletFromDB,
    updateResumeInDB,
    incrementViewsInDB,
} = require('../helpers/resume.helper.js');

// POST /api/resume
const createResume = async (req, res) => {
    try {
        const resumeData = req.body;
        // if (!resumeData.wallet || !resumeData.tokenId || !resumeData.resumeURI) {
        //     return res.status(400).json({ message: 'Missing required fields' });
        // }

        const savedResume = await saveResumeToDB(resumeData);
        res.status(201).json({ message: 'Resume created', data: savedResume });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/resume/:wallet
const getResumeByWallet = async (req, res) => {
    try {
        const { wallet } = req.params;
        const resume = await getResumeByWalletFromDB(wallet);
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json({ data: resume });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/resume/:wallet
const updateResume = async (req, res) => {
    try {
        const { wallet } = req.params;
        const updates = req.body;

        const updatedResume = await updateResumeInDB(wallet, updates);
        if (!updatedResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.status(200).json({ message: 'Resume updated', data: updatedResume });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/view/:tokenId
const incrementViewCount = async (req, res) => {
    try {
        const { tokenId } = req.params;
        const updatedResume = await incrementViewsInDB(tokenId);

        if (!updatedResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.status(200).json({ message: 'View count incremented', data: updatedResume });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createResume,
    getResumeByWallet,
    updateResume,
    incrementViewCount,
};
