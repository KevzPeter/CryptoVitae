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

const getAllResumesFromDB = async (searchQuery = "", page = 1, limit = 20, filters = {}) => {
    const query = {};

    // Text Search
    if (searchQuery) {
        const regex = new RegExp(searchQuery, "i");
        query.$or = [
            { name: regex },
            { title: regex },
            { skills: { $in: [regex] } },
        ];
    }

    // Only Minted
    if (filters.minted === true) {
        query.tokenId = { $ne: 0 }; // tokenId != 0
    }

    // Skill-based filter (exact match)
    if (filters.skill) {
        query.skills = { $in: [filters.skill] };
    }

    const skip = (page - 1) * limit;
    const resumes = await Resume.find(query).skip(skip).limit(limit);
    const total = await Resume.countDocuments(query);

    return { resumes, total };
};

module.exports = {
    saveResumeToDB,
    getResumeByWalletFromDB,
    updateResumeInDB,
    incrementViewsInDB,
    getAllResumesFromDB
};
