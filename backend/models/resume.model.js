const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
    {
        wallet: {
            type: String,
            required: true,
            unique: true,
        },
        tokenId: {
            type: Number,
            // required: true,
        },
        resumeURI: {
            type: String,
            // required: true,
        },
        name: {
            type: String,
            required: true,
        },
        title: String,
        bio: String,
        workExperience: [
            {
                company: { type: String, required: true },
                role: { type: String, required: true },
                startDate: { type: String },
                endDate: { type: String },
                description: { type: String, required: true },
            }
        ],

        projects: [
            {
                name: { type: String, required: true },
                link: { type: String },
                description: { type: String, required: true },
            }
        ],
        skills: [String],
        linkedin: String,
        github: String,
        views: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// This is the key line for CommonJS export
module.exports = mongoose.model('Resume', resumeSchema);
