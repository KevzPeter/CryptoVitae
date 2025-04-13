const Resume = require('../models/resume.model.js');

// CREATE
const saveResumeToDB = async (resumeData) => {
    try {
        const newResume = new Resume(resumeData);
        return await newResume.save();
    } catch (error) {
        console.error('Error saving resume:', error.message);
        throw new Error('Database error while saving resume');
    }
};

// READ
const getResumeByWalletFromDB = async (wallet) => {
    try {
        return await Resume.findOne({ wallet });
    } catch (error) {
        console.error('Error fetching resume:', error.message);
        throw new Error('Database error while fetching resume');
    }
};

// UPDATE
const updateResumeInDB = async (wallet, updates) => {
    try {
        return await Resume.findOneAndUpdate({ wallet }, updates, { new: true });
    } catch (error) {
        console.error('Error updating resume:', error.message);
        throw new Error('Database error while updating resume');
    }
};

// TRACK VIEW
const incrementViewsInDB = async (tokenId) => {
    try {
        return await Resume.findOneAndUpdate(
            { tokenId },
            { $inc: { views: 1 } },
            { new: true }
        );
    } catch (error) {
        console.error('Error incrementing views:', error.message);
        throw new Error('Database error while tracking views');
    }
};

module.exports = {
    saveResumeToDB,
    getResumeByWalletFromDB,
    updateResumeInDB,
    incrementViewsInDB,
};
