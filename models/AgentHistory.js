const mongoose = require("mongoose");

const agentHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ["TRIP_PLAN", "VISA_ASSESSMENT"],
        required: true
    },
    status: {
        type: String,
        enum: ["Generated", "Approved", "Rejected", "Review Required", "Analysis Ready", "Recommended", "Not Recommended"],
        default: "Generated"
    },
    details: {
        // For TRIP_PLAN
        origin: String,
        destinations: [String],
        startDate: String,
        endDate: String,
        duration: Number,
        budgetRange: String,
        travelStyle: String,
        interests: [String],
        groupSize: Number,

        // For VISA_ASSESSMENT
        nationality: String,
        destination: String,
        purpose: String,
        eligibilityScore: Number,
        eligibilityReason: String,
        adminApprovalStatus: String,
        missingDocuments: [String],
        processingTime: String,

        // Common
        fullResult: String, // Store the complete AI response
        cached: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Index for faster queries
agentHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("AgentHistory", agentHistorySchema);
