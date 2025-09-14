// models/SwitchData.js
const mongoose = require("mongoose");

// Schema untuk Switch Node (embedded schema)
const switchNodeSchema = new mongoose.Schema(
    {
        id: String,
        name: { type: String, required: true },
        ip: { type: String, required: true },
        jenis: String,
        sn: String,
        ch: [
            {
                port: String,
                segment: String,
                trunk: { type: String, default: "N" },
                status: { type: String, default: "N" },
                ip: String,
                keterangan: String,
            },
        ],
        children: [this], // Self-referencing for tree structure
    },
    {
        strict: false, // Allow flexible schema
        _id: false, // Don't create separate _id for embedded schema
    }
);

// Main Schema untuk Switch Data
const switchDataSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        datasource: {
            type: switchNodeSchema,
            required: true,
        },
        lastModified: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// Indexes untuk optimasi query
switchDataSchema.index({ userId: 1, lastModified: -1 });

// Instance methods
switchDataSchema.methods.updateLastModified = function () {
    this.lastModified = new Date();
    return this.save();
};

// Static methods
switchDataSchema.statics.findByUserId = function (userId) {
    return this.findOne({ userId });
};

switchDataSchema.statics.getUserStats = async function (userId) {
    const data = await this.findOne({ userId });
    if (!data) return null;

    return {
        lastModified: data.lastModified,
        dataSize: JSON.stringify(data.datasource).length,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };
};

const SwitchData = mongoose.model("SwitchData", switchDataSchema);

module.exports = SwitchData;
