const resumeHelper = require('../helpers/resume.helper.js');

// POST /api/resume
const createResume = async (req, res) => {
    try {
        const resumeData = req.body;
        console.log("[CREATE RESUME] Incoming data:", resumeData);

        const savedResume = await resumeHelper.saveResumeToDB(resumeData);
        console.log("[CREATE RESUME] Successfully saved:", savedResume);

        res.status(201).json({ message: 'Resume created', data: savedResume });
    } catch (error) {
        console.error("[CREATE RESUME] Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// GET /api/resume/:wallet
const getResumeByWallet = async (req, res) => {
    try {
        const { wallet } = req.params;
        console.log("[GET RESUME] Wallet:", wallet);

        const resume = await resumeHelper.getResumeByWalletFromDB(wallet);
        if (!resume) {
            console.warn("[GET RESUME] No resume found for wallet:", wallet);
            return res.status(404).json({ message: 'Resume not found' });
        }

        console.log("[GET RESUME] Resume data:", resume);
        res.status(200).json({ data: resume });
    } catch (error) {
        console.error("[GET RESUME] Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/resume/:wallet
const updateResume = async (req, res) => {
    try {
        const { wallet } = req.params;
        const updates = req.body;
        console.log("[UPDATE RESUME] Wallet:", wallet);
        console.log("[UPDATE RESUME] Updates:", updates);
        if (wallet.toLowerCase() !== req.user.wallet.toLowerCase()) {
            return res.status(403).json({ message: "Not authorized to edit this resume" });
        }

        const updatedResume = await resumeHelper.updateResumeInDB(wallet, updates);
        if (!updatedResume) {
            console.warn("[UPDATE RESUME] No resume found for wallet:", wallet);
            return res.status(404).json({ message: 'Resume not found' });
        }

        console.log("[UPDATE RESUME] Successfully updated:", updatedResume);
        res.status(200).json({ message: 'Resume updated', data: updatedResume });
    } catch (error) {
        console.error("[UPDATE RESUME] Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// POST /api/view/:tokenId
const incrementViewCount = async (req, res) => {
    try {
        const { tokenId } = req.params;
        console.log("[INCREMENT VIEW] Token ID:", tokenId);

        const updatedResume = await resumeHelper.incrementViewsInDB(tokenId);
        if (!updatedResume) {
            console.warn("[INCREMENT VIEW] No resume found for token ID:", tokenId);
            return res.status(404).json({ message: 'Resume not found' });
        }

        console.log("[INCREMENT VIEW] Updated view count:", updatedResume);
        res.status(200).json({ message: 'View count incremented', data: updatedResume });
    } catch (error) {
        console.error("[INCREMENT VIEW] Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getAllResumes = async (req, res) => {
    try {
        const { search = "", page = 1, limit = 20, minted, skill } = req.query;

        const filters = {
            minted: minted === "true", // ensure boolean
            skill: skill || null,
        };

        const { resumes, total } = await resumeHelper.getAllResumesFromDB(search, +page, +limit, filters);
        res.status(200).json({ data: resumes, total });
    } catch (error) {
        console.error("[GET ALL RESUMES] Error:", error);
        res.status(500).json({ message: "Failed to fetch resumes." });
    }
};

module.exports = {
    createResume,
    getResumeByWallet,
    updateResume,
    incrementViewCount,
    getAllResumes
};