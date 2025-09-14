// routes/switchRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const { authenticateApiKey } = require("../middleware/auth");
const SwitchData = require("../models/SwitchData");
const { validateSwitchData, validateBackupData } = require("../utils/validators");
const { createDefaultDatasource } = require("../utils/defaultData");

const router = express.Router();

// GET - Ambil data switch untuk user
router.get("/switch", authenticateApiKey, async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log(`Loading switch data for user: ${userId}`);

        let switchData = await SwitchData.findByUserId(userId);

        if (!switchData) {
            console.log(`No data found for user ${userId}, creating default data`);
            const defaultDatasource = createDefaultDatasource();

            switchData = new SwitchData({
                userId,
                datasource: defaultDatasource,
            });
            await switchData.save();
            console.log(`Default data created for user ${userId}`);
        }

        console.log(`Data loaded for user ${userId}`);
        res.json({
            success: true,
            data: switchData.datasource,
            lastModified: switchData.lastModified,
            message: "Data switch berhasil dimuat",
        });
    } catch (error) {
        console.error("Get switch data error:", error);
        res.status(500).json({
            success: false,
            error: "Gagal mengambil data switch",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});

// POST - Simpan/Update data switch
router.post("/switch", authenticateApiKey, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { datasource } = req.body;

        console.log(`Saving switch data for user: ${userId}`);

        // Validate input data
        const validationError = validateSwitchData(datasource);
        if (validationError) {
            return res.status(400).json(validationError);
        }

        let switchData = await SwitchData.findByUserId(userId);

        if (switchData) {
            console.log(`Updating existing data for user ${userId}`);
            switchData.datasource = datasource;
            switchData.lastModified = new Date();
        } else {
            console.log(`Creating new data for user ${userId}`);
            switchData = new SwitchData({
                userId,
                datasource,
                lastModified: new Date(),
            });
        }

        await switchData.save();
        console.log(`Data saved successfully for user ${userId}`);

        res.json({
            success: true,
            message: "Data switch berhasil disimpan",
            lastModified: switchData.lastModified,
            dataSize: JSON.stringify(datasource).length,
        });
    } catch (error) {
        console.error("Save switch data error:", error);
        res.status(500).json({
            success: false,
            error: "Gagal menyimpan data switch",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});

// DELETE - Hapus data switch untuk user
router.delete("/switch", authenticateApiKey, async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log(`Deleting switch data for user: ${userId}`);

        const result = await SwitchData.deleteOne({ userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                error: "Data switch tidak ditemukan",
                code: "DATA_NOT_FOUND",
            });
        }

        console.log(`Data deleted successfully for user ${userId}`);
        res.json({
            success: true,
            message: "Data switch berhasil dihapus",
        });
    } catch (error) {
        console.error("Delete switch data error:", error);
        res.status(500).json({
            success: false,
            error: "Gagal menghapus data switch",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});

// GET - Status server dan user
router.get("/status", authenticateApiKey, async (req, res) => {
    try {
        const userId = req.user.userId;
        const switchCount = await SwitchData.countDocuments({ userId });
        const userStats = await SwitchData.getUserStats(userId);

        res.json({
            success: true,
            status: {
                user: userId,
                switchDataExists: switchCount > 0,
                lastActivity: userStats ? userStats.lastModified : null,
                dataSize: userStats ? userStats.dataSize : 0,
                createdAt: userStats ? userStats.createdAt : null,
                serverTime: new Date().toISOString(),
                mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
            },
        });
    } catch (error) {
        console.error("Status error:", error);
        res.status(500).json({
            success: false,
            error: "Gagal mengambil status",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});

// POST - Backup data switch
router.post("/backup", authenticateApiKey, async (req, res) => {
    try {
        const userId = req.user.userId;
        const switchData = await SwitchData.findByUserId(userId);

        if (!switchData) {
            return res.status(404).json({
                success: false,
                error: "Data switch tidak ditemukan untuk backup",
                code: "DATA_NOT_FOUND",
            });
        }

        const backupData = {
            userId: switchData.userId,
            datasource: switchData.datasource,
            backupTime: new Date().toISOString(),
            originalLastModified: switchData.lastModified,
            version: "1.0",
        };

        console.log(`Backup created for user: ${userId}`);
        res.json({
            success: true,
            message: "Backup data switch berhasil dibuat",
            backup: backupData,
        });
    } catch (error) {
        console.error("Backup error:", error);
        res.status(500).json({
            success: false,
            error: "Gagal membuat backup",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});

// POST - Restore data dari backup
router.post("/restore", authenticateApiKey, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { backup } = req.body;

        // Validate backup data
        const validationError = validateBackupData(backup);
        if (validationError) {
            return res.status(400).json(validationError);
        }

        let switchData = await SwitchData.findByUserId(userId);

        if (switchData) {
            console.log(`Restoring data for existing user: ${userId}`);
            switchData.datasource = backup.datasource;
            switchData.lastModified = new Date();
        } else {
            console.log(`Creating new data from backup for user: ${userId}`);
            switchData = new SwitchData({
                userId,
                datasource: backup.datasource,
                lastModified: new Date(),
            });
        }

        await switchData.save();
        console.log(`Data restored successfully for user: ${userId}`);

        res.json({
            success: true,
            message: "Data switch berhasil di-restore dari backup",
            lastModified: switchData.lastModified,
        });
    } catch (error) {
        console.error("Restore error:", error);
        res.status(500).json({
            success: false,
            error: "Gagal restore data dari backup",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});

module.exports = router;
