const express = require("express");
const router = express.Router();
const AgentHistory = require("../models/AgentHistory");
const userVerification = require("../middleware/auth");

// POST /api/history/save - Save new activity
router.post("/save", userVerification, async (req, res) => {
    try {
        const { type, status, details } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!type || !details) {
            return res.status(400).json({
                success: false,
                message: "Type and details are required"
            });
        }

        // Create new history entry
        const historyEntry = new AgentHistory({
            userId,
            type,
            status: status || "Generated",
            details
        });

        await historyEntry.save();

        res.status(201).json({
            success: true,
            message: "Activity saved successfully",
            data: historyEntry
        });

    } catch (error) {
        console.error("Error saving history:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save activity",
            error: error.message
        });
    }
});

// GET /api/history/user/:id - Get all history for a user
router.get("/user/:id", userVerification, async (req, res) => {
    try {
        const userId = req.params.id;

        // Verify user is requesting their own history
        if (userId !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        // Fetch history, sorted by most recent first
        const history = await AgentHistory.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50) // Limit to last 50 activities
            .lean();

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });

    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch history",
            error: error.message
        });
    }
});

// GET /api/history/:historyId - Get specific history item
router.get("/:historyId", userVerification, async (req, res) => {
    try {
        const { historyId } = req.params;

        const historyItem = await AgentHistory.findById(historyId);

        if (!historyItem) {
            return res.status(404).json({
                success: false,
                message: "History item not found"
            });
        }

        // Verify ownership
        if (historyItem.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        res.status(200).json({
            success: true,
            data: historyItem
        });

    } catch (error) {
        console.error("Error fetching history item:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch history item",
            error: error.message
        });
    }
});

// DELETE /api/history/:historyId - Delete a history item
router.delete("/:historyId", userVerification, async (req, res) => {
    try {
        const { historyId } = req.params;

        const historyItem = await AgentHistory.findById(historyId);

        if (!historyItem) {
            return res.status(404).json({
                success: false,
                message: "History item not found"
            });
        }

        // Verify ownership
        if (historyItem.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        await AgentHistory.findByIdAndDelete(historyId);

        res.status(200).json({
            success: true,
            message: "History item deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting history item:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete history item",
            error: error.message
        });
    }
});

module.exports = router;
